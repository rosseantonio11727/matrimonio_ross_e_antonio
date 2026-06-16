'use client'
import { useEffect, useState } from 'react'
import { Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react'

interface WeatherData {
  temp: number
  humidity: number
  windspeed: number
  weathercode: number
}

function WeatherIcon({ code, size = 20 }: { code: number; size?: number }) {
  if (code === 0) return <Sun size={size} className="text-butter" style={{ color: '#C4962A' }} />
  if (code <= 3) return <Cloud size={size} className="text-azure" />
  return <CloudRain size={size} className="text-azure" />
}

function weatherDesc(code: number): string {
  if (code === 0) return 'Soleggiato'
  if (code <= 2) return 'Parzialmente nuvoloso'
  if (code <= 3) return 'Nuvoloso'
  return 'Variabile'
}

const WEDDING = new Date('2027-07-11')
const daysUntil = Math.ceil((WEDDING.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
const showLive = daysUntil <= 7 && daysUntil >= 0

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(showLive)

  useEffect(() => {
    if (!showLive) return
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.6684&longitude=17.3056&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=Europe/Rome')
      .then(r => r.json())
      .then(d => {
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          humidity: d.current.relative_humidity_2m,
          windspeed: Math.round(d.current.windspeed_10m),
          weathercode: d.current.weathercode,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-12 bg-azure/5 border-t border-greige">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 reveal">
            <p className="section-label mb-2">Meteo a Martina Franca</p>
            <h3 className="font-serif text-2xl text-charcoal mb-2">Clima il Giorno del Matrimonio</h3>
            <p className="font-sans text-xs text-mist leading-relaxed">
              Luglio in Puglia: 28–34°C, sole garantito e pochissima probabilità di pioggia.
              Perfetto per una cerimonia all&apos;aperto tra gli ulivi.
            </p>
          </div>
          <div className="reveal">
            {!showLive ? (
              <div className="bg-white border border-greige p-6 min-w-[200px] text-center">
                <Sun size={36} className="mx-auto mb-3" style={{ color: '#C4962A' }} />
                <p className="font-serif text-3xl text-charcoal mb-1">~31°C</p>
                <p className="font-mono text-xs text-mist tracking-wider mb-3 uppercase">Media Luglio</p>
                <div className="flex justify-center gap-4 text-xs text-mist font-sans">
                  <span className="flex items-center gap-1"><Droplets size={11} className="text-azure" /> ~55%</span>
                  <span className="flex items-center gap-1"><Wind size={11} className="text-azure" /> ~15 km/h</span>
                </div>
                <p className="font-mono text-xs text-mist/50 mt-3 pt-3 border-t border-greige">
                  Live 7 giorni prima
                </p>
              </div>
            ) : loading ? (
              <div className="bg-white border border-greige p-6 min-w-[200px] text-center">
                <p className="font-sans text-sm text-mist animate-pulse">Caricamento…</p>
              </div>
            ) : weather ? (
              <div className="bg-white border border-greige p-6 min-w-[200px] text-center">
                <WeatherIcon code={weather.weathercode} size={36} />
                <p className="font-serif text-4xl text-charcoal mt-2 mb-1">{weather.temp}°C</p>
                <p className="font-mono text-xs text-mist tracking-wider mb-3 uppercase">{weatherDesc(weather.weathercode)}</p>
                <div className="flex justify-center gap-4 text-xs text-mist font-sans">
                  <span className="flex items-center gap-1"><Droplets size={11} className="text-azure" /> {weather.humidity}%</span>
                  <span className="flex items-center gap-1"><Wind size={11} className="text-azure" /> {weather.windspeed} km/h</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
