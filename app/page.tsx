'use client'
import { useEffect } from 'react'
import { LocaleProvider } from '@/lib/locale-context'
import Nav from '@/components/public/Nav'
import Hero from '@/components/public/Hero'
import Gallery from '@/components/public/Gallery'
import Ceremony from '@/components/public/Ceremony'
import Accommodations from '@/components/public/Accommodations'
import Timeline from '@/components/public/Timeline'
import Spotify from '@/components/public/Spotify'
import DressCode from '@/components/public/DressCode'
import Weather from '@/components/public/Weather'
import GiftList from '@/components/public/GiftList'
import Faq from '@/components/public/Faq'
import RsvpForm from '@/components/public/RsvpForm'
import Footer from '@/components/public/Footer'

export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <LocaleProvider>
      <Nav />
      <main>
        <Hero />
        <Gallery />
        <Ceremony />
        <Accommodations />
        <Timeline />
        <Spotify />
        <DressCode />
        <Weather />
        <GiftList />
        <Faq />
        <RsvpForm />
      </main>
      <Footer />
    </LocaleProvider>
  )
}
