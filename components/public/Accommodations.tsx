'use client'
import { Hotel, Train, Plane, Car, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const hotels = [
  { name: 'Masseria Il Frantoio', stars: '★★★★★', price: '€220', distKey: 0 },
  { name: 'Hotel Villa Ducale',   stars: '★★★★',  price: '€120', distKey: 1 },
  { name: 'Trulli & Puglia B&B',  stars: '★★★',   price: '€75',  distKey: 2 },
]

const transportIcons = [Plane, Train, Car]
const transportColors = [
  { text: 'text-bordeaux', bg: 'bg-bordeaux/10' },
  { text: 'text-azure',    bg: 'bg-azure/10' },
  { text: 'text-olive',    bg: 'bg-olive/10' },
]

export default function Accommodations() {
  const { t, locale } = useLocale()

  const hotelMeta = locale === 'it'
    ? [
        { cat: '★★★★★ Masseria di Lusso', dist: '10 min da Masseria Palesi', note: 'Masseria storica con piscina, oliveto e cucina tipica pugliese.' },
        { cat: '★★★★ Boutique Hotel', dist: 'Centro di Martina Franca', note: 'Nel cuore del centro storico barocco. Colazione inclusa.' },
        { cat: '★★★ Agriturismo', dist: '15 min dalla location', note: 'Soggiorno in trullo ristrutturato. Esperienza autentica.' },
      ]
    : [
        { cat: '★★★★★ Luxury Masseria', dist: '10 min from Masseria Palesi', note: 'Historic estate with pool, olive grove and traditional Pugliese cuisine.' },
        { cat: '★★★★ Boutique Hotel', dist: 'Martina Franca town centre', note: 'In the heart of the Baroque old town. Breakfast included.' },
        { cat: '★★★ Farm Stay', dist: '15 min from the venue', note: 'Stay in a restored trullo. An authentic experience.' },
      ]

  const priceLabel = locale === 'it' ? 'Da' : 'From'
  const perNight = locale === 'it' ? '/notte' : '/night'

  return (
    <section id="alloggi" className="py-section bg-butter/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-16 reveal">
          <p className="section-label mb-4">{t.accommodations.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">{t.accommodations.title}</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.accommodations.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {hotels.map((h, i) => (
            <div key={i} className="bg-white border border-greige p-6 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <Hotel size={16} className="text-olive mt-1" />
                <span className="font-mono text-xs text-bordeaux">{priceLabel} {h.price}{perNight}</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-1">{h.name}</h3>
              <p className="font-mono text-xs text-mist tracking-wider mb-3">{hotelMeta[i].cat}</p>
              <p className="font-sans text-xs text-mist mb-1">{hotelMeta[i].dist}</p>
              <p className="font-sans text-xs text-mist italic border-t border-greige pt-3 mt-3 leading-relaxed">{hotelMeta[i].note}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors">
                {t.accommodations.book} <ArrowRight size={10} />
              </a>
            </div>
          ))}
        </div>

        <div className="border-t border-greige pt-12">
          <h3 className="font-serif text-2xl text-charcoal mb-8 reveal">{t.accommodations.how_to_arrive}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {t.accommodations.transport.map((tr, i) => {
              const Icon = transportIcons[i]
              const c = transportColors[i]
              return (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 ${c.bg} border border-greige rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon size={14} className={c.text} />
                    </div>
                    <h4 className="font-serif text-lg text-charcoal">{tr.title}</h4>
                  </div>
                  <div className="flex flex-col gap-3 pl-12">
                    {tr.items.map((item, j) => (
                      <div key={j}>
                        <p className="font-sans text-sm font-medium text-charcoal">{item.label}</p>
                        <p className="font-sans text-xs text-mist leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 p-6 bg-white border border-greige border-l-4 border-l-olive reveal">
            <p className="section-label mb-2">{t.accommodations.shuttle_label}</p>
            <p className="font-sans text-sm text-mist leading-relaxed">{t.accommodations.shuttle_text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
