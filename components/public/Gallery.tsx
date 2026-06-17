'use client'
import { useLocale } from '@/lib/locale-context'

export default function Gallery() {
  const { t } = useLocale()
  const photos = [
    { src: '/images/masseria-corte.jpg', alt: 'Corte barocca Masseria Palesi' },
    { src: '/images/masseria-veduta.jpg', alt: 'Veduta aerea Masseria Palesi' },
    { src: '/images/masseria-tramonto.jpg', alt: 'Masseria Palesi al tramonto' },
    { src: '/images/masseria-notte.jpg', alt: 'Masseria Palesi di notte' },
  ]
  return (
    <section className="py-section bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">{t.gallery.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">Masseria Palesi</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.gallery.desc}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="reveal group overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="relative overflow-hidden aspect-square">
                <img src={photo.src} alt={photo.alt}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-bordeaux/10 transition-colors duration-300" />
              </div>
              <p className="font-mono text-xs text-mist tracking-wider mt-2 text-center">{t.gallery.captions[i]}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center reveal">
          <a href="https://masseriapalesi.it" target="_blank" rel="noopener noreferrer"
             className="font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors">
            {t.gallery.discover}
          </a>
        </div>
      </div>
    </section>
  )
}
