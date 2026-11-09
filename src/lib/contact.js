// Contact form submission.
//
// No backend is connected yet: this stub only waits briefly and logs the data,
// so the form behaves like the real thing (loading → success).
//
// To connect a backend later (PHP script, form service or CMS), replace the body
// of submitContact with a real request, for example:
//
//   const res = await fetch('/api/contact.php', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   })
//   if (!res.ok) throw new Error('Could not send message')
//
// The form already shows an error message if this function throws.

export async function submitContact(data) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  console.info('[contact] form submitted (no backend connected yet):', data)
  return { ok: true }
}

export const topics = [
  'Booking an appointment',
  'Questions about a treatment',
  'Pricing',
  'Gift certificates',
  'Other',
]

export const referralSources = [
  'Search engine',
  'Social media',
  'Friend referral',
  'Local directory',
  'Previous client',
  'Other',
]
