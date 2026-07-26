const CACHE_NAME = 'lunaria-cache-v3';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Cache-first for everything same-origin — once a file is cached, repeat
// visits are served straight from the cache with no network request, which
// is what keeps bandwidth (and Netlify credits) down. To see a new version
// after I ship an update, do one hard refresh (Ctrl+Shift+R / Cmd+Shift+R) —
// that fetches the updated sw.js, which uses a new CACHE_NAME, so it
// re-fetches fresh copies once and then goes back to serving from cache.
// Firebase/Google requests are always passed straight to the network.
self.addEventListener('fetch', function(event){
  var url = event.request.url;
  if(event.request.method !== 'GET') return;
  if(url.indexOf('googleapis.com') !== -1 || url.indexOf('gstatic.com') !== -1 || url.indexOf('firebaseio.com') !== -1 || url.indexOf('firebaseapp.com') !== -1){
    return; // let these go straight to network, don't intercept
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if(cached) return cached;
      return fetch(event.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return res;
      }).catch(function(){ return cached; });
    })
  );
});
