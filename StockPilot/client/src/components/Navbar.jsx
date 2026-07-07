import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Services',     to: '/services' },
  { label: 'Our Products', to: '/our-products' },
  { label: 'Contact',      to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname }    = useLocation()

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-xl text-slate-900">Stock<span className="text-indigo-600">Pilot</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-primary text-sm">
              Login →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="btn-primary block text-center text-sm mt-2" onClick={() => setOpen(false)}>
            Login →
          </Link>
        </div>
      )}
    </nav>
  )
}
