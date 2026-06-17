'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, type Locale, type Translations } from './i18n'

interface LocaleContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'it',
  setLocale: () => {},
  t: translations.it,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('it')
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
