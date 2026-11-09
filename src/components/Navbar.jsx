import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Logo, SmartLink } from './ui'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

// Three lines that morph into an X when `open` is true.
function MenuIcon({ open }) {
  const line = 'absolute left-0 h-[1.5px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out'
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <span className={`${line} ${open ? 'top-[9px] rotate-45' : 'top-[3px]'}`} />
      <span className={`${line} top-[9px] ${open ? 'scale-x-0 opacity-0' : 'opacity-100'}`} />
      <span className={`${line} ${open ? 'top-[9px] -rotate-45' : 'top-[15px]'}`} />
    </span>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname, hash } = useLocation()

  // Close the menu whenever the page changes, and on Escape.
  useEffect(() => setMobileOpen(false), [pathname, hash])
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 bg-slate-blue">
      {/* 1fr | auto | 1fr: the middle column always fits the logo, so it never gets squeezed */}
      <nav className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
        {/* Left: links (desktop) / menu button (mobile) */}
        <div className="flex items-center">
          <ul className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.15em] text-cream md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <SmartLink href={l.href} className="hover:text-white">{l.label}</SmartLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="-m-2 p-2 text-cream md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {/* Center: logo. Height scales with screen width on small phones, never the shape. */}
        <Logo imgClassName="h-[clamp(1.4rem,8vw,2rem)]" />

        {/* Right: book */}
        <div className="justify-self-end">
          <Button href="/#book" variant="cream" className="rounded-full px-3 py-1">Book</Button>
        </div>
      </nav>

      {/* Mobile dropdown: panel opens first, then the links fade in one after another */}
      <div
        id="mobile-menu"
        inert={!mobileOpen}
        className={`grid overflow-hidden transition-[grid-template-rows] ease-out md:hidden ${
          mobileOpen ? 'grid-rows-[1fr] duration-500' : 'grid-rows-[0fr] duration-300'
        }`}
        style={{ transitionDelay: mobileOpen ? '100ms' : '150ms' }}
      >
        <div className="min-h-0">
          <ul
            className={`border-t border-white/10 px-6 py-4 text-center text-xs uppercase tracking-[0.15em] text-cream transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {links.map((l, i) => (
              <li
                key={l.label}
                className={`transition-all duration-500 ease-out ${
                  mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: mobileOpen ? `${250 + i * 120}ms` : '0ms' }}
              >
                <SmartLink href={l.href} onClick={() => setMobileOpen(false)} className="block py-3">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
