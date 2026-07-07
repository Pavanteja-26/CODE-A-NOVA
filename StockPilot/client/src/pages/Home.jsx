import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { HiChartBar, HiCube, HiTruck, HiLightningBolt, HiShieldCheck, HiClock } from 'react-icons/hi'

const FEATURES = [
  { icon: HiCube,          title: 'Real-time Inventory',  desc: 'Track every unit with live stock counts and instant updates across your warehouse.' },
  { icon: HiChartBar,      title: 'Sales Analytics',      desc: 'Powerful dashboards and charts give you a complete picture of revenue and trends.' },
  { icon: HiTruck,         title: 'Supplier Management',  desc: 'Manage vendors, purchase orders, and restocking flows from one central hub.' },
  { icon: HiLightningBolt, title: 'Low-Stock Alerts',     desc: 'Never run out of stock. Automated alerts trigger when inventory hits your threshold.' },
  { icon: HiShieldCheck,   title: 'Secure & Role-based',  desc: 'JWT authentication keeps your data safe with role-based access control.' },
  { icon: HiClock,         title: 'Full History',         desc: 'Every sale and purchase is logged with timestamps for complete audit trails.' },
]

const STATS = [
  { value: '10k+', label: 'Products Tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'Businesses' },
  { value: '< 100ms', label: 'API Response' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-28 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Inventory Management — Reimagined
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Control Your Stock
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              With Confidence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            StockPilot is the all-in-one inventory platform that gives you real-time visibility, intelligent alerts, and powerful analytics — so you never miss a beat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25">
              Get Started Free →
            </Link>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all border border-white/20">
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-indigo-400">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Everything You Need to Run Your Inventory
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From tracking stock levels to analyzing sales trends — StockPilot handles it all in one beautiful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to pilot your inventory?</h2>
          <p className="text-indigo-200 mb-8">Join hundreds of businesses already using StockPilot to streamline operations.</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all shadow-lg">
            Start for Free →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
