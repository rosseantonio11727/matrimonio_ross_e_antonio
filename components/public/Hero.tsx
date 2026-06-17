'use client'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/locale-context'

function Countdown({ label }: { label: string }) {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    const target = new Date('2027-07-11T16:00:00')
    const calc = () => setDays(Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000)))
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [])
  if (days === null) return null
  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <span className="font-serif text-5xl md:text-6xl text-wedding-cream font-light drop-shadow">{days}</span>
      <span className="font-mono text-xs tracking-[0.25em] text-wedding-cream/70 uppercase">{label}</span>
    </div>
  )
}

export default function Hero() {
  const { t } = useLocale()
  const bgRef = useRef<HTMLDivElement>(null)

  // Parallax leggero sull'immagine di sfondo
  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    const onScroll = () => { el.style.transform = `translateY(${window.scrollY * 0.3}px)` }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Foto di sfondo con parallax */}
      <div ref={bgRef} className="absolute inset-0 scale-110" aria-hidden>
        <img
          src="/images/masseria-notte.jpg"
          alt="Masseria Palesi di notte"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay scuro per leggibilità */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/50 to-charcoal/70" aria-hidden />

      {/* Striscia colore in cima */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-sky via-wedding-burgundy to-olive z-10" />

      {/* Contenuto */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-5">
        <p className="section-label text-wedding-cream/70">{t.hero.invite}</p>
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="font-serif font-light text-display text-wedding-cream tracking-tight drop-shadow-lg">Rossella</h1>
          <span className="font-serif text-wedding-sky text-4xl md:text-6xl font-light">&amp;</span>
          <h1 className="font-serif font-light text-display text-wedding-cream tracking-tight drop-shadow-lg">Antonio</h1>
        </div>
        <div className="w-12 h-px bg-wedding-sky mt-1" />
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-wedding-cream/80">{t.hero.date}</p>
        <Countdown label={t.hero.countdown} />
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <a href="#rsvp" className="inline-block bg-wedding-burgundy text-wedding-cream font-sans text-sm tracking-widest uppercase px-8 py-3.5 hover:bg-wedding-slate transition-colors duration-300 cursor-pointer">
            {t.hero.cta_rsvp}
          </a>
          <a href="#cerimonia" className="inline-block border border-wedding-sky text-wedding-sky font-sans text-sm tracking-widest uppercase px-8 py-3.5 hover:bg-wedding-sky hover:text-wedding-cream transition-colors duration-300 cursor-pointer">
            {t.hero.cta_program}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <div className="w-px h-10 bg-wedding-cream/40" />
      </div>
    </section>
  )
}
