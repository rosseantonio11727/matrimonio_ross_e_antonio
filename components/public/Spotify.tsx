'use client'
import { useLocale } from '@/lib/locale-context'

// ─── SpotifyWidget ─────────────────────────────────────────────────────────────
// Playlist collaborativa — ospiti invitati ad aggiungere tracce.
// Stilizzato nella palette wedding-cream/burgundy, geometrico, senza bordi arrotondati.

const PLAYLIST_ID = "0ePG3UmJi0dMvVmnh2hLPq"

export default function Spotify() {
  const { locale } = useLocale()

  const copy = {
    it: {
      label:    "La Colonna Sonora",
      title:    "La nostra playlist collaborativa",
      subtitle: "Aggiungete le canzoni che volete sentire la sera del matrimonio.",
      body:     "Aprite Spotify, cercate la playlist "Rossella & Antonio 2027" e aggiungete le vostre tracce preferite. Più siamo, più la sera sarà indimenticabile.",
      cta:      "Apri su Spotify →",
    },
    en: {
      label:    "The Soundtrack",
      title:    "Our collaborative playlist",
      subtitle: "Add the songs you want to hear on our wedding night.",
      body:     "Open Spotify, find the playlist "Rossella & Antonio 2027" and add your favourite tracks. The more the merrier — let's make it unforgettable.",
      cta:      "Open on Spotify →",
    },
  }

  const t = copy[locale as keyof typeof copy] ?? copy.it

  return (
    <section className="py-section bg-wedding-cream border-t border-greige">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-xl mb-12 reveal">
          <p className="section-label mb-4">{t.label}</p>
          <h2 className="font-serif italic text-heading text-wedding-burgundy mb-2 text-balance">
            {t.title}
          </h2>
          <p className="font-serif text-lg text-wedding-slate/70 mb-4">{t.subtitle}</p>
          <div className="divider mb-6" />
          <p className="font-sans text-sm text-mist leading-relaxed">{t.body}</p>
        </div>

        {/* Layout a due colonne su desktop */}
        <div className="grid md:grid-cols-[1fr_420px] gap-10 items-start">

          {/* Colonna testo — dettagli aggiuntivi */}
          <div className="reveal space-y-6">
            <div className="border-l-2 border-wedding-sky pl-5">
              <p className="font-mono text-xs tracking-widest uppercase text-mist mb-1">
                {locale === 'it' ? 'Come partecipare' : 'How to join'}
              </p>
              <p className="font-sans text-sm text-wedding-slate leading-relaxed">
                {locale === 'it'
                  ? 'Cliccate "Segui" sulla playlist, poi usate il pulsante ＋ per aggiungere i vostri brani. Non serve un account Spotify premium.'
                  : 'Click "Follow" on the playlist, then use the ＋ button to add your tracks. No Spotify premium needed.'}
              </p>
            </div>
            <div className="border-l-2 border-wedding-sky pl-5">
              <p className="font-mono text-xs tracking-widest uppercase text-mist mb-1">
                {locale === 'it' ? 'Il nostro stile' : 'Our vibe'}
              </p>
              <p className="font-sans text-sm text-wedding-slate leading-relaxed">
                {locale === 'it'
                  ? 'Dal pop italiano degli anni 90 al jazz, dall\'indie al classico da matrimonio. Tutto è benvenuto — anche i guilty pleasure.'
                  : 'Italian 90s pop, jazz, indie, wedding classics. Everything welcome — guilty pleasures included.'}
              </p>
            </div>
            <a
              href={`https://open.spotify.com/playlist/${PLAYLIST_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-block mt-2"
            >
              {t.cta}
            </a>
          </div>

          {/* Embed Spotify — geometrico, lazy-loaded */}
          <div className="reveal" style={{ transitionDelay: '120ms' }}>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="420"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: 0 }}   // geometrico — nessun arrotondamento
              title="Playlist collaborativa Rossella & Antonio"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
