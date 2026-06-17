'use client'
import { Heart, Clock, MapPin } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const icons = [Heart, Clock, MapPin]
const colors = [
  { text: 'text-bordeaux', bg: 'bg-bordeaux/10' },
  { text: 'text-olive',    bg: 'bg-olive/10' },
  { text: 'text-azure',    bg: 'bg-azure/10' },
]

export default function Ceremony() {
  const { t } = useLocale()
  return (
    <section id="cerimonia" className="py-section bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-16 reveal">
          <p className="section-label mb-4">{t.ceremony.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">{t.ceremony.title}</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.ceremony.desc}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {t.ceremony.events.map((ev, i) => {
            const Icon = icons[i]
            const c = colors[i]
            return (
              <div key={i} className="card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center`}>
                    <Icon size={14} className={c.text} />
                  </div>
                  <span className={`font-mono text-xs tracking-widest ${c.text}`}>{ev.time}</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-1">{ev.title}</h3>
                <p className="font-sans text-sm font-medium text-charcoal mb-1">{ev.location}</p>
                <p className="font-sans text-xs text-mist mb-4 leading-relaxed">{ev.address}</p>
                <p className="font-sans text-xs text-mist italic border-t border-greige pt-4 leading-relaxed">{ev.note}</p>
              </div>
            )
          })}
        </div>
        <div className="reveal w-full overflow-hidden border border-greige" style={{ height: '320px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.5!2d17.30489!3d40.66843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347859b3df5f609%3A0x3e5d4c0b0b0b0b0b!2sMasseria%20Palesi!5e0!3m2!1sit!2sit!4v1234567890"
            width="100%" height="320" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="Masseria Palesi" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-mono text-xs text-mist">{t.ceremony.address}</p>
          <a href="https://maps.google.com/?q=Masseria+Palesi+Martina+Franca+Taranto"
             target="_blank" rel="noopener noreferrer"
             className="font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors">
            {t.ceremony.open_maps}
          </a>
        </div>
      </div>
    </section>
  )
}
