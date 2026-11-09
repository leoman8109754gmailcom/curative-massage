import { useState } from 'react'
import { Button, Logo, SmartLink } from './ui'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
]

const moreLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/#about' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Pricing', href: '/#pricing' },
]

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-blue">
      <nav className="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-6">
        {/* Left: links */}
        <div className="flex items-center">
          <ul className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.15em] text-cream md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <SmartLink href={l.href} className="hover:text-white">{l.label}</SmartLink>
              </li>
            ))}
            <li className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className="flex items-center gap-1 uppercase tracking-[0.15em] hover:text-white"
                aria-expanded={moreOpen}
              >
                More
                <svg viewBox="0 0 20 20" className={`h-3 w-3 transition ${moreOpen ? 'rotate-180' : ''}`} fill="currentColor">
                  <path d="M5 7l5 6 5-6z" />
                </svg>
              </button>
              {moreOpen && (
                <ul className="absolute left-0 mt-3 w-40 rounded-md bg-slate-blue-dark py-2 shadow-lg">
                  {moreLinks.map((l) => (
                    <li key={l.label}>
                      <SmartLink href={l.href} onClick={() => setMoreOpen(false)} className="block px-4 py-2 hover:bg-white/5">
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          <button
            className="text-cream md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Center: logo */}
        <Logo className="justify-self-center" />

        {/* Right: book */}
        <div className="justify-self-end">
          <Button href="/#book" variant="cream" className="rounded-full px-3 py-1">Book</Button>
        </div>
      </nav>

      {mobileOpen && (
        <ul className="space-y-1 border-t border-white/10 px-6 py-4 text-xs uppercase tracking-[0.15em] text-cream md:hidden">
          {[...links, ...moreLinks].map((l) => (
            <li key={l.label}>
              <SmartLink href={l.href} onClick={() => setMobileOpen(false)} className="block py-2">{l.label}</SmartLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
