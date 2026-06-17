'use client'
import { useState } from 'react'
import { Check, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import type { RsvpFormData, DietaryOption, Transport } from '@/lib/types'

const DIET_VALUES: DietaryOption[] = ['vegetarian','vegan','gluten_free','lactose_free','nut_allergy','shellfish_allergy','halal','kosher']
const TRANSPORT_VALUES: Transport[] = ['car','train','plane','shuttle','other']

const EMPTY: RsvpFormData = {
  first_name: '', last_name: '', email: '', phone: '',
  attending: true, arrival_day: '', departure_day: '',
  transport: 'car', plus_one: false, plus_one_name: '',
  dietary_guest: [], dietary_plus_one: [], notes: '',
}

const inputClass = 'w-full border border-greige bg-ivory px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-azure transition-colors placeholder:text-greige'

export default function RsvpForm() {
  const { t, locale } = useLocale()
  const [form, setForm] = useState<RsvpFormData>(EMPTY)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Dietary labels localized
  const dietLabels: Record<string,string> = locale === 'it'
    ? { vegetarian:'Vegetariano', vegan:'Vegano', gluten_free:'Senza Glutine', lactose_free:'Senza Lattosio', nut_allergy:'Allergia Frutta Secca', shellfish_allergy:'Allergia Molluschi', halal:'Halal', kosher:'Kosher' }
    : { vegetarian:'Vegetarian', vegan:'Vegan', gluten_free:'Gluten-free', lactose_free:'Lactose-free', nut_allergy:'Nut Allergy', shellfish_allergy:'Shellfish Allergy', halal:'Halal', kosher:'Kosher' }

  const set = (k: keyof RsvpFormData, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

  const validate = () => {
    if (!form.first_name || !form.last_name || !form.email) {
      setErrorMsg(t.rsvp.required_msg); return false
    }
    setErrorMsg(''); return true
  }

  const next = () => { if (step === 0 && !validate()) return; setStep(s => Math.min(s + 1, 2)) }

  const submit = async () => {
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error'); setErrorMsg(t.rsvp.error_msg)
    }
  }

  const toggleDiet = (field: 'dietary_guest'|'dietary_plus_one', v: DietaryOption) => {
    const arr = form[field]
    set(field, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
  }

  const DietGrid = ({ field }: { field: 'dietary_guest'|'dietary_plus_one' }) => (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {DIET_VALUES.map(v => {
        const on = form[field].includes(v)
        return (
          <label key={v} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors
              ${on ? 'bg-bordeaux border-bordeaux' : 'border-greige group-hover:border-azure'}`}>
              {on && <Check size={10} className="text-white" />}
            </div>
            <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleDiet(field, v)} />
            <span className="font-sans text-xs text-charcoal">{dietLabels[v]}</span>
          </label>
        )
      })}
    </div>
  )

  const Field = ({ label, required, children, className = '' }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={className}>
      <label className="block font-mono text-xs tracking-widest uppercase text-mist mb-2">
        {label}{required && <span className="text-bordeaux ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  if (status === 'success') {
    return (
      <section id="rsvp" className="py-section bg-ivory">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={24} className="text-olive" />
          </div>
          <h2 className="font-serif text-3xl text-charcoal mb-3">{t.rsvp.success_title} {form.first_name}! 🌿</h2>
          <p className="text-mist leading-relaxed">{t.rsvp.success_msg}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-section bg-ivory">
      <div className="max-w-2xl mx-auto px-6">
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">{t.rsvp.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">{t.rsvp.title}</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.rsvp.desc}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8 reveal">
          {t.rsvp.steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-colors
                  ${i < step ? 'bg-olive text-white' : i === step ? 'bg-bordeaux text-white' : 'bg-greige text-mist'}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`font-mono text-xs mt-1.5 tracking-wider hidden sm:block ${i === step ? 'text-bordeaux' : 'text-mist'}`}>{label}</span>
              </div>
              {i < t.rsvp.steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors ${i < step ? 'bg-olive' : 'bg-greige'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card reveal">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">
                  {t.rsvp.attending_q}<span className="text-bordeaux ml-1">*</span>
                </p>
                <div className="flex gap-3">
                  {[{ v: true, l: t.rsvp.yes }, { v: false, l: t.rsvp.no }].map(opt => (
                    <button key={String(opt.v)} type="button" onClick={() => set('attending', opt.v)}
                            className={`flex-1 py-3 font-mono text-xs tracking-widest uppercase border transition-colors
                              ${form.attending === opt.v ? 'bg-bordeaux border-bordeaux text-ivory' : 'border-greige text-mist hover:border-azure'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Field label={t.rsvp.first_name} required>
                  <input className={inputClass} value={form.first_name} onChange={e => set('first_name', e.target.value)} />
                </Field>
                <Field label={t.rsvp.last_name} required>
                  <input className={inputClass} value={form.last_name} onChange={e => set('last_name', e.target.value)} />
                </Field>
                <Field label={t.rsvp.email} required>
                  <input className={inputClass} type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label={t.rsvp.phone}>
                  <input className={inputClass} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t.rsvp.arrival}>
                  <input className={inputClass} type="date" value={form.arrival_day} min="2027-07-10" max="2027-07-12" onChange={e => set('arrival_day', e.target.value)} />
                </Field>
                <Field label={t.rsvp.departure}>
                  <input className={inputClass} type="date" value={form.departure_day} min="2027-07-11" max="2027-07-13" onChange={e => set('departure_day', e.target.value)} />
                </Field>
              </div>
              <Field label={t.rsvp.transport}>
                <div className="relative">
                  <select className={`${inputClass} appearance-none`} value={form.transport} onChange={e => set('transport', e.target.value as Transport)}>
                    {TRANSPORT_VALUES.map((v, i) => <option key={v} value={v}>{t.rsvp.transport_options[i]}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                </div>
              </Field>
              {form.transport === 'shuttle' && (
                <div className="p-4 bg-olive/5 border border-olive/20">
                  <p className="font-sans text-xs text-olive leading-relaxed">{t.rsvp.shuttle_msg}</p>
                </div>
              )}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${form.plus_one ? 'bg-bordeaux border-bordeaux' : 'border-greige'}`}>
                    {form.plus_one && <Check size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={form.plus_one} onChange={e => set('plus_one', e.target.checked)} />
                  <span className="font-mono text-xs tracking-widest uppercase text-charcoal">{t.rsvp.plus_one}</span>
                </label>
                {form.plus_one && (
                  <div className="mt-4 pl-8">
                    <Field label={t.rsvp.plus_one_name} required>
                      <input className={inputClass} value={form.plus_one_name} onChange={e => set('plus_one_name', e.target.value)} />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">{t.rsvp.diet_guest}</p>
                <DietGrid field="dietary_guest" />
              </div>
              {form.plus_one && (
                <div className="border-t border-greige pt-5">
                  <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">{t.rsvp.diet_plus} {form.plus_one_name || '+1'}</p>
                  <DietGrid field="dietary_plus_one" />
                </div>
              )}
              <Field label={t.rsvp.notes} className="border-t border-greige pt-5">
                <textarea className={`${inputClass} resize-none h-28`} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder={t.rsvp.notes_placeholder} />
              </Field>
            </div>
          )}

          {errorMsg && <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3 mt-4">{errorMsg}</p>}

          <div className="flex gap-3 mt-6 pt-5 border-t border-greige">
            {step > 0 && <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost flex-shrink-0">{t.rsvp.back}</button>}
            {step < 2 ? (
              <button type="button" onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {t.rsvp.next} <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={status === 'loading'} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> {t.rsvp.sending}</> : form.attending ? t.rsvp.submit : t.rsvp.submit_no}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
