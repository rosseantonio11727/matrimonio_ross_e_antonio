'use client'
import { useLocale } from '@/lib/locale-context'

export default function Footer() {
  const { t } = useLocale()
  return (
    <footer className="bg-charcoal text-ivory py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="w-full h-px bg-gradient-to-r from-azure via-bordeaux to-olive mb-12" />
        <p className="font-serif text-3xl md:text-4xl font-light mb-3">Rossella &amp; Antonio</p>
        <p className="font-mono text-xs tracking-[0.3em] text-ivory/50 mb-8 uppercase">{t.footer.date}</p>
        <div className="w-8 h-px bg-ivory/20 mx-auto mb-8" />
        <p className="font-sans text-xs text-ivory/40">
          {t.footer.contact}{' '}
          <a href="mailto:rosseantonio11727@gmail.com" className="underline hover:text-ivory transition-colors">
            rosseantonio11727@gmail.com
          </a>
        </p>
        <p className="font-sans text-xs text-ivory/20 mt-4">#RossellaEAntonio2027</p>
      </div>
    </footer>
  )
}
