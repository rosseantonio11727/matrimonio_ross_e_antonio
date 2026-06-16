import { Hotel, Train, Plane, Car, ArrowRight } from 'lucide-react'

const hotels = [
  {
    name: 'Masseria Il Frantoio',
    category: '★★★★★ Masseria di Lusso',
    distance: '10 min da Masseria Palesi',
    price: 'Da €220/notte',
    note: 'Masseria storica con piscina, oliveto e cucina tipica pugliese.',
    url: '#',
  },
  {
    name: 'Hotel Villa Ducale',
    category: '★★★★ Boutique Hotel',
    distance: 'Centro di Martina Franca',
    price: 'Da €120/notte',
    note: 'Nel cuore del centro storico barocco. Colazione con prodotti locali inclusa.',
    url: '#',
  },
  {
    name: 'Trulli & Puglia B&B',
    category: '★★★ Agriturismo',
    distance: '15 min dalla location',
    price: 'Da €75/notte',
    note: "Soggiorno in trullo ristrutturato. Esperienza autentica nella Valle d'Itria.",
    url: '#',
  },
]

const transport = [
  {
    Icon: Plane,
    title: 'In Aereo',
    color: 'text-bordeaux',
    bg: 'bg-bordeaux/10',
    items: [
      { label: 'Aeroporto di Brindisi (BDS)', detail: '~51 km · 55 minuti in auto · consigliato' },
      { label: 'Aeroporto di Bari (BRI)', detail: '~68 km · 1h 20min in auto' },
    ],
  },
  {
    Icon: Train,
    title: 'In Treno',
    color: 'text-azure',
    bg: 'bg-azure/10',
    items: [
      { label: 'Stazione Martina Franca (FSE)', detail: 'Linea Bari–Taranto e Martina–Lecce. ~1 treno/ora da Bari.' },
      { label: 'Dalla stazione alla masseria', detail: '~6 km · taxi disponibili in piazza' },
    ],
  },
  {
    Icon: Car,
    title: 'In Auto',
    color: 'text-olive',
    bg: 'bg-olive/10',
    items: [
      { label: 'Da Brindisi', detail: 'SS7 direzione Taranto, poi SP per Martina Franca · 55 min' },
      { label: 'Da Bari', detail: 'SS100 direzione Taranto, poi SP60 · 1h circa' },
      { label: 'Parcheggio', detail: 'Gratuito e ampio in masseria' },
    ],
  },
]

export default function Accommodations() {
  return (
    <section id="alloggi" className="py-section bg-butter/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-16 reveal">
          <p className="section-label mb-4">Dove Dormire &amp; Come Arrivare</p>
          <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">Alloggi &amp; Logistica</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">
            Martina Franca e la Valle d&apos;Itria offrono strutture tra le più affascinanti
            di tutta la Puglia. Vi consigliamo di prenotare con anticipo — luglio è alta stagione.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {hotels.map((h, i) => (
            <div key={i} className="bg-white border border-greige p-6 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <Hotel size={16} className="text-olive mt-1" />
                <span className="font-mono text-xs text-bordeaux">{h.price}</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-1">{h.name}</h3>
              <p className="font-mono text-xs text-mist tracking-wider mb-3">{h.category}</p>
              <p className="font-sans text-xs text-mist mb-1">{h.distance}</p>
              <p className="font-sans text-xs text-mist italic border-t border-greige pt-3 mt-3 leading-relaxed">{h.note}</p>
              <a href={h.url} className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors">
                Prenota <ArrowRight size={10} />
              </a>
            </div>
          ))}
        </div>

        <div className="border-t border-greige pt-12">
          <h3 className="font-serif text-2xl text-charcoal mb-8 reveal">Come Arrivare</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {transport.map(({ Icon, title, color, bg, items }, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 ${bg} border border-greige rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} className={color} />
                  </div>
                  <h4 className="font-serif text-lg text-charcoal">{title}</h4>
                </div>
                <div className="flex flex-col gap-3 pl-12">
                  {items.map((item, j) => (
                    <div key={j}>
                      <p className="font-sans text-sm font-medium text-charcoal">{item.label}</p>
                      <p className="font-sans text-xs text-mist leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-white border border-greige border-l-4 border-l-olive reveal">
            <p className="section-label mb-2">🚌 Navetta Organizzata</p>
            <p className="font-sans text-sm text-mist leading-relaxed">
              Organizzeremo una navetta dalla <strong className="text-charcoal">Stazione di Martina Franca</strong> alle
              <strong className="text-charcoal"> 15:00</strong> con rientro dopo la festa.
              Indicalo nel modulo RSVP — ti invieremo i dettagli via email.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
