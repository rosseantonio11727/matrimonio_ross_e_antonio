'use client'
import { Heart } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const IBAN = 'IT60 X054 2811 1010 0000 0123 456'

export default function GiftList() {
  const { t } = useLocale()
  return (
    <section id="lista-nozze" className="py-section bg-ivory">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="reveal mb-12">
          <p className="section-label mb-4">{t.gifts.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">{t.gifts.title}</h2>
          <div className="divider mx-auto mb-6" />
          <p className="text-mist leading-relaxed max-w-lg mx-auto">{t.gifts.desc}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mb-10 text-left">
          <div className="card reveal">
            <div className="w-8 h-8 bg-bordeaux/10 rounded-full flex items-center justify-center mb-5">
              <Heart size={13} className="text-bordeaux" />
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-2">{t.gifts.bank}</h3>
            <p className="font-sans text-xs text-mist mb-5 leading-relaxed">
              {t.gifts.bank_to} <strong className="text-charcoal">Rossella</strong>
            </p>
            <div className="bg-butter/30 border border-greige p-4">
              <p className="section-label mb-2">IBAN</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm text-charcoal tracking-wider break-all">{IBAN}</p>
                <button onClick={() => navigator.clipboard.writeText(IBAN)}
                        className="flex-shrink-0 px-3 py-1.5 font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors border border-greige hover:border-azure">
                  {t.gifts.copy}
                </button>
              </div>
              <p className="font-sans text-xs text-mist mt-2"><em>{t.gifts.reason}</em></p>
            </div>
          </div>
          <div className="card reveal">
            <div className="w-8 h-8 bg-azure/10 rounded-full flex items-center justify-center mb-5">
              <span className="text-azure text-sm">✈</span>
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-2">{t.gifts.honeymoon}</h3>
            <p className="font-sans text-xs text-mist mb-5 leading-relaxed">{t.gifts.honeymoon_desc}</p>
            <a href="https://www.honeyfund.com" target="_blank" rel="noopener noreferrer"
               className="btn-primary text-center block">
              {t.gifts.honeymoon_cta}
            </a>
            <p className="font-mono text-xs text-mist text-center mt-4">{t.gifts.honeymoon_via}</p>
          </div>
        </div>
        <p className="font-sans text-sm text-mist italic reveal">{t.gifts.contact}</p>
      </div>
    </section>
  )
}
