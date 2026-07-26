# HotZone Cafe — Complete Project (React Frontend + Node Backend)

Everything for the live site: customer menu, admin panel, and API — same design,
same features as the original vanilla version, rebuilt in React with security fixes applied.

## What's in here
```
hotzone-fullstack/
├── frontend/     React (Vite) — customer site + admin panel
└── backend/      Node/Express + MongoDB API
```

---

## STEP-BY-STEP SETUP

### 1. Backend first

```
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in real values:
- `MONGO_URI` — from MongoDB Atlas → Connect → "Connect your application"
- `JWT_SECRET` — generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the cafe owner's login (password 8+ characters)
- `RECOVERY_PIN` — a secret PIN, only for password-reset emergencies

Create the admin account (run once):
```
npm run seed-admin
```
This reads your `.env` values and creates the admin user in MongoDB. You'll see a
confirmation in the terminal but the actual password/PIN are never printed —
you already know them, since you just typed them into `.env`.

Start the backend:
```
npm run dev
```
Should print `Server running on port 5000 ✅` and `MongoDB Connected ✅`.

### 2. Frontend

In a new terminal:
```
cd frontend
npm install
```

Copy your images into `frontend/public/img/`: `logo.jpeg`, `bg.jpg`, `HZ.jpeg`,
`favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`, `site.webmanifest`,
`default-food.png`.

Start it:
```
npm run dev
```
Opens at `http://localhost:5173`.

### 3. Try it out
- Customer site: `http://localhost:5173/`
- Admin login: `http://localhost:5173/admin/login` — use the `ADMIN_USERNAME` /
  `ADMIN_PASSWORD` you set in `.env`
- Admin dashboard: auto-redirects here after login — add/edit/delete menu items,
  change password, change username

---

## GOING LIVE (deploy)

**Backend → Railway**
1. Push the `backend/` folder to its own GitHub repo (`.env` is git-ignored, won't be pushed — good)
2. New Railway project → deploy from that repo
3. In Railway → Variables, paste in the same 5 values from your local `.env`
4. Once deployed, run `npm run seed-admin` — either via Railway's shell, or once
   locally pointed at the production `MONGO_URI` — to create the admin user in the
   live database
5. Note your Railway URL (e.g. `https://hotzone-backend.up.railway.app`)

**Frontend → Vercel**
1. Push `frontend/` to its own GitHub repo
2. Import into Vercel, framework preset: Vite
3. Update `frontend/src/api.js` — change the `API` constant from
   `http://127.0.0.1:5000/api` to your live Railway URL + `/api`
4. Since this uses client-side routing (React Router), add a `vercel.json` in
   `frontend/` so `/admin/dashboard` doesn't 404 on refresh:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
5. Deploy

**Final step — update backend CORS**
In `backend/index.js`, the `origin` array already includes `hotzone-cafe.vercel.app`.
If your live Vercel URL is different, update it there and redeploy the backend.

---

## SECURITY — what's already handled
- Passwords hashed with bcrypt, never stored in plaintext
- Admin credentials come from `.env` only — nothing hardcoded in `createAdmin.js`
- Every menu-editing route (add/edit/delete/toggle) requires a valid admin JWT —
  verified server-side in `middleware/auth.js`, not just hidden on the frontend
- Login and password-reset are rate-limited (10 attempts / 15 min per IP) to stop
  brute-force attempts
- `.env` is git-ignored — real secrets never reach GitHub

## Handing off to the cafe owner
Give them, in person or over a private call — never by email/WhatsApp in plaintext:
- Admin login URL
- Username + password
- The recovery PIN, with a note: "only use this if you're fully locked out — it
  resets your password without needing the old one"
