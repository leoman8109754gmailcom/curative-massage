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
