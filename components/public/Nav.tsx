'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#cerimonia',   label: t.nav.ceremony },
    { href: '#alloggi',     label: t.nav.accommodations },
    { href: '#programma',   label: t.nav.program },
    { href: '#dresscode',   label: t.nav.dresscode },
    { href: '#lista-nozze', label: t.nav.gifts },
    { href: '#faq',         label: t.nav.faq },
    { href: '#rsvp',        label: t.nav.rsvp },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${scrolled ? 'bg-ivory/95 backdrop-blur-sm border-b border-greige shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-serif text-xl tracking-widest text-charcoal">R&amp;A</a>

        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}
                 className="font-mono text-xs tracking-[0.15em] uppercase text-mist hover:text-azure transition-colors duration-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-greige rounded-full overflow-hidden">
            <button
              onClick={() => setLocale('it')}
              className={`px-3 py-1 font-mono text-xs transition-colors ${locale === 'it' ? 'bg-bordeaux text-ivory' : 'text-mist hover:text-charcoal'}`}>
              🇮🇹
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 font-mono text-xs transition-colors ${locale === 'en' ? 'bg-bordeaux text-ivory' : 'text-mist hover:text-charcoal'}`}>
              🇬🇧
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-charcoal" aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-ivory border-t border-greige px-6 py-6">
          <ul className="flex flex-col gap-5">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}
                   className="font-mono text-xs tracking-[0.18em] uppercase text-charcoal hover:text-azure transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
