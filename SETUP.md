# Lunaria — Setup Guide (sync + installable app)

This turns Lunaria into a real web app: signed in with Google, synced to the
cloud, and installable on your phone/laptop home screen. It takes about
15 minutes, all free.

There are two parts: **(A) set up Firebase** (the database + Google sign-in),
then **(B) put the files online** (so it has a real web address).

---

## Part A — Firebase (5–10 min)

1. Go to https://console.firebase.google.com and sign in with Google.
2. Click **Add project**. Name it anything (e.g. "lunaria"). You can skip
   Google Analytics — not needed.
3. Once the project loads, click the **</> (Web)** icon on the project
   overview page to register a web app. Give it any nickname, click
   **Register app**. You'll see a code block with a `firebaseConfig`
   object — copy the six values it shows (`apiKey`, `authDomain`, etc).
4. Open `index.html` in a text editor, find this block near the bottom
   (search for `PASTE YOUR FIREBASE CONFIG`), and replace the placeholder
   values with the real ones you just copied:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
5. In the left sidebar of the Firebase console, find **Security > Authentication**
   (Firebase recently reorganized their console — this used to be under
   "Build") → click **Get started** → under "Sign-in method," enable
   **Google** → pick a support email → **Save**.
6. In the left sidebar, find **Databases & Storage > Firestore** (also
   moved out of "Build") → **Create database** → choose a location close
   to you → start in **production mode** → **Enable**.
7. Still in Firestore, go to the **Rules** tab and replace the contents with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
   Click **Publish**. This makes sure only you (once signed in) can read or
   write your own data.

That's the whole backend — no server code, nothing to run.

---

## Part B — Put it online (5 min, no coding, free)

You need the app hosted at a real `https://` address for Google sign-in and
app installation to work (a downloaded file on your computer can't do either).

**Netlify Drop — free, no credit card ever needed:**

1. Go to https://app.netlify.com/drop
2. Drag the whole `lunaria` folder (or the `lunaria-app.zip` — Netlify can
   unzip it) onto the page.
3. Netlify gives you a live URL immediately, like `random-name-123.netlify.app`.
4. **Claim it** so it doesn't expire: click **Claim your site** and sign up
   free with just an email, or your Google/GitHub account — still no card.
5. Optional: rename it to something nicer under Site settings > Change
   site name (e.g. `lunaria-yue.netlify.app`).
6. Copy your final URL.
7. Back in the Firebase console: **Security > Authentication > Settings >
   Authorized domains** → **Add domain** → paste in your Netlify domain
   (just the `something.netlify.app` part, no `https://`).

Now open your Netlify URL — you should see the Lunaria sign-in screen.
Sign in with Google, and you're syncing.

---

## Installing it as an app

- **iPhone/iPad (Safari):** open the URL → tap the Share icon → **Add to
  Home Screen**.
- **Android (Chrome):** open the URL → tap the ⋮ menu → **Install app** (or
  you'll see an automatic install banner).
- **Laptop (Chrome/Edge):** open the URL → click the install icon (⊕ or a
  small monitor icon) in the address bar → **Install**.

---

## Updating the app later

If you ever want to change the code again, just re-drag the updated folder
onto your existing Netlify site (drag onto app.netlify.com/drop again while
logged into the same account, or use Site settings > Deploys to upload a
new version).

## A couple of notes

- The zip now includes `logo.png` (your mermaid-on-the-moon artwork) alongside
  the app icons — make sure it's uploaded too, since the app displays it in
  a few places (login screen, header, empty state, postcards).
- Cover images are still stored as compressed images inside each book's
  data — that's fine for normal use, but a single book with a very large
  cover could occasionally fail to save. If that ever happens, the app
  will show a banner telling you.
- Your data now lives in Firestore, not in this HTML file — the **Export
  backup** button still works and is a good habit to use occasionally.
- New this update: a **Reader Page** tab for your social/review links (with
  one-tap copy), a **Postcard** export per book with an editable review,
  a clickable book card that opens a detail view, and **Manage list**
  links next to Genre/Tropes/ARC source so you can rename or delete entries
  — renaming automatically updates any books already using that value.
