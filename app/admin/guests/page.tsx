'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Guest, Table } from '@/lib/types'
import { Search, ChevronDown, Users, X, Check, Pencil, Trash2, LayoutGrid, List } from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Floor Plan Table Shape ────────────────────────────────────────────────────

function FloorTable({
  table, guests, selected, onSelect, onDragEnd,
}: {
  table: Table
  guests: Guest[]
  selected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef<{ startMouseX: number; startMouseY: number; startX: number; startY: number } | null>(null)
  const pax = guests.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)
  const x = table.position_x ?? 10
  const y = table.position_y ?? 10
  const isRound = table.shape !== 'rect'

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
    dragging.current = { startMouseX: e.clientX, startMouseY: e.clientY, startX: x, startY: y }
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !ref.current?.parentElement) return
      const parent = ref.current.parentElement.getBoundingClientRect()
      const dx = ((ev.clientX - dragging.current.startMouseX) / parent.width) * 100
      const dy = ((ev.clientY - dragging.current.startMouseY) / parent.height) * 100
      const nx = Math.max(0, Math.min(90, dragging.current.startX + dx))
      const ny = Math.max(0, Math.min(85, dragging.current.startY + dy))
      if (ref.current) {
        ref.current.style.left = `${nx}%`
        ref.current.style.top = `${ny}%`
      }
    }
    const onUp = (ev: MouseEvent) => {
      if (!dragging.current || !ref.current?.parentElement) return
      const parent = ref.current.parentElement.getBoundingClientRect()
      const dx = ((ev.clientX - dragging.current.startMouseX) / parent.width) * 100
      const dy = ((ev.clientY - dragging.current.startMouseY) / parent.height) * 100
      const nx = Math.max(0, Math.min(90, dragging.current.startX + dx))
      const ny = Math.max(0, Math.min(85, dragging.current.startY + dy))
      onDragEnd(nx, ny)
      dragging.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
    >
      <div className={`
        flex flex-col items-center justify-center
        border-2 transition-colors
        ${isRound ? 'rounded-full w-20 h-20' : 'w-24 h-16'}
        ${selected
          ? 'bg-azure/20 border-azure'
          : pax >= table.capacity
            ? 'bg-bordeaux/10 border-bordeaux'
            : 'bg-butter/60 border-greige hover:border-azure/60'}
      `}>
        <span className="font-mono text-[10px] tracking-wide text-charcoal text-center leading-tight px-1 line-clamp-2">
          {table.name}
        </span>
        <span className="font-mono text-[9px] text-mist mt-0.5">{pax}/{table.capacity}</span>
      </div>
      {/* Tooltip nomi ospiti */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 hidden group-hover:block">
        <div className="bg-charcoal text-ivory text-xs font-sans px-2 py-1 whitespace-nowrap max-w-[180px] truncate">
          {guests.map(g => g.first_name).join(', ') || 'Nessun ospite'}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all'|'attending'|'declined'|'unassigned'>('all')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [saving, setSaving] = useState(false)

  // Rinomina tavolo
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')

  // Piano sala
  const [viewMode, setViewMode] = useState<'list' | 'floor'>('list')
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

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
    await supabase.from('tables').insert([{ name, capacity: 8, position_x: 20, position_y: 20, shape: 'round' }])
    load()
  }

  const deleteTable = async (id: string, name: string) => {
    if (!confirm(`Eliminare "${name}"? Gli ospiti assegnati verranno rimossi dal tavolo.`)) return
    await supabase.from('guests').update({ table_id: null }).eq('table_id', id)
    await supabase.from('tables').delete().eq('id', id)
    load()
  }

  // ── Rinomina tavolo ──────────────────────────────────────────────────────────
  const startRename = (table: Table) => {
    setRenamingId(table.id)
    setRenameDraft(table.name)
  }
  const saveRename = async () => {
    if (!renamingId || !renameDraft.trim()) { setRenamingId(null); return }
    await supabase.from('tables').update({ name: renameDraft.trim() }).eq('id', renamingId)
    setRenamingId(null)
    load()
  }

  // ── Piano sala ───────────────────────────────────────────────────────────────
  const updateTablePosition = async (id: string, x: number, y: number) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, position_x: x, position_y: y } : t))
    await supabase.from('tables').update({ position_x: x, position_y: y }).eq('id', id)
  }

  const toggleShape = async (id: string) => {
    const table = tables.find(t => t.id === id)
    if (!table) return
    const newShape = table.shape === 'round' ? 'rect' : 'round'
    setTables(prev => prev.map(t => t.id === id ? { ...t, shape: newShape } : t))
    await supabase.from('tables').update({ shape: newShape }).eq('id', id)
  }

  const updateCapacity = async (id: string, capacity: number) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, capacity } : t))
    await supabase.from('tables').update({ capacity }).eq('id', id)
  }

  // ── Modifica ospite ──────────────────────────────────────────────────────────
  const deleteGuest = async (id: string, name: string) => {
    if (!confirm(`Eliminare ${name}?`)) return
    await supabase.from('guests').delete().eq('id', id)
    load()
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    await supabase.from('guests').update({
      first_name: editing.first_name, last_name: editing.last_name,
      email: editing.email, phone: editing.phone,
      attending: editing.attending, arrival_day: editing.arrival_day,
      departure_day: editing.departure_day, transport: editing.transport,
      plus_one: editing.plus_one, plus_one_name: editing.plus_one_name,
      dietary_guest: editing.dietary_guest, dietary_plus_one: editing.dietary_plus_one,
      notes: editing.notes, table_id: editing.table_id,
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
  const selectedTable = tables.find(t => t.id === selectedTableId)

  return (
    <div>
      {/* ── Edit guest drawer ───────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setEditing(null)} />
          <div className="w-full max-w-md bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-greige px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Modifica Ospite</h3>
              <button onClick={() => setEditing(null)} className="text-mist hover:text-charcoal"><X size={18} /></button>
            </div>
            <div className="px-6 py-6 space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Nome</p>
                  <input className={inputCls} value={editing.first_name} onChange={e => setEditing({...editing, first_name: e.target.value})} />
                </div>
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Cognome</p>
                  <input className={inputCls} value={editing.last_name} onChange={e => setEditing({...editing, last_name: e.target.value})} />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Email</p>
                <input className={inputCls} value={editing.email || ''} onChange={e => setEditing({...editing, email: e.target.value})} />
              </div>
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Telefono</p>
                <input className={inputCls} value={editing.phone || ''} onChange={e => setEditing({...editing, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Arrivo</p>
                  <input className={inputCls} type="date" value={editing.arrival_day || ''} onChange={e => setEditing({...editing, arrival_day: e.target.value})} />
                </div>
                <div>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Partenza</p>
                  <input className={inputCls} type="date" value={editing.departure_day || ''} onChange={e => setEditing({...editing, departure_day: e.target.value})} />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Trasporto</p>
                <select className={inputCls} value={editing.transport || ''} onChange={e => setEditing({...editing, transport: e.target.value as any})}>
                  <option value="">— Non specificato</option>
                  {TRANSPORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Tavolo</p>
                <select className={inputCls} value={editing.table_id || ''} onChange={e => setEditing({...editing, table_id: e.target.value || null})}>
                  <option value="">— Non assegnato</option>
                  {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
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
              <div className="border-t border-greige pt-4">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${editing.plus_one ? 'bg-camel border-camel' : 'border-greige'}`}>
                    {editing.plus_one && <Check size={11} className="text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={editing.plus_one || false} onChange={e => setEditing({...editing, plus_one: e.target.checked})} />
                  <span className="font-mono text-xs tracking-widest uppercase text-charcoal">Ha un +1</span>
                </label>
                {editing.plus_one && (
                  <div className="space-y-3 pl-8">
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Nome +1</p>
                      <input className={inputCls} value={editing.plus_one_name || ''} onChange={e => setEditing({...editing, plus_one_name: e.target.value})} />
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
              <div className="border-t border-greige pt-4">
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Note</p>
                <textarea className={`${inputCls} resize-none h-20`} value={editing.notes || ''} onChange={e => setEditing({...editing, notes: e.target.value})} />
              </div>
              <button onClick={saveEdit} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? 'Salvataggio…' : <><Check size={14} /> Salva Modifiche</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-1">Gestione</p>
          <h1 className="font-serif text-3xl text-charcoal">Invitati & Tavoli</h1>
        </div>
        <button onClick={addTable} className="btn-primary flex items-center gap-2">
          <Users size={14} /> Nuovo Tavolo
        </button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
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

      {/* ── Tavoli: toggle Lista / Piano Sala ───────────────────────────────── */}
      {tables.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-charcoal">Disposizione Tavoli</h2>
            <div className="flex border border-greige">
              <button onClick={() => setViewMode('list')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors
                        ${viewMode === 'list' ? 'bg-charcoal text-ivory' : 'text-mist hover:text-charcoal'}`}>
                <List size={12} /> Lista
              </button>
              <button onClick={() => setViewMode('floor')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors border-l border-greige
                        ${viewMode === 'floor' ? 'bg-charcoal text-ivory' : 'text-mist hover:text-charcoal'}`}>
                <LayoutGrid size={12} /> Piano Sala
              </button>
            </div>
          </div>

          {/* Vista lista */}
          {viewMode === 'list' && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tables.map(table => {
                const seated = attending.filter(g => g.table_id === table.id)
                const pax = seated.reduce((s, g) => s + 1 + (g.plus_one ? 1 : 0), 0)
                const pct = Math.min(100, Math.round((pax / table.capacity) * 100))
                const isRenaming = renamingId === table.id
                return (
                  <div key={table.id} className="border border-greige bg-ivory p-4 group">
                    <div className="flex justify-between items-center mb-2">
                      {isRenaming ? (
                        <input
                          autoFocus
                          value={renameDraft}
                          onChange={e => setRenameDraft(e.target.value)}
                          onBlur={saveRename}
                          onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setRenamingId(null) }}
                          className="font-serif text-sm text-charcoal bg-white border border-azure px-2 py-0.5 w-full focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <p className="font-serif text-sm text-charcoal truncate">{table.name}</p>
                          <button onClick={() => startRename(table)}
                                  className="opacity-0 group-hover:opacity-100 text-mist hover:text-azure transition-all flex-shrink-0"
                                  title="Rinomina">
                            <Pencil size={11} />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <span className="font-mono text-xs text-mist">{pax}/{table.capacity}</span>
                        <button onClick={() => deleteTable(table.id, table.name)}
                                className="opacity-0 group-hover:opacity-100 text-mist hover:text-red-400 transition-all"
                                title="Elimina tavolo">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-greige h-1 overflow-hidden mb-2">
                      <div className={`h-full ${pax >= table.capacity ? 'bg-camel' : 'bg-sage'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-mist font-sans truncate">
                      {seated.map(g => g.first_name).join(', ') || '—'}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Piano sala */}
          {viewMode === 'floor' && (
            <div className="flex gap-4">
              {/* Canvas */}
              <div
                className="relative flex-1 bg-greige/30 border border-greige overflow-hidden"
                style={{ minHeight: 480, backgroundImage: 'radial-gradient(circle, #d4c9b0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                onClick={() => setSelectedTableId(null)}
              >
                {tables.map(table => (
                  <FloorTable
                    key={table.id}
                    table={table}
                    guests={attending.filter(g => g.table_id === table.id)}
                    selected={selectedTableId === table.id}
                    onSelect={() => setSelectedTableId(table.id)}
                    onDragEnd={(x, y) => updateTablePosition(table.id, x, y)}
                  />
                ))}
                <p className="absolute bottom-3 right-3 font-mono text-xs text-mist/50 select-none">
                  trascina i tavoli per riposizionarli
                </p>
              </div>

              {/* Pannello laterale tavolo selezionato */}
              <div className="w-52 flex-shrink-0">
                {selectedTable ? (
                  <div className="border border-greige bg-ivory p-4 space-y-4">
                    <p className="font-mono text-xs tracking-widest uppercase text-mist">Tavolo Selezionato</p>
                    <p className="font-serif text-lg text-charcoal">{selectedTable.name}</p>

                    {/* Rinomina */}
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Nome</p>
                      <div className="flex gap-1">
                        <input
                          value={renamingId === selectedTable.id ? renameDraft : selectedTable.name}
                          onFocus={() => startRename(selectedTable)}
                          onChange={e => setRenameDraft(e.target.value)}
                          onBlur={saveRename}
                          onKeyDown={e => { if (e.key === 'Enter') saveRename() }}
                          className="flex-1 border border-greige px-2 py-1 font-sans text-xs focus:outline-none focus:border-azure bg-white"
                        />
                      </div>
                    </div>

                    {/* Capienza */}
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">Capienza</p>
                      <input
                        type="number" min={1} max={30}
                        value={selectedTable.capacity}
                        onChange={e => updateCapacity(selectedTable.id, parseInt(e.target.value) || 1)}
                        className="w-full border border-greige px-2 py-1 font-sans text-xs focus:outline-none focus:border-azure bg-white"
                      />
                    </div>

                    {/* Forma */}
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-2">Forma</p>
                      <div className="flex gap-2">
                        <button onClick={() => toggleShape(selectedTable.id)}
                                className={`flex-1 py-2 border font-mono text-xs tracking-wider uppercase transition-colors
                                  ${selectedTable.shape !== 'rect' ? 'bg-azure/20 border-azure text-azure' : 'border-greige text-mist'}`}>
                          ◯ Tondo
                        </button>
                        <button onClick={() => toggleShape(selectedTable.id)}
                                className={`flex-1 py-2 border font-mono text-xs tracking-wider uppercase transition-colors
                                  ${selectedTable.shape === 'rect' ? 'bg-azure/20 border-azure text-azure' : 'border-greige text-mist'}`}>
                          □ Rett.
                        </button>
                      </div>
                    </div>

                    {/* Ospiti al tavolo */}
                    <div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest mb-2">Ospiti</p>
                      <div className="space-y-1">
                        {attending.filter(g => g.table_id === selectedTable.id).map(g => (
                          <p key={g.id} className="font-sans text-xs text-charcoal">
                            {g.first_name} {g.last_name}
                            {g.plus_one && <span className="text-mist"> +{g.plus_one_name || '1'}</span>}
                          </p>
                        ))}
                        {attending.filter(g => g.table_id === selectedTable.id).length === 0 && (
                          <p className="font-sans text-xs text-mist">Nessun ospite assegnato</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-greige p-4 text-center">
                    <p className="font-sans text-xs text-mist leading-relaxed">
                      Clicca un tavolo nel piano per selezionarlo e modificarne nome, capienza e forma
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Filtri ospiti ────────────────────────────────────────────────────── */}
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

      {/* ── Tabella ospiti ───────────────────────────────────────────────────── */}
      {loading ? <p className="text-mist font-sans text-sm">Caricamento…</p> : (
        <div className="card overflow-x-auto">
          <table className="w-full admin-table min-w-[700px]">
            <thead>
              <tr className="text-left">
                <th>Ospite</th><th>Contatti</th><th>Mezzo</th><th>Dieta</th><th>+1</th><th>Tavolo</th><th></th>
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
                      <button onClick={() => setEditing(g)} className="text-mist hover:text-camel transition-colors" title="Modifica">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteGuest(g.id, `${g.first_name} ${g.last_name}`)} className="text-mist hover:text-red-400 transition-colors" title="Elimina">
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
      )}
    </div>
  )
}
