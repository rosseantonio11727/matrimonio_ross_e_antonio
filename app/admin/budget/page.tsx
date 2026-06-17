'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { BudgetItem, BudgetCategory } from '@/lib/types'
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react'

const CATS: { value: BudgetCategory; label: string }[] = [
  { value: 'venue',       label: 'Location' },
  { value: 'catering',    label: 'Catering' },
  { value: 'flowers',     label: 'Fiori & Allestimento' },
  { value: 'photo_video', label: 'Foto & Video' },
  { value: 'music',       label: 'Musica & Intrattenimento' },
  { value: 'attire',      label: 'Abiti & Accessori' },
  { value: 'transport',   label: 'Trasporti & Navette' },
  { value: 'honeymoon',   label: 'Viaggio di Nozze' },
  { value: 'stationery',  label: 'Partecipazioni & Grafica' },
  { value: 'other',       label: 'Altro' },
]

const EMPTY_ITEM = {
  category: 'venue' as BudgetCategory, vendor: '', description: '',
  total_cost: 0, deposit_paid: 0, due_date: '', notes: '', paid: false,
}

const inputCls = 'w-full border border-greige bg-ivory px-3 py-2 font-sans text-sm text-charcoal focus:outline-none focus:border-camel'

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY_ITEM)
  const [editing, setEditing] = useState<BudgetItem | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('budget_items').select('*').order('category')
    setItems((data ?? []) as BudgetItem[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const saveNew = async () => {
    const { error } = await supabase.from('budget_items').insert([form])
    if (!error) { setForm(EMPTY_ITEM); setAdding(false); load() }
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    await supabase.from('budget_items').update({
      category: editing.category,
      vendor: editing.vendor,
      description: editing.description,
      total_cost: editing.total_cost,
      deposit_paid: editing.deposit_paid,
      due_date: editing.due_date,
      notes: editing.notes,
      paid: editing.paid,
    }).eq('id', editing.id)
    setSaving(false)
    setEditing(null)
    load()
  }

  const togglePaid = async (item: BudgetItem) => {
    await supabase.from('budget_items').update({ paid: !item.paid }).eq('id', item.id)
    load()
  }

  const del = async (id: string, vendor: string) => {
    if (!confirm(`Eliminare "${vendor}"?`)) return
    await supabase.from('budget_items').delete().eq('id', id)
    load()
  }

  const total   = items.reduce((s, i) => s + i.total_cost, 0)
  const paid    = items.reduce((s, i) => s + i.deposit_paid, 0)
  const balance = total - paid

  const byCategory = CATS.map(c => ({
    ...c,
    items: items.filter(i => i.category === c.value),
  })).filter(c => c.items.length > 0)

  const f = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const e = (k: keyof BudgetItem, v: unknown) => setEditing(p => p ? { ...p, [k]: v } : p)

  return (
    <div>
      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setEditing(null)} />
          <div className="w-full max-w-md bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-greige px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Modifica Voce</h3>
              <button onClick={() => setEditing(null)} className="text-mist hover:text-charcoal"><X size={18} /></button>
            </div>
            <div className="px-6 py-6 space-y-4">

              {/* Category */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Categoria</p>
                <select className={inputCls} value={editing.category}
                        onChange={e => setEditing({...editing, category: e.target.value as BudgetCategory})}>
                  {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Vendor */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Fornitore</p>
                <input className={inputCls} value={editing.vendor}
                       onChange={ev => e('vendor', ev.target.value)} />
              </div>

              {/* Description */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Descrizione</p>
                <input className={inputCls} value={editing.description || ''}
                       onChange={ev => e('description', ev.target.value)} />
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Costo Totale €</p>
                  <input className={inputCls} type="number" value={editing.total_cost}
                         onChange={ev => e('total_cost', +ev.target.value)} />
                </div>
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Acconto Versato €</p>
                  <input className={inputCls} type="number" value={editing.deposit_paid}
                         onChange={ev => e('deposit_paid', +ev.target.value)} />
                </div>
              </div>

              {/* Saldo calcolato */}
              <div className="bg-cream border border-greige p-3 flex justify-between items-center">
                <span className="font-mono text-xs text-mist uppercase tracking-widest">Saldo Rimanente</span>
                <span className="font-serif text-xl text-camel">
                  €{(editing.total_cost - editing.deposit_paid).toLocaleString('it-IT')}
                </span>
              </div>

              {/* Due date */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Scadenza Pagamento</p>
                <input className={inputCls} type="date" value={editing.due_date || ''}
                       onChange={ev => e('due_date', ev.target.value)} />
              </div>

              {/* Notes */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Note</p>
                <textarea className={`${inputCls} resize-none h-20`} value={editing.notes || ''}
                          onChange={ev => e('notes', ev.target.value)} />
              </div>

              {/* Paid toggle */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-2">Stato Pagamento</p>
                <div className="flex gap-2">
                  {[{v:false,l:'Da Saldare'},{v:true,l:'Saldato ✓'}].map(opt => (
                    <button key={String(opt.v)}
                            onClick={() => e('paid', opt.v)}
                            className={`flex-1 py-2.5 font-mono text-xs tracking-wider uppercase border transition-colors
                              ${editing.paid === opt.v
                                ? opt.v ? 'bg-sage border-sage text-white' : 'bg-camel border-camel text-white'
                                : 'border-greige text-mist hover:border-camel'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={saveEdit} disabled={saving}
                      className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? 'Salvataggio…' : <><Check size={14} /> Salva Modifiche</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-1">Gestione Economica</p>
          <h1 className="font-serif text-3xl text-charcoal">Budget & Spese</h1>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Aggiungi Voce
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Budget Totale',   value: total,   color: 'text-charcoal' },
          { label: 'Acconti Versati', value: paid,    color: 'text-sage' },
          { label: 'Saldo Rimanente', value: balance, color: 'text-camel' },
        ].map(({ label, value, color }, i) => (
          <div key={i} className="card">
            <p className="section-label mb-2">{label}</p>
            <p className={`font-serif text-3xl ${color}`}>
              €{value.toLocaleString('it-IT', { minimumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-sans text-sm text-mist">Versato</span>
          <span className="font-mono text-sm text-camel">
            {total > 0 ? Math.round((paid / total) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-greige h-2 rounded-full overflow-hidden">
          <div className="bg-camel h-full transition-all duration-500"
               style={{ width: `${total > 0 ? (paid / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card mb-6 border-camel/30 border">
          <h3 className="font-serif text-xl text-charcoal mb-5">Nuova Voce di Spesa</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <select className={inputCls} value={form.category}
                    onChange={e => f('category', e.target.value)}>
              {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input className={inputCls} placeholder="Fornitore" value={form.vendor}
                   onChange={e => f('vendor', e.target.value)} />
            <input className={inputCls} placeholder="Descrizione" value={form.description}
                   onChange={e => f('description', e.target.value)} />
            <input className={inputCls} type="number" placeholder="Costo totale €" value={form.total_cost || ''}
                   onChange={e => f('total_cost', +e.target.value)} />
            <input className={inputCls} type="number" placeholder="Acconto versato €" value={form.deposit_paid || ''}
                   onChange={e => f('deposit_paid', +e.target.value)} />
            <input className={inputCls} type="date" value={form.due_date}
                   onChange={e => f('due_date', e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={saveNew} className="btn-primary flex items-center gap-2"><Check size={13}/> Salva</button>
            <button onClick={() => setAdding(false)} className="btn-ghost flex items-center gap-2"><X size={13}/> Annulla</button>
          </div>
        </div>
      )}

      {/* Table by category */}
      {loading
        ? <p className="text-mist font-sans text-sm">Caricamento…</p>
        : byCategory.map(cat => (
          <div key={cat.value} className="mb-8">
            <h3 className="font-serif text-lg text-charcoal mb-3 border-b border-greige pb-2">{cat.label}</h3>
            <table className="w-full admin-table">
              <thead>
                <tr className="text-left">
                  <th>Fornitore</th>
                  <th>Totale</th>
                  <th>Acconto</th>
                  <th>Saldo</th>
                  <th>Scadenza</th>
                  <th>Stato</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-medium text-charcoal">{item.vendor}</p>
                      {item.description && <p className="text-xs text-mist">{item.description}</p>}
                    </td>
                    <td className="font-mono">€{item.total_cost.toLocaleString()}</td>
                    <td className="font-mono text-sage">€{item.deposit_paid.toLocaleString()}</td>
                    <td className="font-mono text-camel">€{(item.total_cost - item.deposit_paid).toLocaleString()}</td>
                    <td className="font-mono text-xs text-mist">{item.due_date || '—'}</td>
                    <td>
                      <button onClick={() => togglePaid(item)}
                              className={`px-2 py-1 font-mono text-xs tracking-wider border transition-colors
                                ${item.paid ? 'bg-sage/10 border-sage text-sage' : 'border-greige text-mist hover:border-camel'}`}>
                        {item.paid ? 'Saldato ✓' : 'Da saldare'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(item)}
                                className="text-mist hover:text-camel transition-colors" title="Modifica">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => del(item.id, item.vendor)}
                                className="text-mist hover:text-red-400 transition-colors" title="Elimina">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      }
    </div>
  )
}
