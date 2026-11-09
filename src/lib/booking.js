// Booking logic: available days/times, and sending the booking.
//
// Dates are plain 'YYYY-MM-DD' strings and times are minutes after midnight,
// both in the studio's time zone, so a visitor's own time zone never shifts a slot.

import {
  businessTimeZone,
  weeklyHours,
  slotInterval,
  bufferMinutes,
  minNoticeHours,
  bookingWindowDays,
  blockedDates,
} from '../data/availability'

// ---------- date helpers ----------

const pad = (n) => String(n).padStart(2, '0')
export const toKey = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`
const parseKey = (key) => key.split('-').map(Number)
const utcDate = (key) => {
  const [y, m, d] = parseKey(key)
  return new Date(Date.UTC(y, m - 1, d))
}
export const weekdayOf = (key) => utcDate(key).getUTCDay()
export const addDays = (key, n) => {
  const d = utcDate(key)
  d.setUTCDate(d.getUTCDate() + n)
  return toKey(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
}
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Current date and time in the studio's time zone.
export function studioNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: businessTimeZone,
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  )
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: +parts.hour * 60 + +parts.minute }
}

// ---------- formatting ----------

export const formatDate = (key, opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'UTC' }).format(utcDate(key))

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`
}

export const formatDuration = (min) => (min % 60 ? `${Math.floor(min / 60)} hr ${min % 60} min` : `${min / 60} hr`)

// ---------- availability ----------

export const lastBookableDate = () => addDays(studioNow().date, bookingWindowDays)

// Start times (in minutes) that are free on `dateKey` for a session of `duration` minutes.
// `booked` = [{ date, start, duration }] of appointments already taken.
export function getSlots(dateKey, duration, booked = []) {
  const hours = weeklyHours[weekdayOf(dateKey)]
  if (!hours || blockedDates.includes(dateKey) || dateKey > lastBookableDate()) return []

  // Earliest allowed start, honouring the minimum notice.
  const now = studioNow()
  const noticeMin = minNoticeHours * 60
  const daysAhead = Math.round((utcDate(dateKey) - utcDate(now.date)) / 86400000)
  const earliest = now.minutes + noticeMin - daysAhead * 1440 // minutes into `dateKey`

  const open = toMinutes(hours.open), close = toMinutes(hours.close)
  const taken = booked.filter((b) => b.date === dateKey)
  const slots = []
  for (let start = open; start + duration <= close; start += slotInterval) {
    if (start < earliest) continue
    const end = start + duration + bufferMinutes
    const clashes = taken.some((b) => start < b.start + b.duration + bufferMinutes && b.start < end)
    if (!clashes) slots.push(start)
  }
  return slots
}

// ---------- backend hooks (not connected yet) ----------
//
// getBookedSlots: return appointments already booked so the calendar hides them.
//   Later: fetch from Sanity, e.g. *[_type == "booking" && date >= $from && date <= $to]{date, start, duration}
//
// submitBooking: send the booking + intake form.
//   Later: POST to a Vercel serverless function (e.g. /api/book) that emails the therapist
//   (free tier: Resend) and/or saves the booking in Sanity. Keep API keys on the server, never here.

export async function getBookedSlots(/* fromKey, toKey */) {
  return []
}

export async function submitBooking(booking) {
  await new Promise((r) => setTimeout(r, 800))
  console.info('[booking] submitted (no backend connected yet):', booking)
  return { ok: true }
}
