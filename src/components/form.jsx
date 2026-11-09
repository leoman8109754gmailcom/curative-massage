// Shared form styles and inputs, so the contact and booking forms always match.

export const labelClass = 'block text-sm uppercase tracking-[0.06em] text-slate-blue/85'

export const inputClass =
  'mt-2 w-full border-0 border-b border-slate-blue/70 bg-transparent px-0 py-3 text-sm tracking-wide text-slate-blue outline-none transition-colors placeholder:uppercase placeholder:text-slate-blue/60 focus:border-slate-blue focus:ring-0 aria-[invalid=true]:border-red-700'

export const textareaClass =
  'mt-3 w-full resize-y border-0 border-b border-slate-blue/70 bg-white/25 px-3 py-3 text-sm tracking-wide text-slate-blue outline-none transition-colors placeholder:uppercase placeholder:text-slate-blue/60 focus:border-slate-blue focus:bg-white/40 aria-[invalid=true]:border-red-700'

export function Field({ label, name, error, hint, children }) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{label}</label>
      {hint && <p className="mt-1 text-xs tracking-wide text-slate-blue/65">{hint}</p>}
      {children}
      <FieldError name={name} error={error} />
    </div>
  )
}

export function FieldError({ name, error }) {
  if (!error) return null
  return <p id={`${name}-error`} className="mt-1 text-xs text-red-700">{error}</p>
}

// Round radio button with an animated inner dot.
export function Radio({ name, value, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm uppercase tracking-[0.06em]">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-slate-blue transition peer-focus-visible:ring-2 peer-focus-visible:ring-slate-blue/40 peer-checked:[&>span]:scale-100">
        <span className="h-2.5 w-2.5 scale-0 rounded-full bg-slate-blue transition-transform" />
      </span>
      {children}
    </label>
  )
}

// Square checkbox with an animated tick.
export function Checkbox({ name, value, checked, onChange, children, className = '' }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-sm uppercase tracking-[0.06em] ${className}`}>
      <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border border-slate-blue transition-colors peer-checked:bg-slate-blue peer-focus-visible:ring-2 peer-focus-visible:ring-slate-blue/40 peer-checked:[&>svg]:scale-100">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 scale-0 text-cream-light transition-transform" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  )
}

// Smoothly reveals extra fields (e.g. "If yes, please check all that apply").
export function Reveal({ open, children }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} inert={!open}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}
