'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest, Table } from '@/lib/types'
import { Search, ChevronDown, Users, X, Check, Pencil, Trash2 } from 'lucide-react'

const DIETARY_LABELS: Record<string, string> = {
  vegan: 'Vegano', vegetarian: 'Vegetariano', gluten_free: 'Senza Glutine',
  lactose_free: 'Senza Lattosio', nut_allergy: 'Frutta Secca', shellfish_allergy: 'Molluschi',
  halal: 'Halal', kosher: 'Kosher',
}

const DIETARY_OPTIONS = Object.entries(DIETARY_LABELS).map(([value, label]) => ({ value, label }))

const TRANSPORT_OPTIONS = [
  { value: 'car', label: 'Auto Propria' },
  { value: 'train', label: 'Treno (FSE)' },
  { value: 'plane', label: 'Aereo' },
  { value: 'shuttle', label: 'Navetta' },
  { value: 'other', label: 'Altro' },
]

const inputCls = 'w-full border border-greige bg-ivory px-3 py-2 font-sans text-sm text-charcoal focus:outline-none focus:border-camel'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all'|'attending'|'declined'|'unassigned'>('all')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [{ data: g }, { data: t }] = await Promise.all([
      supabase.from('guests').select('*').order('last_name'),
      supabase.from('tables').select('*').order('name'),
    ])
    setGuests((g ?? []) as Guest[])
    setTables((t ?? []) as Table[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const assignTable = async (guestId: string, tableId: string | null) => {
    await supabase.from('guests').update({ table_id: tableId || null }).eq('id', guestId)
    load()
  }

  const addTable = async () => {
    const name = prompt('Nome del tavolo (es. Tavolo Ulivo):')
    if (!name) return
    await supabase.from('tables').insert([{ name, capacity: 8 }])
    load()
  }

  const deleteGuest = async (id: string, name: string) => {
    if (!confirm(`Eliminare ${name}?`)) return
    await supabase.from('guests').delete().eq('id', id)
    load()
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    await supabase.from('guests').update({
      first_name: editing.first_name,
      last_name: editing.last_name,
      email: editing.email,
      phone: editing.phone,
      attending: editing.attending,
      arrival_day: editing.arrival_day,
      departure_day: editing.departure_day,
      transport: editing.transport,
      plus_one: editing.plus_one,
      plus_one_name: editing.plus_one_name,
      dietary_guest: editing.dietary_guest,
      dietary_plus_one: editing.dietary_plus_one,
      notes: editing.notes,
      table_id: editing.table_id,
    }).eq('id', editing.id)
    setSaving(false)
    setEditing(null)
    load()
  }

  const toggleDiet = (field: 'dietary_guest' | 'dietary_plus_one', val: string) => {
    if (!editing) return
    const arr = (editing[field] as string[]) || []
    setEditing({ ...editing, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  const filtered = guests
    .filter(g => {
      if (filter === 'attending') return g.attending
      if (filter === 'declined') return !g.attending
      if (filter === 'unassigned') return g.attending && !g.table_id
      return true
    })
    .filter(g => `${g.first_name} ${g.last_name} ${g.email}`.toLowerCase().includes(search.toLowerCase()))

  const attending = guests.filter(g => g.attending)
  const totalPeople = attending.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)

  return (
    <div>
      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setEditing(null)} />
          <div className="w-full max-w-md bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-greige px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Modifica Ospite</h3>
              <button onClick={() => setEditing(null)} className="text-mist hover:text-charcoal"><X size={18} /></button>
            </div>
            <div className="px-6 py-6 space-y-4">

              {/* Attending */}
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-mist mb-2">Presenza</p>
                <div className="flex gap-2">
                  {[{v:true,l:'Confermato'},{v:false,l:'Declinato'}].map(opt => (
                    <button key={String(opt.v)} onClick={() => setEditing({...editing, attending: opt.v})}
                            className={`flex-1 py-2 font-mono text-xs tracking-wider uppercase border transition-colors
                              ${editing.attending === opt.v ? 'bg-camel border-camel text-white' : 'border-greige text-mist'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Nome</p>
                  <input className={inputCls} value={editing.first_name}
                         onChange={e => setEditing({...editing, first_name: e.target.value})} />
                </div>
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Cognome</p>
                  <input className={inputCls} value={editing.last_name}
                         onChange={e => setEditing({...editing, last_name: e.target.value})} />
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Email</p>
                <input className={inputCls} value={editing.email || ''}
                       onChange={e => setEditing({...editing, email: e.target.value})} />
              </div>
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Telefono</p>
                <input className={inputCls} value={editing.phone || ''}
                       onChange={e => setEditing({...editing, phone: e.target.value})} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Arrivo</p>
                  <input className={inputCls} type="date" value={editing.arrival_day || ''}
                         onChange={e => setEditing({...editing, arrival_day: e.target.value})} />
                </div>
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Partenza</p>
                  <input className={inputCls} type="date" value={editing.departure_day || ''}
                         onChange={e => setEditing({...editing, departure_day: e.target.value})} />
                </div>
              </div>

              {/* Transport */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Trasporto</p>
                <select className={inputCls} value={editing.transport || ''}
                        onChange={e => setEditing({...editing, transport: e.target.value as any})}>
                  <option value="">— Non specificato</option>
                  {TRANSPORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Tavolo */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Tavolo</p>
                <select className={inputCls} value={editing.table_id || ''}
                        onChange={e => setEditing({...editing, table_id: e.target.value || null})}>
                  <option value="">— Non assegnato</option>
                  {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* Dietary guest */}
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-2">Dieta Ospite</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DIETARY_OPTIONS.map(opt => {
                    const on = (editing.dietary_guest || [] as string[]).includes(opt.value)
                    return (
                      <button key={opt.value} onClick={() => toggleDiet('dietary_guest', opt.value)}
                              className={`flex items-center gap-2 px-3 py-2 border text-xs font-sans transition-colors
                                ${on ? 'bg-sage/10 border-sage text-sage' : 'border-greige text-mist hover:border-sage'}`}>
                        <div className={`w-3 h-3 border flex-shrink-0 ${on ? 'bg-sage border-sage' : 'border-greige'}`}>
                          {on && <Check size={8} className="text-white" />}
                        </div>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* +1 */}
              <div className="border-t border-greige pt-4">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors
                    ${editing.plus_one ? 'bg-camel border-camel' : 'border-greige'}`}>
                    {editing.plus_one && <Check size={11} className="text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={editing.plus_one || false}
                         onChange={e => setEditing({...editing, plus_one: e.target.checked})} />
                  <span className="font-mono text-xs tracking-widest uppercase text-charcoal">Ha un +1</span>
                </label>
                {editing.plus_one && (
                  <div className="space-y-3 pl-8">
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Nome +1</p>
                      <input className={inputCls} value={editing.plus_one_name || ''}
                             onChange={e => setEditing({...editing, plus_one_name: e.target.value})} />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-2">Dieta +1</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {DIETARY_OPTIONS.map(opt => {
                          const on = (editing.dietary_plus_one || [] as string[]).includes(opt.value)
                          return (
                            <button key={opt.value} onClick={() => toggleDiet('dietary_plus_one', opt.value)}
                                    className={`flex items-center gap-2 px-3 py-2 border text-xs font-sans transition-colors
                                      ${on ? 'bg-camel/10 border-camel text-camel' : 'border-greige text-mist hover:border-camel'}`}>
                              <div className={`w-3 h-3 border flex-shrink-0 ${on ? 'bg-camel border-camel' : 'border-greige'}`}>
                                {on && <Check size={8} className="text-white" />}
                              </div>
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="border-t border-greige pt-4">
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Note</p>
                <textarea className={`${inputCls} resize-none h-20`} value={editing.notes || ''}
                          onChange={e => setEditing({...editing, notes: e.target.value})} />
              </div>

              {/* Save */}
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
          <p className="section-label mb-1">Gestione</p>
          <h1 className="font-serif text-3xl text-charcoal">Invitati & Tavoli</h1>
        </div>
        <button onClick={addTable} className="btn-primary flex items-center gap-2">
          <Users size={14} /> Nuovo Tavolo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'RSVP Sì',    value: attending.length },
          { label: 'Totale Pax', value: totalPeople },
          { label: 'Assegnati',  value: attending.filter(g => g.table_id).length },
          { label: 'Tavoli',     value: tables.length },
        ].map(({ label, value }, i) => (
          <div key={i} className="card text-center">
            <p className="section-label mb-1">{label}</p>
            <p className="font-serif text-3xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      {/* Seating overview */}
      {tables.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-serif text-xl text-charcoal mb-4">Disposizione Tavoli</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tables.map(table => {
              const seated = attending.filter(g => g.table_id === table.id)
              const pax = seated.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)
              const pct = Math.min(100, Math.round((pax / table.capacity) * 100))
              return (
                <div key={table.id} className="border border-greige bg-ivory p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-serif text-sm text-charcoal">{table.name}</p>
                    <span className="font-mono text-xs text-mist">{pax}/{table.capacity}</span>
                  </div>
                  <div className="w-full bg-greige h-1 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${pax >= table.capacity ? 'bg-camel' : 'bg-sage'}`}
                         style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-mist font-sans truncate">
                    {seated.map(g => g.first_name).join(', ') || '—'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Cerca per nome o email…"
                 className="w-full border border-greige bg-white pl-9 pr-4 py-2.5 font-sans text-sm focus:outline-none focus:border-camel" />
        </div>
        <div className="relative">
          <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
                  className="border border-greige bg-white px-4 py-2.5 pr-8 font-sans text-sm focus:outline-none appearance-none">
            <option value="all">Tutti</option>
            <option value="attending">Confermati</option>
            <option value="declined">Declinato</option>
            <option value="unassigned">Non Assegnati</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading
        ? <p className="text-mist font-sans text-sm">Caricamento…</p>
        : (
          <div className="card overflow-x-auto">
            <table className="w-full admin-table min-w-[700px]">
              <thead>
                <tr className="text-left">
                  <th>Ospite</th>
                  <th>Contatti</th>
                  <th>Mezzo</th>
                  <th>Dieta</th>
                  <th>+1</th>
                  <th>Tavolo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => (
                  <tr key={g.id} className={!g.attending ? 'opacity-40' : ''}>
                    <td>
                      <p className="font-medium text-charcoal">{g.first_name} {g.last_name}</p>
                      {!g.attending && <span className="font-mono text-xs text-mist">Declinato</span>}
                    </td>
                    <td>
                      <p className="text-xs text-mist">{g.email}</p>
                      <p className="text-xs text-mist">{g.phone}</p>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-mist capitalize">{g.transport?.replace(/_/g,' ') || '—'}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {g.dietary_guest?.map(d => (
                          <span key={d} className="bg-sage/10 border border-sage/30 text-sage px-1.5 py-0.5 font-mono text-xs">
                            {DIETARY_LABELS[d] || d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {g.plus_one
                        ? <div>
                            <p className="text-xs font-medium text-charcoal">{g.plus_one_name || '+1'}</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {g.dietary_plus_one?.map(d => (
                                <span key={d} className="bg-camel/10 border border-camel/30 text-camel px-1.5 py-0.5 font-mono text-xs">
                                  {DIETARY_LABELS[d] || d}
                                </span>
                              ))}
                            </div>
                          </div>
                        : <span className="text-mist text-xs">—</span>
                      }
                    </td>
                    <td>
                      {g.attending && (
                        <div className="relative">
                          <select value={g.table_id || ''}
                                  onChange={e => assignTable(g.id, e.target.value || null)}
                                  className="border border-greige bg-white px-2 py-1.5 pr-6 font-sans text-xs text-charcoal focus:outline-none appearance-none">
                            <option value="">— Non assegnato</option>
                            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(g)}
                                className="text-mist hover:text-camel transition-colors" title="Modifica">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteGuest(g.id, `${g.first_name} ${g.last_name}`)}
                                className="text-mist hover:text-red-400 transition-colors" title="Elimina">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-10 font-sans text-sm text-mist">
                {guests.length === 0 ? 'Nessun RSVP ancora ricevuto.' : 'Nessun risultato.'}
              </p>
            )}
          </div>
        )
      }
    </div>
  )
}
