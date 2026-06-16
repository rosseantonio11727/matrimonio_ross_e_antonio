'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CheckSquare, PiggyBank, BarChart2, Lock, LogOut } from 'lucide-react'

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'rossella2027'

const nav = [
  { href: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/admin/guests',    label: 'Invitati',   Icon: Users },
  { href: '/admin/budget',    label: 'Budget',     Icon: PiggyBank },
  { href: '/admin/checklist', label: 'Preparativi',Icon: CheckSquare },
  { href: '/admin/analytics', label: 'Analytics',  Icon: BarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth')
    if (stored === 'true') setAuth(true)
  }, [])

  const login = () => {
    if (pwd === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuth(true)
    } else {
      setErr(true)
      setTimeout(() => setErr(false), 2000)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuth(false)
    setPwd('')
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="font-serif text-3xl text-ivory mb-2">S &amp; L</p>
            <p className="font-mono text-xs tracking-widest text-ivory/40 uppercase">Area Riservata</p>
          </div>
          <div className="bg-ivory p-8">
            <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center mb-6 mx-auto">
              <Lock size={16} className="text-camel" />
            </div>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password"
              className={`w-full border px-4 py-3 font-sans text-sm text-charcoal focus:outline-none mb-4 transition-colors
                ${err ? 'border-red-400 bg-red-50' : 'border-greige focus:border-camel'}`}
            />
            {err && <p className="font-sans text-xs text-red-500 mb-4">Password errata.</p>}
            <button onClick={login} className="btn-primary w-full text-center">Accedi</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-56 bg-charcoal flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="font-serif text-xl text-ivory">S &amp; L</p>
          <p className="font-mono text-xs text-ivory/40 tracking-wider mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors rounded-sm
                      ${active ? 'bg-bordeaux text-ivory' : 'text-ivory/60 hover:text-ivory hover:bg-white/5'}`}>
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>
        <button onClick={logout}
                className="m-4 flex items-center gap-2 px-3 py-2 font-sans text-xs text-ivory/40 hover:text-ivory transition-colors">
          <LogOut size={13} /> Esci
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
