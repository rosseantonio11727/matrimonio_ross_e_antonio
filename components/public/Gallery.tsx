'use client'
import { useLocale } from '@/lib/locale-context'

export default function Gallery() {
  const { t } = useLocale()
  const photos = [
    { src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80', alt: 'Masseria Palesi' },
    { src: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80', alt: 'Olive trees' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', alt: 'Garden party' },
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt: 'Food' },
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
