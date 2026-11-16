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

Massage techniques (name, description, price, order, show/hide) can be managed in Sanity.
Until Sanity is connected, the site uses the local list in `src/data/treatments.js`.

To connect (free plan):

1. Create a Studio: `npm create sanity@latest -- --template clean --create-project "Curative Massage" --dataset production --output-path studio`
2. Copy `sanity/schemaTypes/` into `studio/schemaTypes/`, then deploy it: `cd studio && npx sanity deploy`
3. In sanity.io/manage → API → CORS origins, add `http://localhost:5173` and the Vercel site URL.
4. Copy `.env.example` to `.env.local` and set `VITE_SANITY_PROJECT_ID`.
   Add the same variables in Vercel → Settings → Environment Variables, then redeploy.
5. Add the techniques in the Studio (the web address names must match any existing booking links,
   e.g. `swedish`, `deep-tissue`).
