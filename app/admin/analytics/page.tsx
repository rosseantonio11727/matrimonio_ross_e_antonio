'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest } from '@/lib/types'

const DIETARY_LABELS: Record<string, string> = {
  vegan: 'Vegano', vegetarian: 'Vegetariano', gluten_free: 'Senza Glutine',
  lactose_free: 'Senza Lattosio', nut_allergy: 'Allergia Frutta Secca',
  shellfish_allergy: 'Allergia Molluschi', halal: 'Halal', kosher: 'Kosher',
}

const TRANSPORT_LABELS: Record<string, string> = {
  car: 'Auto Propria', train: 'Treno', plane: 'Aereo',
  shuttle: 'Navetta', other: 'Altro',
}

function Bar({ label, value, max, color = 'bg-camel' }: {
  label: string; value: number; max: number; color?: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-4">
      <span className="font-sans text-sm text-charcoal w-36 flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-greige h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-sm text-mist w-8 text-right">{value}</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('guests').select('*').then(({ data }) => {
      setGuests((data ?? []) as Guest[])
      setLoading(false)
    })
  }, [])

  const attending   = guests.filter(g => g.attending)
  const declined    = guests.filter(g => !g.attending)
  const totalPeople = attending.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)
  const plusOnes    = attending.filter(g => g.plus_one).length

  // Dietary
  const dietaryAll = attending.flatMap(g => [
    ...g.dietary_guest,
    ...(g.plus_one ? g.dietary_plus_one : []),
  ])
  const dietaryCounts = dietaryAll.reduce<Record<string,number>>((acc, d) => {
    acc[d] = (acc[d] || 0) + 1; return acc
  }, {})

  // Transport
  const transportCounts = attending.reduce<Record<string,number>>((acc, g) => {
    if (g.transport) acc[g.transport] = (acc[g.transport] || 0) + 1; return acc
  }, {})

  // Arrivals
  const arrivalCounts = attending.reduce<Record<string,number>>((acc, g) => {
    const d = g.arrival_day || 'Non specificato'
    acc[d] = (acc[d] || 0) + 1; return acc
  }, {})

  const maxTransport = Math.max(...Object.values(transportCounts), 1)
  const maxDietary   = Math.max(...Object.values(dietaryCounts), 1)
  const maxArrival   = Math.max(...Object.values(arrivalCounts), 1)

  if (loading) return <p className="font-sans text-sm text-mist">Caricamento…</p>

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">Statistiche</p>
        <h1 className="font-serif text-3xl text-charcoal">Analytics</h1>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'RSVP Totali',  value: guests.length },
          { label: 'Partecipanti', value: attending.length },
          { label: 'Persone Totali', value: totalPeople },
          { label: 'Declinati',    value: declined.length },
        ].map(({ label, value }, i) => (
          <div key={i} className="card text-center">
            <p className="section-label mb-2">{label}</p>
            <p className="font-serif text-4xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Dietary */}
        <div className="card">
          <h2 className="font-serif text-xl text-charcoal mb-5">Esigenze Alimentari</h2>
          {Object.keys(dietaryCounts).length === 0
            ? <p className="font-sans text-sm text-mist">Nessuna esigenza dichiarata</p>
            : (
              <div className="space-y-3">
                {Object.entries(dietaryCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <Bar key={k} label={DIETARY_LABELS[k] || k} value={v} max={maxDietary} color="bg-sage" />
                  ))}
              </div>
            )
          }
          <div className="mt-5 pt-5 border-t border-greige">
            <p className="font-sans text-xs text-mist">
              Totale pax con esigenze: <strong className="text-charcoal">{dietaryAll.length}</strong>
              {' '}su <strong className="text-charcoal">{totalPeople}</strong> persone
            </p>
          </div>
        </div>

        {/* Transport */}
        <div className="card">
          <h2 className="font-serif text-xl text-charcoal mb-5">Mezzi di Trasporto</h2>
          <div className="space-y-3">
            {Object.entries(transportCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <Bar key={k} label={TRANSPORT_LABELS[k] || k} value={v} max={maxTransport} />
              ))}
          </div>
          {transportCounts['shuttle'] > 0 && (
            <div className="mt-5 pt-5 border-t border-greige p-3 bg-sage/5 border border-sage/20">
              <p className="font-sans text-xs text-sage">
                <strong>{transportCounts['shuttle']}</strong> persone hanno richiesto la navetta.
              </p>
            </div>
          )}
        </div>

        {/* Arrival days */}
        <div className="card">
          <h2 className="font-serif text-xl text-charcoal mb-5">Giorni di Arrivo</h2>
          <div className="space-y-3">
            {Object.entries(arrivalCounts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([k, v]) => (
                <Bar key={k}
                     label={k === 'Non specificato' ? k : new Date(k).toLocaleDateString('it-IT', { weekday:'short', day:'2-digit', month:'short' })}
                     value={v} max={maxArrival} color="bg-charcoal/60" />
              ))}
          </div>
        </div>

        {/* +1 summary */}
        <div className="card">
          <h2 className="font-serif text-xl text-charcoal mb-5">Accompagnatori (+1)</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-sans text-sm text-mist">Ospiti con +1</span>
                <span className="font-mono text-sm text-camel">{plusOnes}</span>
              </div>
              <div className="w-full bg-greige h-2 rounded-full overflow-hidden">
                <div className="bg-camel h-full" style={{ width: `${attending.length > 0 ? (plusOnes/attending.length)*100 : 0}%` }} />
              </div>
            </div>
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {attending.filter(g => g.plus_one && g.plus_one_name).map(g => (
                <li key={g.id} className="flex justify-between text-xs font-sans py-1.5 border-b border-greige/60">
                  <span className="text-charcoal">{g.first_name} {g.last_name}</span>
                  <span className="text-mist">+ {g.plus_one_name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
