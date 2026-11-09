// Shared building blocks used across sections.
import { Link } from 'react-router-dom'
import logoLight from '../assets/logo-light.svg'
import logoDark from '../assets/logo-dark.svg'

// Internal routes ("/services", "/book") go through the router; anything else is a plain anchor.
export function SmartLink({ href = '#', children, ...props }) {
  if (href.startsWith('/')) return <Link to={href} {...props}>{children}</Link>
  return <a href={href} {...props}>{children}</a>
}

export function Button({ href = '#', variant = 'cream', children, className = '' }) {
  const styles = {
    cream: 'bg-cream-light text-slate-blue hover:bg-white',
    blue: 'bg-slate-blue text-cream hover:bg-slate-blue-dark',
    clay: 'bg-clay text-cream-light hover:brightness-110',
    ghost: 'text-cream hover:text-white',
  }
  return (
    <SmartLink
      href={href}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition ${styles[variant]} ${className}`}
    >
      {children}
    </SmartLink>
  )
}

export function Chevron({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Swap `src` in once real photos are provided; until then shows a styled placeholder.
export function ImageSlot({ src, alt = '', label, className = '' }) {
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} />
  return (
    <div className={`img-placeholder flex items-center justify-center ${className}`} role="img" aria-label={alt}>
      {label && <span className="text-xs uppercase tracking-[0.2em] text-cream/50">{label}</span>}
    </div>
  )
}

// `tone="light"` (cream) is for dark-blue backgrounds; `tone="dark"` (blue) is for light backgrounds.
export function Logo({ tone = 'light', className = '', imgClassName = 'h-8' }) {
  return (
    <Link to="/" aria-label="Curative Massage & Bodywork — home" className={`flex items-center ${className}`}>
      <img
        src={tone === 'dark' ? logoDark : logoLight}
        alt="Curative Massage — Massage & Bodywork"
        width="1327"
        height="226"
        className={`w-auto max-w-none ${imgClassName}`}
      />
    </Link>
  )
}
