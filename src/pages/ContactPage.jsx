import { useState } from 'react'
import { submitContact, topics, referralSources } from '../lib/contact'

// Placeholder contact details from the design. Replace with the real ones.
const contactInfo = {
  email: 'example@curativemassage.com',
  phone: '+1 (000) 000-0000',
  location: 'San Antonio, Texas',
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: '',
  referral: '',
  message: '',
}

const labelClass = 'block text-sm uppercase tracking-[0.06em] text-slate-blue/85'
const inputClass =
  'mt-2 w-full border-0 border-b border-slate-blue/70 bg-transparent px-0 py-3 text-sm tracking-wide text-slate-blue outline-none transition-colors placeholder:uppercase placeholder:text-slate-blue/60 focus:border-slate-blue focus:ring-0 aria-[invalid=true]:border-red-700'

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{label}</label>
      {children}
      {error && <p id={`${name}-error`} className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  )
}

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Please enter your first name.'
  if (!values.lastName.trim()) errors.lastName = 'Please enter your last name.'
  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Please enter a valid email.'
  if (values.phone && !/^[\d\s()+.-]{7,}$/.test(values.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!values.message.trim()) errors.message = 'Please write a message.'
  return errors
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6l8.5 7 8.5-7" strokeLinejoin="round" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 006 6l1.5-2 4 1.5v3a1.5 1.5 0 01-1.5 1.5A16 16 0 013.5 5.5 1.5 1.5 0 015 4z" strokeLinejoin="round" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export default function ContactPage() {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitContact(values)
      setStatus('sent')
      setValues(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: update,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <>
      {/* Page header */}
      <section className="bg-cream px-6 pt-28 pb-20 text-center md:pt-32">
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-6xl">Get in touch</h1>
        <p className="mx-auto mt-8 max-w-xl text-sm uppercase leading-relaxed tracking-[0.08em] text-slate-blue/85">
          I'm here to answer your questions and help you schedule your next appointment.
        </p>
      </section>

      {/* Message + form */}
      <section className="bg-cream px-6 pt-12 pb-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:gap-12">
          {/* Left: intro and contact details */}
          <div>
            <p className="text-sm uppercase tracking-[0.06em] text-slate-blue/85">Message</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-wide md:text-5xl">Send a message</h2>
            <p className="mt-6 text-sm uppercase tracking-[0.08em] text-slate-blue/85">
              I promise to get in touch as soon as possible
            </p>

            <ul className="mt-10 space-y-5 text-sm uppercase tracking-[0.06em]">
              <li className="flex items-center gap-4">
                <MailIcon />
                <a href={`mailto:${contactInfo.email}`} className="underline underline-offset-2 hover:opacity-75">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon />
                <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`} className="underline underline-offset-2 hover:opacity-75">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <PinIcon />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>

          {/* Right: form */}
          {status === 'sent' ? (
            <div className="self-start rounded-xl border border-slate-blue/20 p-8" role="status">
              <h3 className="font-display text-2xl uppercase tracking-wide">Thank you</h3>
              <p className="mt-3 text-sm uppercase tracking-[0.06em] text-slate-blue/85">
                Your message has been received. I'll be in touch soon.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-lg bg-slate-blue px-4 py-2 text-sm uppercase tracking-wide text-cream hover:bg-slate-blue-dark"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-9">
              <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
                <Field label="First name" name="firstName" error={errors.firstName}>
                  <input type="text" autoComplete="given-name" className={inputClass} {...fieldProps('firstName')} />
                </Field>
                <Field label="Last name" name="lastName" error={errors.lastName}>
                  <input type="text" autoComplete="family-name" className={inputClass} {...fieldProps('lastName')} />
                </Field>
                <Field label="Email" name="email" error={errors.email}>
                  <input type="email" autoComplete="email" className={inputClass} {...fieldProps('email')} />
                </Field>
                <Field label="Phone number" name="phone" error={errors.phone}>
                  <input type="tel" autoComplete="tel" className={inputClass} {...fieldProps('phone')} />
                </Field>
              </div>

              <Field label="What is this about?" name="topic">
                <div className="relative">
                  <select className={`${inputClass} cursor-pointer appearance-none pr-8 uppercase`} {...fieldProps('topic')}>
                    <option value="">Select one…</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-1 top-1/2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Field>

              <fieldset>
                <legend className={labelClass}>How did you hear about us?</legend>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {referralSources.map((source) => (
                    <label key={source} className="flex cursor-pointer items-center gap-3 text-sm uppercase tracking-[0.06em]">
                      <input
                        type="radio"
                        name="referral"
                        value={source}
                        checked={values.referral === source}
                        onChange={update}
                        className="peer sr-only"
                      />
                      {/* Custom radio circle */}
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-blue transition peer-focus-visible:ring-2 peer-focus-visible:ring-slate-blue/40 peer-checked:[&>span]:scale-100">
                        <span className="h-2.5 w-2.5 scale-0 rounded-full bg-slate-blue transition-transform" />
                      </span>
                      {source}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Message" name="message" error={errors.message}>
                <textarea
                  rows={6}
                  placeholder="Type your message…"
                  className={inputClass.replace('mt-2', 'mt-4').replace('px-0', 'px-3') + ' resize-y'}
                  {...fieldProps('message')}
                />
              </Field>

              {status === 'error' && (
                <p className="text-sm text-red-700" role="alert">
                  Something went wrong sending your message. Please try again or email me directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded-lg border border-cream-light/60 bg-slate-blue px-4 py-2 text-sm uppercase tracking-wide text-cream shadow-sm transition hover:bg-slate-blue-dark disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
