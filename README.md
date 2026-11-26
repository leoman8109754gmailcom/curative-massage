# Curative Massage & Bodyworks

Website for Curative Massage & Bodyworks, built with React, Vite and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Pages

- `/` home
- `/services` massage services with the interactive treatments panel
- `/contact` contact form (no backend yet, see `src/lib/contact.js`)

## Deploy

Hosted on Vercel. `vercel.json` sends every route to `index.html` so links like `/services` work on refresh.

## Content management (Sanity)

Massage techniques (name, description, price, order, show/hide) are managed in Sanity:
project `r83xatdb` (curative-massage-bodyworks), dataset `production`, document type `treatment`.
The Studio's schema matches `sanity/schemaTypes/treatment.js` in this repo.

- Local: `.env.local` sets `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` (see `.env.example`).
- Vercel: the same two variables must be set in Project → Settings → Environment Variables.
- Allowed origins (CORS): http://localhost:3333 (Studio), http://localhost:5173, https://curative-massage.vercel.app.
  Add any custom domain there too when the site moves to one.
- If Sanity can't be reached, the site falls back to the list in `src/data/treatments.js`.
