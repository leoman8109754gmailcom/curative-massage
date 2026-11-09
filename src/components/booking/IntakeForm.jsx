import { Field, FieldError, Radio, Checkbox, Reveal, labelClass, inputClass, textareaClass } from '../form'
import { healthConditions, pressureOptions, productAllergies, consentText } from '../../data/intake'

export const emptyIntake = {
  fullName: '', dob: '', phone: '', email: '',
  street: '', city: '', state: 'TX', zip: '',
  emergencyName: '', emergencyPhone: '',
  conditions: [], conditionsOther: '',
  concerns: '', medications: '',
  pressure: '', focusAreas: '', avoidAreas: '',
  hasAllergies: '', allergyItems: [], allergyOther: '', allergyDetails: '',
  consent: false, signature: '',
}

const phoneOk = (v) => /^[\d\s()+.-]{7,}$/.test(v)

export function validateIntake(v) {
  const e = {}
  if (!v.fullName.trim()) e.fullName = 'Please enter your full name.'
  if (!v.dob) e.dob = 'Please enter your date of birth.'
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.'
  else if (!phoneOk(v.phone)) e.phone = 'Please enter a valid phone number.'
  if (!v.email.trim()) e.email = 'Please enter your email.'
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Please enter a valid email.'
  if (!v.emergencyName.trim()) e.emergencyName = 'Please enter an emergency contact.'
  if (!v.emergencyPhone.trim()) e.emergencyPhone = 'Please enter their phone number.'
  else if (!phoneOk(v.emergencyPhone)) e.emergencyPhone = 'Please enter a valid phone number.'
  if (v.conditions.includes('Other') && !v.conditionsOther.trim()) e.conditionsOther = 'Please describe the other condition.'
  if (!v.pressure) e.pressure = 'Please choose a pressure preference.'
  if (!v.hasAllergies) e.hasAllergies = 'Please answer yes or no.'
  if (v.hasAllergies === 'yes' && v.allergyItems.length === 0 && !v.allergyOther.trim())
    e.allergyItems = 'Please check what you are sensitive to.'
  if (v.allergyItems.includes('Other') && !v.allergyOther.trim()) e.allergyOther = 'Please describe the other sensitivity.'
  if (!v.consent) e.consent = 'Please confirm you have read and agree.'
  if (!v.signature.trim()) e.signature = 'Please type your full name to sign.'
  else if (v.fullName.trim() && v.signature.trim().toLowerCase() !== v.fullName.trim().toLowerCase())
    e.signature = 'Your signature should match the full name above.'
  return e
}

function Section({ number, title, children }) {
  return (
    <section className="border-t border-slate-blue/20 pt-10 first:border-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-sm text-slate-blue/50">{String(number).padStart(2, '0')}</span>
        <h3 className="font-display text-2xl uppercase tracking-wide md:text-3xl">{title}</h3>
      </div>
      <div className="mt-8 space-y-8">{children}</div>
    </section>
  )
}

export default function IntakeForm({ values, setValues, errors, setErrors, signedDate }) {
  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }
  const onInput = (e) => set(e.target.name, e.target.value)
  const toggle = (name, item) =>
    set(name, values[name].includes(item) ? values[name].filter((x) => x !== item) : [...values[name], item])

  const fp = (name) => ({
    id: name, name, value: values[name], onChange: onInput,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <div className="space-y-12">
      {/* 1. Client information */}
      <Section number={1} title="Client information">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field label="Full name" name="fullName" error={errors.fullName}>
            <input type="text" autoComplete="name" className={inputClass} {...fp('fullName')} />
          </Field>
          <Field label="Date of birth" name="dob" error={errors.dob}>
            <input type="date" autoComplete="bday" max={signedDate} className={`${inputClass} uppercase`} {...fp('dob')} />
          </Field>
          <Field label="Phone number" name="phone" error={errors.phone}>
            <input type="tel" autoComplete="tel" className={inputClass} {...fp('phone')} />
          </Field>
          <Field label="Email address" name="email" error={errors.email}>
            <input type="email" autoComplete="email" className={inputClass} {...fp('email')} />
          </Field>
        </div>

        <div className="grid gap-8 sm:grid-cols-[2fr_1fr_1fr] sm:gap-6">
          <Field label="Street address" name="street">
            <input type="text" autoComplete="street-address" className={inputClass} {...fp('street')} />
          </Field>
          <Field label="City" name="city">
            <input type="text" autoComplete="address-level2" className={inputClass} {...fp('city')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State" name="state">
              <input type="text" autoComplete="address-level1" maxLength={2} className={`${inputClass} uppercase`} {...fp('state')} />
            </Field>
            <Field label="ZIP" name="zip">
              <input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={10} className={inputClass} {...fp('zip')} />
            </Field>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field label="Emergency contact name" name="emergencyName" error={errors.emergencyName}>
            <input type="text" className={inputClass} {...fp('emergencyName')} />
          </Field>
          <Field label="Emergency contact phone" name="emergencyPhone" error={errors.emergencyPhone}>
            <input type="tel" className={inputClass} {...fp('emergencyPhone')} />
          </Field>
        </div>
      </Section>

      {/* 2. Health history */}
      <Section number={2} title="Health history">
        <fieldset>
          <legend className={labelClass}>Please check any that apply</legend>
          <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...healthConditions, 'Other'].map((c) => (
              <Checkbox key={c} name="conditions" value={c} checked={values.conditions.includes(c)} onChange={() => toggle('conditions', c)}>
                {c}
              </Checkbox>
            ))}
          </div>
          <Reveal open={values.conditions.includes('Other')}>
            <div className="pt-6">
              <Field label="Other condition" name="conditionsOther" error={errors.conditionsOther}>
                <input type="text" className={inputClass} {...fp('conditionsOther')} />
              </Field>
            </div>
          </Reveal>
        </fieldset>
      </Section>

      {/* 3. Symptoms + medications */}
      <Section number={3} title="Concerns & medications">
        <Field label="Current symptoms or areas of concern" name="concerns"
          hint="Please describe any pain, tension, injuries, or areas you would like addressed.">
          <textarea rows={4} placeholder="Type here…" className={textareaClass} {...fp('concerns')} />
        </Field>
        <Field label="Medications" name="medications"
          hint="Please list any medications, supplements, or topical creams you currently use.">
          <textarea rows={3} placeholder="Type here…" className={textareaClass} {...fp('medications')} />
        </Field>
      </Section>

      {/* 4. Massage preferences */}
      <Section number={4} title="Massage preferences">
        <fieldset aria-describedby={errors.pressure ? 'pressure-error' : undefined}>
          <legend className={labelClass}>Pressure preference</legend>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:flex sm:gap-10">
            {pressureOptions.map((p) => (
              <Radio key={p} name="pressure" value={p} checked={values.pressure === p} onChange={() => set('pressure', p)}>{p}</Radio>
            ))}
          </div>
          <FieldError name="pressure" error={errors.pressure} />
        </fieldset>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field label="Areas to focus on" name="focusAreas">
            <input type="text" placeholder="e.g. neck, shoulders" className={inputClass} {...fp('focusAreas')} />
          </Field>
          <Field label="Areas to avoid" name="avoidAreas">
            <input type="text" placeholder="e.g. feet, face" className={inputClass} {...fp('avoidAreas')} />
          </Field>
        </div>
      </Section>

      {/* 5. Allergies & sensitivities */}
      <Section number={5} title="Allergies & sensitivities">
        <fieldset aria-describedby={errors.hasAllergies ? 'hasAllergies-error' : undefined}>
          <legend className={labelClass}>Do you have any allergies or sensitivities to massage products?</legend>
          <div className="mt-5 flex gap-10">
            <Radio name="hasAllergies" value="yes" checked={values.hasAllergies === 'yes'} onChange={() => set('hasAllergies', 'yes')}>Yes</Radio>
            <Radio name="hasAllergies" value="no" checked={values.hasAllergies === 'no'} onChange={() => set('hasAllergies', 'no')}>No</Radio>
          </div>
          <FieldError name="hasAllergies" error={errors.hasAllergies} />
        </fieldset>

        <Reveal open={values.hasAllergies === 'yes'}>
          <div className="space-y-8 pt-2">
            <fieldset>
              <legend className={labelClass}>If yes, please check all that apply</legend>
              <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...productAllergies, 'Other'].map((a) => (
                  <Checkbox key={a} name="allergyItems" value={a} checked={values.allergyItems.includes(a)} onChange={() => toggle('allergyItems', a)}>
                    {a}
                  </Checkbox>
                ))}
              </div>
              <FieldError name="allergyItems" error={errors.allergyItems} />
            </fieldset>
            <Reveal open={values.allergyItems.includes('Other')}>
              <Field label="Other sensitivity" name="allergyOther" error={errors.allergyOther}>
                <input type="text" className={inputClass} {...fp('allergyOther')} />
              </Field>
            </Reveal>
            <Field label="Reactions or specific ingredients to avoid" name="allergyDetails">
              <textarea rows={3} placeholder="Type here…" className={textareaClass} {...fp('allergyDetails')} />
            </Field>
          </div>
        </Reveal>
      </Section>

      {/* 6. Consent */}
      <Section number={6} title="Consent & acknowledgment">
        <div className="space-y-3 rounded-xl border border-slate-blue/20 bg-white/25 p-5 text-xs uppercase leading-relaxed tracking-[0.06em] text-slate-blue/90 sm:p-6">
          {consentText.map((t) => <p key={t}>{t}</p>)}
        </div>
        <div>
          <Checkbox name="consent" checked={values.consent} onChange={(e) => set('consent', e.target.checked)}>
            I have read and agree to the statements above
          </Checkbox>
          <FieldError name="consent" error={errors.consent} />
        </div>
        <div className="grid gap-8 sm:grid-cols-[2fr_1fr] sm:gap-6">
          <Field label="Client signature" name="signature" error={errors.signature} hint="Type your full name to sign.">
            <input type="text" autoComplete="name" className={`${inputClass} font-display text-lg normal-case tracking-wider`} {...fp('signature')} />
          </Field>
          <div>
            <p className={labelClass}>Date</p>
            <p className="mt-2 border-b border-slate-blue/30 py-3 text-sm tracking-wide">{signedDate}</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
