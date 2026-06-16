'use client'
import { Heart } from 'lucide-react'

const IBAN = 'IT60 X054 2811 1010 0000 0123 456'

export default function GiftList() {
  return (
    <section id="lista-nozze" className="py-section bg-ivory">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="reveal mb-12">
          <p className="section-label mb-4">Lista Nozze</p>
          <h2 className="font-serif text-heading text-charcoal mb-4">Un Regalo Speciale</h2>
          <div className="divider mx-auto mb-6" />
          <p className="text-mist leading-relaxed max-w-lg mx-auto">
            La vostra presenza è il dono più grande che potessimo desiderare.
            Se però volete contribuire al nostro viaggio di nozze o alla nostra nuova casa,
            vi saremo infinitamente grati.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10 text-left">
          <div className="card reveal">
            <div className="w-8 h-8 bg-bordeaux/10 rounded-full flex items-center justify-center mb-5">
              <Heart size={13} className="text-bordeaux" />
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-2">Bonifico Bancario</h3>
            <p className="font-sans text-xs text-mist mb-5 leading-relaxed">
              Intestato a <strong className="text-charcoal">Rossella</strong>
            </p>
            <div className="bg-butter/30 border border-greige p-4">
              <p className="section-label mb-2">IBAN</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm text-charcoal tracking-wider break-all">{IBAN}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(IBAN)}
                  className="flex-shrink-0 px-3 py-1.5 font-mono text-xs tracking-widest uppercase text-azure hover:text-bordeaux transition-colors border border-greige hover:border-azure">
                  Copia
                </button>
              </div>
              <p className="font-sans text-xs text-mist mt-2">
                Causale: <em>Regalo matrimonio Rossella &amp; Antonio</em>
              </p>
            </div>
          </div>

          <div className="card reveal">
            <div className="w-8 h-8 bg-azure/10 rounded-full flex items-center justify-center mb-5">
              <span className="text-azure text-sm">✈</span>
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-2">Viaggio di Nozze</h3>
            <p className="font-sans text-xs text-mist mb-5 leading-relaxed">
              Stiamo sognando il Giappone in autunno.
              Ogni contributo ci aiuterà a rendere questo viaggio indimenticabile.
            </p>
            <a href="https://www.honeyfund.com" target="_blank" rel="noopener noreferrer"
               className="btn-primary text-center block">
              Contribuisci al Viaggio
            </a>
            <p className="font-mono text-xs text-mist text-center mt-4">Via HoneyFund — sicuro &amp; gratuito</p>
          </div>
        </div>

        <p className="font-sans text-sm text-mist italic reveal">
          Se preferite un regalo tradizionale, contattateci direttamente —
          saremo felici di darvi qualche suggerimento.
        </p>
      </div>
    </section>
  )
}
