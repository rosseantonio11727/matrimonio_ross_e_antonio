'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ChecklistItem, ChecklistCategory } from '@/lib/types'
import { Plus, Check, Trash2 } from 'lucide-react'

const PHASES: { value: ChecklistCategory; label: string; months: string }[] = [
  { value: '12_months', label: '12 Mesi Prima',   months: 'Sett. 2024' },
  { value: '9_months',  label: '9 Mesi Prima',    months: 'Dic. 2024' },
  { value: '6_months',  label: '6 Mesi Prima',    months: 'Mar. 2025' },
  { value: '3_months',  label: '3 Mesi Prima',    months: 'Giu. 2025' },
  { value: '1_month',   label: '1 Mese Prima',    months: 'Ago. 2025' },
  { value: '1_week',    label: '1 Settimana Prima',months: 'Set. 1–5' },
  { value: 'day_of',    label: 'Il Giorno',        months: '12 Set.' },
]

const DEFAULT_TASKS: Omit<ChecklistItem,'id'>[] = [
  // 12 months
  { task:'Scegliere e prenotare la location',          category:'12_months', done:false, due_date:null, priority:'high' },
  { task:'Fissare la data e registrarla in comune',    category:'12_months', done:false, due_date:null, priority:'high' },
  { task:'Definire il budget complessivo',             category:'12_months', done:false, due_date:null, priority:'high' },
  { task:'Scegliere fotografo e videomaker',           category:'12_months', done:false, due_date:null, priority:'high' },
  { task:'Scegliere l\'abito da sposa (primo appuntamento)', category:'12_months', done:false, due_date:null, priority:'medium' },
  // 9 months
  { task:'Prenotare il catering',                      category:'9_months', done:false, due_date:null, priority:'high' },
  { task:'Scegliere il fioraio e il tema floreale',    category:'9_months', done:false, due_date:null, priority:'medium' },
  { task:'Definire la lista degli invitati',           category:'9_months', done:false, due_date:null, priority:'high' },
  { task:'Prenotare musica (DJ o live band)',           category:'9_months', done:false, due_date:null, priority:'high' },
  { task:'Prenotare hotel / navette per gli ospiti',   category:'9_months', done:false, due_date:null, priority:'medium' },
  // 6 months
  { task:'Inviare le partecipazioni',                  category:'6_months', done:false, due_date:null, priority:'high' },
  { task:'Aprire il sito web del matrimonio',          category:'6_months', done:false, due_date:null, priority:'medium' },
  { task:'Prenotare hair & make-up',                   category:'6_months', done:false, due_date:null, priority:'high' },
  { task:'Scegliere e prenotare la luna di miele',     category:'6_months', done:false, due_date:null, priority:'medium' },
  { task:'Definire il menu con il catering',           category:'6_months', done:false, due_date:null, priority:'high' },
  // 3 months
  { task:'Raccogliere e gestire le RSVP',              category:'3_months', done:false, due_date:null, priority:'high' },
  { task:'Confermare tutti i fornitori',               category:'3_months', done:false, due_date:null, priority:'high' },
  { task:'Scegliere la torta nuziale',                 category:'3_months', done:false, due_date:null, priority:'medium' },
  { task:'Prova abito definitiva',                     category:'3_months', done:false, due_date:null, priority:'high' },
  { task:'Organizzare il seating arrangement',         category:'3_months', done:false, due_date:null, priority:'medium' },
  // 1 month
  { task:'Consegnare la scaletta al DJ/band',          category:'1_month',  done:false, due_date:null, priority:'high' },
  { task:'Consegnare il brief al fotografo',           category:'1_month',  done:false, due_date:null, priority:'high' },
  { task:'Confermare numero tavoli e menù speciali',   category:'1_month',  done:false, due_date:null, priority:'high' },
  { task:'Ritiro abiti',                               category:'1_month',  done:false, due_date:null, priority:'high' },
  // 1 week
  { task:'Sopralluogo finale alla location',           category:'1_week',   done:false, due_date:null, priority:'high' },
  { task:'Preparare le buste per i fornitori',         category:'1_week',   done:false, due_date:null, priority:'medium' },
  { task:'Confermare le navette',                      category:'1_week',   done:false, due_date:null, priority:'medium' },
  // Day of
  { task:'Colazione con calma e team hair/make-up',   category:'day_of',   done:false, due_date:null, priority:'high' },
  { task:'Consegnare le buste ai fornitori',           category:'day_of',   done:false, due_date:null, priority:'high' },
  { task:'GODERSI OGNI SINGOLO MOMENTO ✨',            category:'day_of',   done:false, due_date:null, priority:'high' },
]

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [newCat,  setNewCat]  = useState<ChecklistCategory>('3_months')

  const load = async () => {
    const { data } = await supabase.from('checklist_items').select('*').order('category').order('done')
    setItems((data ?? []) as ChecklistItem[])
    setLoading(false)
  }

  const seed = async () => {
    if (!confirm('Popolare la checklist con i task predefiniti?')) return
    await supabase.from('checklist_items').insert(DEFAULT_TASKS)
    load()
  }

  useEffect(() => { load() }, [])

  const toggle = async (item: ChecklistItem) => {
    await supabase.from('checklist_items').update({ done: !item.done }).eq('id', item.id)
    load()
  }

  const del = async (id: string) => {
    await supabase.from('checklist_items').delete().eq('id', id)
    load()
  }

  const add = async () => {
    if (!newTask.trim()) return
    await supabase.from('checklist_items').insert([{
      task: newTask, category: newCat, done: false, priority: 'medium', due_date: null,
    }])
    setNewTask('')
    load()
  }

  const done  = items.filter(i => i.done).length
  const total = items.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const byPhase = PHASES.map(p => ({
    ...p,
    items: items.filter(i => i.category === p.value),
  }))

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="section-label mb-1">To-Do</p>
          <h1 className="font-serif text-3xl text-charcoal">Preparativi</h1>
        </div>
        {items.length === 0 && (
          <button onClick={seed} className="btn-primary">Popola Template</button>
        )}
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-sm text-mist">{done} di {total} completati</p>
          <p className="font-mono text-sm text-camel">{pct}%</p>
        </div>
        <div className="w-full bg-greige h-2 rounded-full overflow-hidden">
          <div className="bg-sage h-full transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Add task */}
      <div className="flex gap-3 mb-8">
        <input value={newTask} onChange={e => setNewTask(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && add()}
               placeholder="Aggiungi un nuovo task…"
               className="flex-1 border border-greige bg-white px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-camel" />
        <select value={newCat} onChange={e => setNewCat(e.target.value as ChecklistCategory)}
                className="border border-greige bg-white px-3 py-2.5 font-sans text-sm focus:outline-none">
          {PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <button onClick={add} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Aggiungi
        </button>
      </div>

      {/* Phases */}
      {loading
        ? <p className="text-mist text-sm">Caricamento…</p>
        : byPhase.map(phase => phase.items.length > 0 && (
          <div key={phase.value} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-serif text-lg text-charcoal">{phase.label}</h3>
              <span className="font-mono text-xs text-mist">{phase.months}</span>
              <span className="font-mono text-xs text-sage ml-auto">
                {phase.items.filter(i => i.done).length}/{phase.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {phase.items.map(item => (
                <div key={item.id}
                     className={`flex items-center gap-3 p-3 border transition-colors
                       ${item.done ? 'border-greige bg-cream' : 'border-greige bg-white hover:border-camel/40'}`}>
                  <button onClick={() => toggle(item)}
                          className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-colors
                            ${item.done ? 'bg-sage border-sage' : 'border-greige hover:border-sage'}`}>
                    {item.done && <Check size={11} className="text-white" />}
                  </button>
                  <span className={`font-sans text-sm flex-1 ${item.done ? 'line-through text-mist' : 'text-charcoal'}`}>
                    {item.task}
                  </span>
                  {item.priority === 'high' && !item.done && (
                    <span className="w-1.5 h-1.5 rounded-full bg-camel flex-shrink-0" title="Alta priorità" />
                  )}
                  <button onClick={() => del(item.id)}
                          className="text-greige hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  )
}
