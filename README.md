# HunarSetu (frontend prototype)
Plain HTML/CSS/JS. No Node.js or build step. All workers, prices and testimonials are fictional demos.

## Structure
- `index.html, workers.html, profile.html, join.html, about.html, contact.html, legal.html`
- `css/styles.css` shared styles
- `js/data.js` sample data (later replaced by Firestore)
- `js/app.js` header/footer, rendering, filters, form validation

## Upload to GitHub from your phone
1. Open github.com, sign in, tap **New repository**, name it `hunarsetu`, create.
2. Tap **Add file → Create new file**. Type the path (e.g. `css/styles.css`, typing `/` makes folders), paste the code, tap **Commit changes**. Repeat for every file. (Or unzip on your phone and use **Upload files** for the root files.)

## Deploy on Vercel
1. Open vercel.com, sign in with GitHub, tap **Add New → Project**.
2. Import `hunarsetu`, set **Framework Preset: Other**, leave build settings empty, tap **Deploy**.
3. Every GitHub commit redeploys automatically.

## Adding Firebase later
- Auth: add login UI on `join.html`; call Firebase Auth in a new `js/auth.js`.
- Data: replace `W` in `data.js` with a Firestore fetch (`workers` collection); `card()` and profile rendering stay the same.
- Images: swap `avatar()`/`work()` for Firebase Storage URLs.
- Forms: replace the `demoForm` success step with real submissions; add reviews and admin moderation as new pages.
