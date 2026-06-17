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
      <span className="font-serif text-5xl md:text-6xl text-bordeaux font-light">{days}</span>
      <span className="font-mono text-xs tracking-[0.25em] text-mist uppercase">{label}</span>
    </div>
  )
}

export default function Hero() {
  const { t } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => { el.style.transform = `translateY(${window.scrollY * 0.22}px)` }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ivory">
      <div ref={ref} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span className="font-serif text-[22vw] font-light leading-none tracking-tighter whitespace-nowrap"
              style={{ color: 'rgba(91,123,168,0.12)' }}>R&amp;A</span>
      </div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-azure via-bordeaux to-olive" />
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-5">
        <p className="section-label">{t.hero.invite}</p>
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="font-serif font-light text-display text-charcoal tracking-tight">Rossella</h1>
          <span className="font-serif text-bordeaux text-4xl md:text-6xl font-light">&amp;</span>
          <h1 className="font-serif font-light text-display text-charcoal tracking-tight">Antonio</h1>
        </div>
        <div className="divider mt-1" />
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-mist">{t.hero.date}</p>
        <Countdown label={t.hero.countdown} />
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <a href="#rsvp" className="btn-primary">{t.hero.cta_rsvp}</a>
          <a href="#cerimonia" className="btn-ghost">{t.hero.cta_program}</a>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-10 bg-greige" />
      </div>
    </section>
  )
}
