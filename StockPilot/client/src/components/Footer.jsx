import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="font-bold text-xl text-white">Stock<span className="text-indigo-400">Pilot</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The intelligent inventory management platform for modern businesses. Track, manage, and grow your stock with confidence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              {['Services', 'Our Products', 'About'].map((l) => (
                <li key={l}>
                  <Link to={`/${l.toLowerCase().replace(' ', '-')}`} className="hover:text-indigo-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {['Contact'].map((l) => (
                <li key={l}>
                  <Link to={`/${l.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} StockPilot. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with ❤️ using the MERN stack</p>
        </div>
      </div>
    </footer>
  )
}
