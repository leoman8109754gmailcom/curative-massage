// Massage techniques ("treatments"), shared by the Services and Booking pages.
//
// With Sanity connected, they're loaded from the CMS, so the therapist can add, edit,
// reorder or hide techniques herself. Otherwise the local list in src/data/treatments.js is used.

import { useEffect, useState } from 'react'
import { treatments as localTreatments } from '../data/treatments'

// The Sanity library is only downloaded when Sanity is actually set up.
const hasSanity = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)

const QUERY = `*[_type == "treatment" && visible != false] | order(order asc, title asc){
  "id": slug.current,
  title,
  description,
  price
}`

let cache = hasSanity ? null : localTreatments
let request = null

function load() {
  request ??= import('./sanity')
    .then(({ sanity }) => sanity.fetch(QUERY))
    .then((list) => (cache = list.filter((t) => t.id && t.title)))
    .catch((err) => {
      console.error('[treatments] could not load from Sanity, using local list', err)
      return (cache = localTreatments)
    })
  return request
}

// Returns { treatments, loading }. Loads once per visit and is shared between pages.
export function useTreatments() {
  const [list, setList] = useState(cache)
  useEffect(() => {
    if (!list) load().then(setList)
  }, [list])
  return { treatments: list ?? [], loading: !list }
}

// "Five", "Six" … for headings like "Five paths to healing".
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
export const countWord = (n) => WORDS[n] ?? String(n)
