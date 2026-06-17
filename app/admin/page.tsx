'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest, BudgetItem } from '@/lib/types'
import { Users, TrendingUp, CalendarCheck, Utensils } from 'lucide-react'

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [budget, setBudget] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('guests').select('*'),
      supabase.from('budget_items').select('*'),
    ]).then(([{ data: g }, { data: b }]) => {
      setGuests((g ?? []) as Guest[])
      setBudget((b ?? []) as BudgetItem[])
      setLoading(false)
    })
  }, [])

  const attending = guests.filter(g => g.attending)
  const totalPeople = attending.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)

  const totalBudget = budget.reduce((s, b) => s + b.total_cost, 0)
  const totalPaid   = budget.reduce((s, b) => s + b.deposit_paid, 0)
  const budgetPct   = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  const dietaryAll = attending.flatMap(g => [
    ...g.dietary_guest,
    ...(g.plus_one ? g.dietary_plus_one : []),
  ])
  const dietaryCounts = dietaryAll.reduce<Record<string, number>>((acc, d) => {
    acc[d] = (acc[d] || 0) + 1; return acc
  }, {})

  const kpi = [
    { Icon: Users,        label: 'Persone Totali',     value: loading ? '—' : totalPeople, sub: `${attending.length} RSVP ricevuti` },
    { Icon: CalendarCheck,label: 'RSVP Confermati',    value: loading ? '—' : attending.length, sub: `${guests.filter(g => !g.attending).length} declinati` },
    { Icon: TrendingUp,   label: 'Budget Versato',     value: loading ? '—' : `${budgetPct}%`, sub: `€${totalPaid.toLocaleString()} / €${totalBudget.toLocaleString()}` },
    { Icon: Utensils,     label: 'Menu Speciali',       value: loading ? '—' : dietaryAll.length, sub: 'esigenze dichiarate' },
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">Benvenuta</p>
        <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
        <p className="font-sans text-sm text-mist mt-1">12 Settembre 2025 — Villa Il Borghetto, Toscana</p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpi.map(({ Icon, label, value, sub }, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">{label}</p>
              <Icon size={15} className="text-sage" />
            </div>
            <p className="font-serif text-4xl text-charcoal mb-1">{value}</p>
            <p className="font-sans text-xs text-mist">{sub}</p>
          </div>
        ))}
      </div>

      {/* Budget progress */}
      <div className="card mb-6">
        <h2 className="font-serif text-xl text-charcoal mb-4">Budget Overview</h2>
        <div className="w-full bg-greige h-1.5 rounded-full overflow-hidden mb-3">
          <div className="bg-camel h-full transition-all duration-500" style={{ width: `${budgetPct}%` }} />
        </div>
        <div className="flex justify-between font-mono text-xs text-mist">
          <span>Versato €{totalPaid.toLocaleString()}</span>
          <span>{budgetPct}%</span>
          <span>Totale €{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Dietary recap */}
      {Object.keys(dietaryCounts).length > 0 && (
        <div className="card">
          <h2 className="font-serif text-xl text-charcoal mb-4">Riepilogo Esigenze Alimentari</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(dietaryCounts).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 bg-cream px-3 py-1.5 border border-greige">
                <span className="font-mono text-xs text-mist capitalize">{k.replace(/_/g, ' ')}</span>
                <span className="font-mono text-xs font-medium text-camel">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
