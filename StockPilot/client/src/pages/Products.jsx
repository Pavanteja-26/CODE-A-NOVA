import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FEATURES = [
  {
    title: 'Smart Dashboard',
    badge: 'Analytics',
    badgeColor: 'badge-blue',
    desc: 'A central overview with stat cards, revenue charts, and low-stock alerts. Everything you need at a glance.',
    metrics: [{ label: 'Stat cards', val: '5' }, { label: 'Chart types', val: '2' }, { label: 'Data refresh', val: 'Live' }],
  },
  {
    title: 'Product Catalogue',
    badge: 'Inventory',
    badgeColor: 'badge-green',
    desc: 'Rich product management with SKU tracking, category filtering, unit pricing, and reorder thresholds.',
    metrics: [{ label: 'Fields per product', val: '8+' }, { label: 'Search mode', val: 'Full-text' }, { label: 'Bulk support', val: 'Soon' }],
  },
  {
    title: 'Supplier Network',
    badge: 'Vendors',
    badgeColor: 'badge-yellow',
    desc: 'Manage your entire supplier network with linked products, contact info, and full purchase tracking.',
    metrics: [{ label: 'Contacts per supplier', val: '3' }, { label: 'Product links', val: '∞' }, { label: 'History', val: 'Full' }],
  },
  {
    title: 'Sales & Revenue',
    badge: 'Sales',
    badgeColor: 'badge-blue',
    desc: 'Record every sale, track customer names, and watch revenue roll up across daily, weekly, and monthly windows.',
    metrics: [{ label: 'Time windows', val: '3' }, { label: 'Top sellers', val: 'Top 5' }, { label: 'Chart period', val: '30 days' }],
  },
]

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Product</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Explore the key features that make StockPilot the most intuitive inventory platform for growing businesses.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          {FEATURES.map(({ title, badge, badgeColor, desc, metrics }, i) => (
            <div
              key={title}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center bg-slate-50 rounded-3xl p-8 border border-slate-100`}
            >
              <div className="flex-1">
                <span className={`${badgeColor} mb-3 inline-block`}>{badge}</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3">{title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
                <Link to="/login" className="btn-primary text-sm inline-block">
                  Try it now →
                </Link>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4">
                {metrics.map(({ label, val }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 text-center border border-slate-100 shadow-sm">
                    <p className="text-2xl font-extrabold text-indigo-600">{val}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
