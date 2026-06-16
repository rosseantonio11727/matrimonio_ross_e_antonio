import { Sun, Footprints, Camera, Flower } from 'lucide-react'

const tips = [
  {
    Icon: Sun,
    title: "Cerimonia all'Aperto",
    desc: 'La cerimonia si svolge nel giardino. Porta crema solare e occhiali da sole. In caso di pioggia, disponiamo di un piano B coperto.',
  },
  {
    Icon: Footprints,
    title: 'Scarpe Comode',
    desc: "Il giardino ha prato e pietra naturale. Le décolleté con tacchi a spillo possono affondare nell'erba — meglio un tacco largo o un sandalo.",
  },
  {
    Icon: Camera,
    title: 'Social & Foto',
    desc: "Libertà totale di scattare — hashtag #RossellaEAntonio2027. Durante la cerimonia ti chiediamo di abbassare il telefono per vivere il momento.",
  },
  {
    Icon: Flower,
    title: 'Aria Aperta',
    desc: 'In giardino ci sono piante aromatiche. Se sei allergico/a al polline, porta il tuo antistaminico. La cena è in ambiente chiuso e arieggiato.',
  },
]

export default function DressCode() {
  return (
    <section id="dresscode" className="py-section bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
          <div className="reveal">
            <p className="section-label mb-4">Dress Code</p>
            <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">Eleganza Italiana</h2>
            <div className="divider mb-6" />
            <p className="text-mist leading-relaxed mb-5">
              Il nostro desiderio è che vi sentiate bellissimi e a vostro agio.
              Il codice è <strong className="text-charcoal font-medium">garden party elegante</strong> —
              colori vivaci, floreali e pastello per lei, completo o giacca in lino per lui.
            </p>
            <p className="text-mist leading-relaxed mb-5">
              <strong className="text-charcoal font-medium">L&apos;unico no:</strong> il bianco puro,
              riservato alla sposa. Tutto il resto — colori chiari, neutri, floreali, pastello,
              persino il blu o il bordeaux — è benvenuto!
            </p>
            <p className="text-mist leading-relaxed">
              La nostra palette ispirazione: azzurro polvere, bordeaux, verde oliva,
              giallo burro, cipria, lavanda.
            </p>
          </div>

          <div className="reveal">
            {/* Palette swatches ispirata alle immagini */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { color: '#5B7BA8', label: 'Azzurro' },
                { color: '#6B1F1F', label: 'Bordeaux' },
                { color: '#6B7240', label: 'Olive' },
                { color: '#F4ECC2', label: 'Burro' },
                { color: '#B8C5D4', label: 'Cielo' },
                { color: '#D4C5A9', label: 'Sabbia' },
                { color: '#C5A8C8', label: 'Lavanda' },
                { color: '#E8C5B0', label: 'Cipria' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-full aspect-square rounded-sm border border-greige/50"
                       style={{ backgroundColor: s.color }} />
                  <p className="font-mono text-xs text-mist">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-5 bg-butter/30 border border-greige">
              <p className="section-label mb-3">Per lui</p>
              <p className="font-sans text-sm text-mist">Abito o completo in lino o cotone. Cravatta o pochette opzionale. Scarpe in pelle o mocassini.</p>
            </div>
            <div className="mt-3 p-5 bg-azure/5 border border-greige">
              <p className="section-label mb-3">Per lei</p>
              <p className="font-sans text-sm text-mist">Abito lungo o midi, tailleur, jumpsuit. Tacco non obbligatorio. Colori liberi — più sei colorata, meglio è!</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl text-charcoal mb-8 reveal">Note Pratiche</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tips.map(({ Icon, title, desc }, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-8 h-8 bg-olive/10 border border-olive/20 rounded-full flex items-center justify-center mb-4">
                  <Icon size={13} className="text-olive" />
                </div>
                <h4 className="font-serif text-base text-charcoal mb-2">{title}</h4>
                <p className="font-sans text-xs text-mist leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
