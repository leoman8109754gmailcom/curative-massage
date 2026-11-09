import { useMemo, useState } from 'react'
import { toKey, studioNow, lastBookableDate, getSlots, formatDate, formatTime } from '../../lib/booking'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DateTimePicker({ duration, booked, date, time, onChange }) {
  const today = studioNow().date
  const last = lastBookableDate()
  const [ty, tm] = today.split('-').map(Number)
  const [ly, lm] = last.split('-').map(Number)
  const initial = (date ?? today).split('-').map(Number)
  const [view, setView] = useState({ y: initial[0], m: initial[1] })

  const canPrev = view.y > ty || (view.y === ty && view.m > tm)
  const canNext = view.y < ly || (view.y === ly && view.m < lm)
  const shift = (n) => setView(({ y, m }) => {
    const t = y * 12 + (m - 1) + n
    return { y: Math.floor(t / 12), m: (t % 12) + 1 }
  })

  // Build the month grid and which days have at least one free slot.
  const cells = useMemo(() => {
    const first = new Date(Date.UTC(view.y, view.m - 1, 1)).getUTCDay()
    const daysInMonth = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate()
    const out = Array.from({ length: first }, () => null)
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toKey(view.y, view.m, d)
      out.push({ d, key, available: key >= today && getSlots(key, duration, booked).length > 0 })
    }
    return out
  }, [view, duration, booked, today])

  const slots = date ? getSlots(date, duration, booked) : []
  const morning = slots.filter((s) => s < 720)
  const afternoon = slots.filter((s) => s >= 720)

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 text-cream md:grid-cols-[3fr_2fr]">
      {/* Calendar */}
      <div className="bg-slate-blue p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl uppercase tracking-wide text-white sm:text-2xl" aria-live="polite">
            {MONTHS[view.m - 1]} {view.y}
          </h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month"
              className="grid h-9 w-9 place-items-center rounded-full border border-cream/30 transition hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent">
              <Arrow dir="left" />
            </button>
            <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month"
              className="grid h-9 w-9 place-items-center rounded-full border border-cream/30 transition hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent">
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.15em] text-cream/60">
          {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
        </div>
        <div key={`${view.y}-${view.m}`} className="animate-treatment-in mt-1 grid grid-cols-7 gap-1">
          {cells.map((c, i) =>
            c === null ? <div key={`e${i}`} /> : (
              <button
                key={c.key}
                type="button"
                disabled={!c.available}
                onClick={() => onChange({ date: c.key, time: null })}
                aria-pressed={c.key === date}
                aria-label={`${formatDate(c.key)}${c.available ? '' : ', unavailable'}`}
                className={`relative aspect-square rounded-full text-sm transition-all duration-200 ${
                  c.key === date
                    ? 'scale-105 bg-cream-light font-medium text-slate-blue shadow-md'
                    : c.available
                      ? 'text-white hover:bg-white/10'
                      : 'cursor-default text-cream/25 line-through decoration-cream/20'
                }`}
              >
                {c.d}
                {c.key === today && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />}
              </button>
            ),
          )}
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-cream/55">
          Times shown in San Antonio time (CT)
        </p>
      </div>

      {/* Time slots */}
      <div className="bg-slate-blue-dark p-5 sm:p-8">
        {!date ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">
            <p className="font-display text-lg uppercase tracking-wide text-white">Pick a day</p>
            <p className="mt-2 max-w-[220px] text-xs uppercase leading-relaxed tracking-[0.08em] text-cream/65">
              Available days are shown in white. Choose one to see open times.
            </p>
          </div>
        ) : (
          <div key={date} className="animate-treatment-in">
            <p className="text-[10px] uppercase tracking-[0.15em] text-cream/60">Available times</p>
            <h4 className="mt-2 font-display text-lg uppercase tracking-wide text-white">
              {formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h4>
            {[['Morning', morning], ['Afternoon', afternoon]].map(([label, list]) =>
              list.length > 0 && (
                <div key={label} className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cream/60">{label}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onChange({ date, time: s })}
                        aria-pressed={s === time}
                        className={`rounded-lg border px-2 py-2.5 text-xs tracking-wide transition-all duration-200 ${
                          s === time
                            ? 'border-cream-light bg-cream-light text-slate-blue'
                            : 'border-cream/25 text-cream hover:border-cream/60 hover:bg-white/5'
                        }`}
                      >
                        {formatTime(s)}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
