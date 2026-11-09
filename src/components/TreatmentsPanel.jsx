import { useState } from 'react'
import { treatments } from '../data/treatments'
import { Button, Chevron } from './ui'

function HandIcon({ className = 'h-11 w-11' }) {
  // Placeholder icon — swap for the real icon later.
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 20c3-1 6-1 9 0l7 2c2 .5 3 2 2 3l-1 1H11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15c0-4 3-8 8-8s7 3 7 6-3 5-6 5" strokeLinecap="round" />
      <path d="M14 13c1-2 3-2 4-1" strokeLinecap="round" />
    </svg>
  )
}

function Details({ treatment, compact = false }) {
  return (
    <>
      {!compact && <HandIcon />}
      {!compact && (
        <h3 className="mt-8 font-display text-4xl uppercase tracking-wide text-white lg:text-5xl">{treatment.title}</h3>
      )}
      <p className={`${compact ? '' : 'mt-6'} max-w-xl text-xs uppercase leading-relaxed tracking-[0.1em] text-cream/90`}>
        {treatment.description}
      </p>
      <p className={`${compact ? 'mt-4 text-lg' : 'mt-8 text-2xl'} font-display uppercase tracking-wide text-white`}>
        Price: {treatment.price}
      </p>
      <div className="mt-5 flex items-center gap-2">
        <Button href={`/book?treatment=${treatment.id}`} variant="blue" className="bg-white/10 hover:bg-white/15">Book</Button>
        <Button href={`/book?treatment=${treatment.id}`} variant="ghost">
          Book <Chevron />
        </Button>
      </div>
    </>
  )
}

export default function TreatmentsPanel() {
  // Desktop: hovering a title makes it active. It stays active after the mouse leaves.
  const [activeId, setActiveId] = useState(treatments[0].id)
  // Mobile: tapping a title opens it (accordion). Tapping it again closes it.
  const [openId, setOpenId] = useState(treatments[0].id)

  const active = treatments.find((t) => t.id === activeId)

  return (
    <div className="rounded-2xl bg-slate-blue text-cream">
      {/* ---------- Desktop (md and up): hover list + detail pane ---------- */}
      <div className="hidden min-h-[440px] grid-cols-[2fr_3fr] gap-8 p-8 md:grid lg:p-10">
        <ul className="flex flex-col justify-between">
          {treatments.map((t) => {
            const isActive = t.id === activeId
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(t.id)}
                  onFocus={() => setActiveId(t.id)}
                  onClick={() => setActiveId(t.id)}
                  aria-pressed={isActive}
                  className={`origin-left text-left font-display text-2xl uppercase tracking-wide transition-all duration-300 ease-out lg:text-3xl ${
                    isActive ? 'translate-x-1 text-white opacity-100' : 'text-cream opacity-40 hover:opacity-70'
                  }`}
                >
                  {t.title}
                </button>
              </li>
            )
          })}
        </ul>

        {/* `key` remounts the pane on change so the fade-in animation replays */}
        <div key={active.id} className="animate-treatment-in self-center py-4" aria-live="polite">
          <Details treatment={active} />
        </div>
      </div>

      {/* ---------- Mobile: tap-to-open accordion ---------- */}
      <ul className="divide-y divide-white/10 px-5 py-2 md:hidden">
        {treatments.map((t) => {
          const isOpen = t.id === openId
          const someOpen = openId !== null
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : t.id)}
                aria-expanded={isOpen}
                aria-controls={`treatment-${t.id}`}
                className={`flex w-full items-center justify-between py-5 text-left font-display text-xl uppercase tracking-wide transition-opacity duration-300 ${
                  isOpen || !someOpen ? 'text-white opacity-100' : 'text-cream opacity-40'
                }`}
              >
                {t.title}
                <svg
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                </svg>
              </button>

              {/* grid-rows 0fr → 1fr animates the height smoothly */}
              <div
                id={`treatment-${t.id}`}
                className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6">
                    <Details treatment={t} compact />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
