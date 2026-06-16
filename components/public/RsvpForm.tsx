'use client'
import { useState } from 'react'
import { Check, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import type { RsvpFormData, DietaryOption, Transport } from '@/lib/types'

const DIETARY_OPTIONS: { value: DietaryOption; label: string }[] = [
  { value: 'vegetarian',        label: 'Vegetariano' },
  { value: 'vegan',             label: 'Vegano' },
  { value: 'gluten_free',       label: 'Senza Glutine' },
  { value: 'lactose_free',      label: 'Senza Lattosio' },
  { value: 'nut_allergy',       label: 'Allergia Frutta Secca' },
  { value: 'shellfish_allergy', label: 'Allergia Molluschi' },
  { value: 'halal',             label: 'Halal' },
  { value: 'kosher',            label: 'Kosher' },
]

const TRANSPORT_OPTIONS: { value: Transport; label: string }[] = [
  { value: 'car',     label: 'Auto Propria' },
  { value: 'train',   label: 'Treno (FSE)' },
  { value: 'plane',   label: 'Aereo' },
  { value: 'shuttle', label: 'Navetta degli Sposi' },
  { value: 'other',   label: 'Altro' },
]

const EMPTY: RsvpFormData = {
  first_name: '', last_name: '', email: '', phone: '',
  attending: true, arrival_day: '', departure_day: '',
  transport: 'car', plus_one: false, plus_one_name: '',
  dietary_guest: [], dietary_plus_one: [], notes: '',
}

const inputClass = 'w-full border border-greige bg-ivory px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-azure transition-colors placeholder:text-greige'

function Field({ label, required, children, className = '' }: {
  label: string; required?: boolean; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block font-mono text-xs tracking-widest uppercase text-mist mb-2">
        {label}{required && <span className="text-bordeaux ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function DietaryCheckboxes({ selected, onChange, prefix }: {
  selected: DietaryOption[]; onChange: (v: DietaryOption[]) => void; prefix: string
}) {
  const toggle = (v: DietaryOption) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {DIETARY_OPTIONS.map(opt => (
        <label key={`${prefix}-${opt.value}`} className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors
            ${selected.includes(opt.value) ? 'bg-bordeaux border-bordeaux' : 'border-greige group-hover:border-azure'}`}>
            {selected.includes(opt.value) && <Check size={10} className="text-white" />}
          </div>
          <input type="checkbox" className="sr-only" checked={selected.includes(opt.value)}
                 onChange={() => toggle(opt.value)} />
          <span className="font-sans text-xs text-charcoal">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

const STEPS = ['Presenza', 'Logistica', 'Dettagli']

export default function RsvpForm() {
  const [form, setForm] = useState<RsvpFormData>(EMPTY)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof RsvpFormData, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

  const validate = () => {
    if (!form.first_name || !form.last_name || !form.email) {
      setErrorMsg('Compila nome, cognome ed email.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const next = () => {
    if (step === 0 && !validate()) return
    setStep(s => Math.min(s + 1, 2))
  }

  const submit = async () => {
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Qualcosa è andato storto. Scrivici a rosseantonio11727@gmail.com')
    }
  }

  if (status === 'success') {
    return (
      <section id="rsvp" className="py-section bg-ivory">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={24} className="text-sage" />
          </div>
          <h2 className="font-serif text-3xl text-charcoal mb-3">Grazie, {form.first_name}! 🌿</h2>
          <p className="text-mist leading-relaxed">
            Abbiamo ricevuto la tua risposta. Non vediamo l'ora di festeggiare insieme
            sotto il sole pugliese. Riceverai una conferma via email.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-section bg-ivory">
      <div className="max-w-2xl mx-auto px-6">
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">Conferma di Partecipazione</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">RSVP</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">
            Ti chiediamo di confermare entro il <strong className="text-charcoal">30 Aprile 2027</strong>.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8 reveal">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-colors
                  ${i < step ? 'bg-sage text-white' : i === step ? 'bg-camel text-white' : 'bg-greige text-mist'}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`font-mono text-xs mt-1.5 tracking-wider hidden sm:block
                  ${i === step ? 'text-bordeaux' : 'text-mist'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors ${i < step ? 'bg-sage' : 'bg-greige'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card reveal">

          {/* STEP 0 — Presenza & dati personali */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">
                  Parteciperai al matrimonio?<span className="text-bordeaux ml-1">*</span>
                </p>
                <div className="flex gap-3">
                  {[{ v: true, l: 'Sì, ci sarò! 🎉' }, { v: false, l: 'Purtroppo no' }].map(opt => (
                    <button key={String(opt.v)} type="button" onClick={() => set('attending', opt.v)}
                            className={`flex-1 py-3 font-mono text-xs tracking-widest uppercase border transition-colors
                              ${form.attending === opt.v ? 'bg-bordeaux border-bordeaux text-ivory' : 'border-greige text-mist hover:border-azure'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Field label="Nome" required>
                  <input className={inputClass} value={form.first_name}
                         onChange={e => set('first_name', e.target.value)} placeholder="Rossella" />
                </Field>
                <Field label="Cognome" required>
                  <input className={inputClass} value={form.last_name}
                         onChange={e => set('last_name', e.target.value)} placeholder="Rossi" />
                </Field>
                <Field label="Email" required>
                  <input className={inputClass} type="email" value={form.email}
                         onChange={e => set('email', e.target.value)} placeholder="tu@email.it" />
                </Field>
                <Field label="Telefono">
                  <input className={inputClass} type="tel" value={form.phone}
                         onChange={e => set('phone', e.target.value)} placeholder="+39 333 000 0000" />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 1 — Logistica */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Giorno di Arrivo">
                  <input className={inputClass} type="date" value={form.arrival_day}
                         min="2027-07-10" max="2027-07-12"
                         onChange={e => set('arrival_day', e.target.value)} />
                </Field>
                <Field label="Giorno di Partenza">
                  <input className={inputClass} type="date" value={form.departure_day}
                         min="2027-07-11" max="2027-07-13"
                         onChange={e => set('departure_day', e.target.value)} />
                </Field>
              </div>
              <Field label="Mezzo di Trasporto">
                <div className="relative">
                  <select className={`${inputClass} appearance-none`} value={form.transport}
                          onChange={e => set('transport', e.target.value as Transport)}>
                    {TRANSPORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                </div>
              </Field>
              {form.transport === 'shuttle' && (
                <div className="p-4 bg-sage/5 border border-sage/20">
                  <p className="font-sans text-xs text-sage leading-relaxed">
                    Perfetto! Organizzeremo la navetta dalla Stazione di Martina Franca alle 15:00.
                    Ti invieremo tutti i dettagli via email.
                  </p>
                </div>
              )}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors
                    ${form.plus_one ? 'bg-bordeaux border-bordeaux' : 'border-greige'}`}>
                    {form.plus_one && <Check size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={form.plus_one}
                         onChange={e => set('plus_one', e.target.checked)} />
                  <span className="font-mono text-xs tracking-widest uppercase text-charcoal">
                    Verrò con un accompagnatore (+1)
                  </span>
                </label>
                {form.plus_one && (
                  <div className="mt-4 pl-8">
                    <Field label="Nome Accompagnatore" required>
                      <input className={inputClass} value={form.plus_one_name}
                             onChange={e => set('plus_one_name', e.target.value)}
                             placeholder="Nome e Cognome" />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 — Diete & note */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">
                  Le tue esigenze alimentari
                </p>
                <DietaryCheckboxes prefix="guest" selected={form.dietary_guest}
                                   onChange={v => set('dietary_guest', v)} />
              </div>
              {form.plus_one && (
                <div className="border-t border-greige pt-5">
                  <p className="font-mono text-xs tracking-widest uppercase text-mist mb-3">
                    Esigenze di {form.plus_one_name || 'accompagnatore'}
                  </p>
                  <DietaryCheckboxes prefix="plusone" selected={form.dietary_plus_one}
                                     onChange={v => set('dietary_plus_one', v)} />
                </div>
              )}
              <Field label="Note o Messaggi agli Sposi" className="border-t border-greige pt-5">
                <textarea className={`${inputClass} resize-none h-28`} value={form.notes}
                          onChange={e => set('notes', e.target.value)}
                          placeholder="Un pensiero, un'allergia non in lista, o un abbraccio anticipato…" />
              </Field>
            </div>
          )}

          {errorMsg && (
            <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3 mt-4">{errorMsg}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-greige">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost flex-shrink-0">
                Indietro
              </button>
            )}
            {step < 2 ? (
              <button type="button" onClick={next}
                      className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continua <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={status === 'loading'}
                      className="btn-primary flex-1 flex items-center justify-center gap-2">
                {status === 'loading'
                  ? <><Loader2 size={14} className="animate-spin" /> Invio…</>
                  : form.attending ? 'Conferma la mia Presenza 🌿' : 'Invia Risposta'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
