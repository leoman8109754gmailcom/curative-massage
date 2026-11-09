// ─────────────────────────────────────────────────────────────
//  Booking availability: edit these to match the therapist's schedule.
//  All placeholder values. Confirm the real hours with the client.
// ─────────────────────────────────────────────────────────────

// Times are in the studio's local time (San Antonio).
export const businessTimeZone = 'America/Chicago'

// Opening hours per weekday (0 = Sunday … 6 = Saturday). `null` = closed.
export const weeklyHours = {
  0: null,
  1: { open: '09:00', close: '18:00' },
  2: { open: '09:00', close: '18:00' },
  3: { open: '09:00', close: '18:00' },
  4: { open: '09:00', close: '18:00' },
  5: { open: '09:00', close: '18:00' },
  6: { open: '10:00', close: '16:00' },
}

// Session lengths a client can pick, in minutes.
export const sessionLengths = [60, 90]

// Start times are offered every N minutes (9:00, 9:30, 10:00 …).
export const slotInterval = 30

// Break kept free after each appointment (cleanup / turnover).
export const bufferMinutes = 15

// How soon / how far ahead clients can book.
export const minNoticeHours = 24
export const bookingWindowDays = 60

// Days off: holidays, vacation, etc. Format 'YYYY-MM-DD'.
export const blockedDates = [
  // '2026-12-25',
]
