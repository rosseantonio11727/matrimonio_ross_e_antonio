'use client'
import { Sun, Footprints, Flower } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const icons = [Sun, Footprints, Flower]

export default function DressCode() {
  const { t } = useLocale()
  // solo le 3 note pratiche, senza "Foto & Social"
  const tips = t.dresscode.tips.filter((_, i) => i !== 2)
  return (
    <section id="dresscode" className="py-section bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">{t.dresscode.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4 text-balance">{t.dresscode.title}</h2>
          <div className="divider mb-6" />
          <p className="text-mist leading-relaxed">{t.dresscode.desc1}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="reveal p-5 bg-butter/30 border border-greige">
            <p className="section-label mb-3">{t.dresscode.for_him}</p>
            <p className="font-sans text-sm text-mist">{t.dresscode.for_him_text}</p>
          </div>
          <div className="reveal p-5 bg-azure/5 border border-greige">
            <p className="section-label mb-3">{t.dresscode.for_her}</p>
            <p className="font-sans text-sm text-mist">{t.dresscode.for_her_text}</p>
          </div>
        </div>
        <div>
          <h3 className="font-serif text-2xl text-charcoal mb-8 reveal">{t.dresscode.practical}</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {tips.map((tip, i) => {
              const Icon = icons[i]
              return (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-8 h-8 bg-olive/10 border border-olive/20 rounded-full flex items-center justify-center mb-4">
                    <Icon size={13} className="text-olive" />
                  </div>
                  <h4 className="font-serif text-base text-charcoal mb-2">{tip.title}</h4>
                  <p className="font-sans text-xs text-mist leading-relaxed">{tip.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
