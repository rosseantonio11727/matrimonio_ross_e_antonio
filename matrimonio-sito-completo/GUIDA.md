# 📋 Guida — Sito Matrimonio Rossella & Antonio

## Cos'è
Sito completo per il matrimonio (11 Luglio 2027, Masseria Palesi, Puglia).
Stack: Next.js 14 + Tailwind CSS + Supabase.

## Variabili d'ambiente (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://rqbilxlpcdskmtbevktn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
NEXT_PUBLIC_ADMIN_PASSWORD=rossella2027
```

## Avvio locale
```
npm install
npm run dev
```

## Accesso Admin
URL del sito + `/admin` — password: rossella2027

## Struttura
- `app/page.tsx` — pagina pubblica
- `app/admin/` — dashboard sposi (budget, invitati, checklist, analytics)
- `app/api/rsvp/route.ts` — endpoint salvataggio RSVP
- `components/public/` — tutte le sezioni del sito
- `lib/i18n.ts` — traduzioni IT/EN
- `lib/locale-context.tsx` — gestione lingua
- `lib/supabase/client.ts` — connessione Supabase
- `supabase-schema.sql` — schema database (riferimento)

## Stato traduzioni
Tutte le sezioni sono tradotte IT/EN tramite il context useLocale().

## Da fare
- Foto Gallery: sostituire in components/public/Gallery.tsx (array `photos`)
- Spotify: aggiungere sezione playlist quando disponibili i link
