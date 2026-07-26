# HotZone Cafe — React Version (Customer Site + Admin Panel)

Full conversion from vanilla HTML/CSS/JS to React (Vite + React Router).
Same visual design, same features, same backend API calls — just React under the hood.
Your Node/Express/MongoDB backend is unchanged.

## Routes
- `/` — customer site (Home / About / Menu)
- `/admin/login` — admin login + forgot-password (recovery PIN) flow
- `/admin/dashboard` — protected dashboard: add/edit/delete menu items, toggle availability,
  change password, change username, logout. Redirects to `/admin/login` if no valid token.

## Setup
1. `npm install`
2. Copy your images (logo.jpeg, bg.jpg, HZ.jpeg, favicons, default-food.png) into `public/img/`
3. `npm run dev` — runs on http://localhost:5173
4. Update backend CORS in `index.js` to allow `http://localhost:5173` (dev) and your
   new frontend's production URL once redeployed.

## Structure
- `src/App.jsx` — React Router setup (3 routes)
- `src/pages/CustomerSite.jsx` — customer-facing page, same as before
- `src/pages/AdminLogin.jsx` — login + forgot-password panels (was admin/login.html)
- `src/pages/AdminDashboard.jsx` — full CRUD table, add/edit forms, password & username modals
  (was admin/dashboard.html + admin.js)
- `src/components/` — Navbar, Home, About, Menu, Footer (customer site)
- `src/style.css` — original site CSS, unchanged
- `src/admin.css` — original admin CSS, unchanged
- `src/api.js` — shared API base URL

## Auth flow (unchanged from original)
- Login → JWT stored in `localStorage` as `token`
- Dashboard verifies token via `/api/auth/verify` on mount, redirects to login if invalid
- Every menu-editing request sends `Authorization: Bearer <token>`
- 401 responses trigger auto-logout after a short delay (same as original `admin.js`)

## Build for deploy
`npm run build` → outputs to `dist/`, deploy to Vercel same as before.
Note: since this now uses client-side routing, if you deploy to Vercel add a rewrite
rule so `/admin/dashboard` etc. serve `index.html` (Vercel usually detects Vite + SPA
automatically, but if routes 404 on refresh, add a `vercel.json` with a catch-all rewrite).
