'use client'
import { useLocale } from '@/lib/locale-context'

const styles = [
  { border: 'border-olive',    badge: 'bg-olive/10',    text: 'text-olive' },
  { border: 'border-bordeaux', badge: 'bg-bordeaux/10', text: 'text-bordeaux' },
  { border: 'border-azure',    badge: 'bg-azure/10',    text: 'text-azure' },
]

export default function Timeline() {
  const { t } = useLocale()
  return (
    <section id="programma" className="py-section bg-butter/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-16 reveal">
          <p className="section-label mb-4">{t.timeline.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">{t.timeline.title}</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.timeline.desc}</p>
        </div>
        <div className="flex flex-col gap-12">
          {t.timeline.days.map((d, di) => {
            const s = styles[di]
            return (
              <div key={di} className={`border-l-2 ${s.border} pl-8 md:pl-12 reveal`}
                   style={{ transitionDelay: `${di * 120}ms` }}>
                <div className="mb-6">
                  <div className={`inline-block px-3 py-1 rounded-full ${s.badge} mb-3`}>
                    <span className={`font-mono text-xs tracking-widest uppercase ${s.text}`}>
                      {d.day} {d.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-charcoal">{d.title}</h3>
                  <p className="font-sans text-sm text-mist mt-1">{d.subtitle}</p>
                </div>
                <div className="flex flex-col gap-3 mb-5">
                  {d.events.map((ev, ei) => (
                    <div key={ei} className="flex gap-4 items-start">
                      <span className={`font-mono text-xs w-14 flex-shrink-0 mt-0.5 tracking-wider ${s.text}`}>{ev.time}</span>
                      <span className="font-sans text-sm text-charcoal leading-relaxed">{ev.label}</span>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-xs text-mist italic border-t border-greige pt-4 leading-relaxed">{d.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
