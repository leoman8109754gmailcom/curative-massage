import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { treatments } from '../data/treatments'
import { sessionLengths, businessTimeZone } from '../data/availability'
import { getBookedSlots, submitBooking, studioNow, formatDate, formatTime, formatDuration } from '../lib/booking'
import DateTimePicker from '../components/booking/DateTimePicker'
import IntakeForm, { emptyIntake, validateIntake } from '../components/booking/IntakeForm'
import { Button } from '../components/ui'

const STEPS = ['Session', 'Date & time', 'Intake form', 'Review']

function Stepper({ step, onJump }) {
  return (
    <ol className="mx-auto flex max-w-3xl items-center">
      {STEPS.map((label, i) => {
        const done = i < step, current = i === step
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => done && onJump(i)}
              disabled={!done}
              aria-current={current ? 'step' : undefined}
              className="group flex flex-col items-center gap-2 disabled:cursor-default"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs transition-all duration-300 ${
                current ? 'scale-110 border-slate-blue bg-slate-blue text-cream-light'
                  : done ? 'border-slate-blue bg-slate-blue/10 text-slate-blue group-hover:bg-slate-blue/20'
                  : 'border-slate-blue/30 text-slate-blue/40'
              }`}>
                {done ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i + 1}
              </span>
              <span className={`hidden text-[10px] uppercase tracking-[0.15em] sm:block ${current ? 'text-slate-blue' : 'text-slate-blue/55'}`}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="mx-2 h-px flex-1 bg-slate-blue/20 sm:mx-3 sm:-mt-6">
                <span className={`block h-px bg-slate-blue transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function NavButtons({ onBack, onNext, nextLabel = 'Continue', nextDisabled, busy }) {
  return (
    <div className="mt-12 flex items-center justify-between gap-4">
      {onBack ? (
        <button type="button" onClick={onBack} className="text-sm uppercase tracking-[0.12em] text-slate-blue/75 hover:text-slate-blue">
          ← Back
        </button>
      ) : <span />}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || busy}
        className="rounded-lg bg-slate-blue px-6 py-3 text-sm uppercase tracking-[0.12em] text-cream-light shadow-sm transition hover:bg-slate-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? 'Sending…' : nextLabel}
      </button>
    </div>
  )
}

function SummaryRow({ label, children }) {
  if (!children || (Array.isArray(children) && !children.length)) return null
  return (
    <div className="grid gap-1 border-b border-slate-blue/15 py-3 sm:grid-cols-[200px_1fr] sm:gap-6">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-blue/60">{label}</dt>
      <dd className="text-sm tracking-wide">{children}</dd>
    </div>
  )
}

const usDate = (key) => { const [y, m, d] = key.split('-'); return `${m}/${d}/${y}` }

export default function BookingPage() {
  const [params] = useSearchParams()
  const preset = treatments.find((t) => t.id === params.get('treatment'))

  const [step, setStep] = useState(0)
  const [treatmentId, setTreatmentId] = useState(preset?.id ?? null)
  const [duration, setDuration] = useState(sessionLengths[0])
  const [slot, setSlot] = useState({ date: null, time: null })
  const [booked, setBooked] = useState([])
  const [intake, setIntake] = useState(emptyIntake)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const topRef = useRef(null)

  const today = studioNow().date
  const treatment = treatments.find((t) => t.id === treatmentId)

  useEffect(() => { getBookedSlots().then(setBooked) }, [])

  const go = (n) => {
    setStep(n)
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const nextFromIntake = () => {
    const found = validateIntake(intake)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const el = document.getElementById(first) || document.querySelector(`[name="${first}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus?.({ preventScroll: true })
      return
    }
    go(3)
  }

  const confirm = async () => {
    setStatus('sending')
    const v = intake
    const booking = {
      appointment: {
        treatmentId: treatment.id,
        treatment: treatment.title,
        durationMinutes: duration,
        date: slot.date,
        startTime: formatTime(slot.time),
        startMinutes: slot.time,
        timeZone: businessTimeZone,
      },
      client: {
        fullName: v.fullName, dateOfBirth: v.dob, phone: v.phone, email: v.email,
        address: { street: v.street, city: v.city, state: v.state, zip: v.zip },
        emergencyContact: { name: v.emergencyName, phone: v.emergencyPhone },
      },
      health: {
        conditions: v.conditions.filter((c) => c !== 'Other'),
        otherCondition: v.conditions.includes('Other') ? v.conditionsOther : '',
        concerns: v.concerns,
        medications: v.medications,
      },
      preferences: { pressure: v.pressure, focusAreas: v.focusAreas, avoidAreas: v.avoidAreas },
      allergies: {
        hasAllergies: v.hasAllergies === 'yes',
        items: v.hasAllergies === 'yes' ? v.allergyItems.filter((a) => a !== 'Other') : [],
        other: v.hasAllergies === 'yes' && v.allergyItems.includes('Other') ? v.allergyOther : '',
        details: v.hasAllergies === 'yes' ? v.allergyDetails : '',
      },
      consent: { agreed: v.consent, signature: v.signature, signedDate: today },
      submittedAt: new Date().toISOString(),
    }
    try {
      await submitBooking(booking)
      setStatus('sent')
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch {
      setStatus('error')
    }
  }

  const appointmentLine = treatment && slot.time != null &&
    `${formatDate(slot.date)} · ${formatTime(slot.time)} · ${formatDuration(duration)}`

  return (
    <>
      <section className="bg-cream px-6 pt-28 pb-14 text-center md:pt-32">
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-6xl">Book a session</h1>
        <p className="mx-auto mt-8 max-w-xl text-sm uppercase leading-relaxed tracking-[0.08em] text-slate-blue/85">
          Choose your treatment and a time that suits you, then tell me a little about yourself so your session fits what your body needs.
        </p>
      </section>

      <section ref={topRef} className="scroll-mt-20 bg-cream px-6 pb-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {status === 'sent' ? (
            <div className="animate-treatment-in mx-auto max-w-2xl rounded-2xl bg-slate-blue p-8 text-center text-cream sm:p-12" role="status">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-cream/40">
                <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="mt-6 font-display text-3xl uppercase tracking-wide text-white">Request received</h2>
              <p className="mt-4 text-sm uppercase leading-relaxed tracking-[0.08em] text-cream/85">
                Thank you, {intake.fullName.split(' ')[0]}. Your booking request for {treatment.title} on {appointmentLine} has been sent.
                I'll confirm your appointment by email at {intake.email}.
              </p>
              <Button href="/" variant="cream" className="mt-8">Back to home</Button>
            </div>
          ) : (
            <>
              <Stepper step={step} onJump={go} />

              <div key={step} className="animate-treatment-in mt-14">
                {/* STEP 1: session */}
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">Choose your treatment</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {treatments.map((t) => {
                        const active = t.id === treatmentId
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTreatmentId(t.id)}
                            aria-pressed={active}
                            className={`rounded-2xl border p-6 text-left transition-all duration-300 ${
                              active ? 'border-slate-blue bg-slate-blue text-cream shadow-lg' : 'border-slate-blue/25 hover:border-slate-blue/60 hover:bg-white/20'
                            }`}
                          >
                            <span className={`font-display text-xl uppercase tracking-wide ${active ? 'text-white' : ''}`}>{t.title}</span>
                            <span className={`mt-3 line-clamp-2 block text-[11px] uppercase leading-relaxed tracking-[0.06em] ${active ? 'text-cream/85' : 'text-slate-blue/75'}`}>
                              {t.description}
                            </span>
                            <span className={`mt-4 block font-display text-sm tracking-wide ${active ? 'text-white' : ''}`}>{t.price}</span>
                          </button>
                        )
                      })}
                    </div>

                    <h3 className="mt-12 font-display text-xl uppercase tracking-wide">Session length</h3>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {sessionLengths.map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => { setDuration(len); setSlot({ date: slot.date, time: null }) }}
                          aria-pressed={len === duration}
                          className={`rounded-full border px-6 py-2.5 text-sm uppercase tracking-[0.1em] transition ${
                            len === duration ? 'border-slate-blue bg-slate-blue text-cream-light' : 'border-slate-blue/40 hover:border-slate-blue'
                          }`}
                        >
                          {len} min
                        </button>
                      ))}
                    </div>

                    <NavButtons onNext={() => go(1)} nextDisabled={!treatment} />
                  </div>
                )}

                {/* STEP 2: date & time */}
                {step === 1 && (
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">Pick a date & time</h2>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-blue/70">{treatment.title} · {formatDuration(duration)}</p>
                    </div>
                    <div className="mt-8">
                      <DateTimePicker duration={duration} booked={booked} date={slot.date} time={slot.time} onChange={setSlot} />
                    </div>
                    <NavButtons onBack={() => go(0)} onNext={() => go(2)} nextDisabled={slot.time == null} />
                  </div>
                )}

                {/* STEP 3: intake form */}
                {step === 2 && (
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">Client intake form</h2>
                    <p className="mt-3 text-xs uppercase leading-relaxed tracking-[0.08em] text-slate-blue/75">
                      This helps me plan a safe, effective session. Fields marked by an error are required.
                    </p>
                    <div className="mt-10">
                      <IntakeForm values={intake} setValues={setIntake} errors={errors} setErrors={setErrors} signedDate={usDate(today)} />
                    </div>
                    <NavButtons onBack={() => go(1)} onNext={nextFromIntake} nextLabel="Review booking" />
                  </div>
                )}

                {/* STEP 4: review */}
                {step === 3 && (
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">Review & confirm</h2>

                    <div className="mt-8 rounded-2xl bg-slate-blue p-6 text-cream sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-cream/60">Your appointment</p>
                          <p className="mt-2 font-display text-2xl uppercase tracking-wide text-white">{treatment.title}</p>
                          <p className="mt-2 text-sm uppercase tracking-[0.08em]">{appointmentLine}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.08em] text-cream/65">{treatment.price} · San Antonio time</p>
                        </div>
                        <button type="button" onClick={() => go(1)} className="text-xs uppercase tracking-[0.12em] text-cream/75 underline underline-offset-4 hover:text-white">
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 flex items-baseline justify-between">
                      <h3 className="font-display text-xl uppercase tracking-wide">Your details</h3>
                      <button type="button" onClick={() => go(2)} className="text-xs uppercase tracking-[0.12em] text-slate-blue/75 underline underline-offset-4 hover:text-slate-blue">
                        Edit
                      </button>
                    </div>
                    <dl className="mt-4">
                      <SummaryRow label="Name">{intake.fullName}</SummaryRow>
                      <SummaryRow label="Date of birth">{intake.dob && usDate(intake.dob)}</SummaryRow>
                      <SummaryRow label="Phone / Email">{intake.phone} · {intake.email}</SummaryRow>
                      <SummaryRow label="Address">
                        {(intake.street || intake.city || intake.zip) && [intake.street, intake.city, intake.state, intake.zip].filter(Boolean).join(', ')}
                      </SummaryRow>
                      <SummaryRow label="Emergency contact">{intake.emergencyName} · {intake.emergencyPhone}</SummaryRow>
                      <SummaryRow label="Health history">
                        {[...intake.conditions.filter((c) => c !== 'Other'), intake.conditions.includes('Other') && intake.conditionsOther].filter(Boolean).join(', ') || 'None checked'}
                      </SummaryRow>
                      <SummaryRow label="Areas of concern">{intake.concerns}</SummaryRow>
                      <SummaryRow label="Medications">{intake.medications}</SummaryRow>
                      <SummaryRow label="Pressure">{intake.pressure}</SummaryRow>
                      <SummaryRow label="Focus on">{intake.focusAreas}</SummaryRow>
                      <SummaryRow label="Avoid">{intake.avoidAreas}</SummaryRow>
                      <SummaryRow label="Product allergies">
                        {intake.hasAllergies === 'no' ? 'None'
                          : [...intake.allergyItems.filter((a) => a !== 'Other'), intake.allergyOther].filter(Boolean).join(', ')}
                      </SummaryRow>
                      <SummaryRow label="Signed">{intake.signature} · {usDate(today)}</SummaryRow>
                    </dl>

                    {status === 'error' && (
                      <p className="mt-6 text-sm text-red-700" role="alert">
                        Something went wrong sending your booking. Please try again or contact me directly.
                      </p>
                    )}
                    <NavButtons onBack={() => go(2)} onNext={confirm} nextLabel="Confirm booking" busy={status === 'sending'} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
