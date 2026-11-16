// Sanity connection. Turned on by adding these to a `.env.local` file (and to Vercel's
// Environment Variables):
//
//   VITE_SANITY_PROJECT_ID=yourProjectId
//   VITE_SANITY_DATASET=production
//
// Without them the site uses the local fallback data in src/data/.
// Only public, read-only content goes through this client. Never put a write token here.

import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const sanity = projectId
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: true })
  : null
