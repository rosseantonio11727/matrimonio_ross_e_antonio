'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const { t } = useLocale()
  return (
    <section id="faq" className="py-section bg-ivory">
      <div className="max-w-3xl mx-auto px-6">
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">{t.faq.label}</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">{t.faq.title}</h2>
          <div className="divider mb-4" />
          <p className="text-mist leading-relaxed">{t.faq.desc}</p>
        </div>
        <div className="flex flex-col gap-2">
          {t.faq.items.map((faq, i) => (
            <div key={i} className="border border-greige bg-white reveal" style={{ transitionDelay: `${i * 50}ms` }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                <span className="font-serif text-base text-charcoal">{faq.q}</span>
                <span className="flex-shrink-0 text-azure">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-greige">
                  <p className="font-sans text-sm text-mist leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="font-sans text-sm text-mist text-center mt-10 reveal">
          {t.faq.contact}{' '}
          <a href="mailto:rosseantonio11727@gmail.com" className="text-azure hover:text-bordeaux transition-colors underline">
            rosseantonio11727@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}
