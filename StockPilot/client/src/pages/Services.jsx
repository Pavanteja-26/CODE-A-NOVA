import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { HiCube, HiChartBar, HiTruck, HiExclamation, HiShieldCheck, HiClipboardList } from 'react-icons/hi'

const SERVICES = [
  {
    icon: HiCube,
    title: 'Inventory Tracking',
    color: 'bg-indigo-50 text-indigo-600',
    desc: 'Monitor stock levels in real time. Add, update, and delete products with full category support, SKU management, and unit pricing.',
    features: ['Real-time stock counts', 'SKU & category management', 'Unit price tracking', 'Search & filter'],
  },
  {
    icon: HiTruck,
    title: 'Supplier Management',
    color: 'bg-emerald-50 text-emerald-600',
    desc: 'Maintain a complete supplier directory with contact details, linked products, and purchase history at your fingertips.',
    features: ['Supplier directory', 'Contact management', 'Product-supplier linking', 'Purchase history'],
  },
  {
    icon: HiChartBar,
    title: 'Sales Analytics',
    color: 'bg-purple-50 text-purple-600',
    desc: 'Understand your revenue with daily, weekly, and monthly breakdowns. See top-selling products and identify trends with interactive charts.',
    features: ['Daily/weekly/monthly totals', 'Bar chart visualizations', 'Top sellers', 'Customer tracking'],
  },
  {
    icon: HiExclamation,
    title: 'Low-Stock Alerts',
    color: 'bg-yellow-50 text-yellow-600',
    desc: 'Set a reorder threshold per product and get instant alerts when stock falls below the limit. Never run out unexpectedly again.',
    features: ['Per-product thresholds', 'Visual warning cards', 'Dashboard count badge', 'Instant filtering'],
  },
  {
    icon: HiClipboardList,
    title: 'Purchase Orders',
    color: 'bg-blue-50 text-blue-600',
    desc: 'Record restocking purchases from suppliers. Stock levels auto-update instantly when a purchase is logged.',
    features: ['Supplier linking', 'Auto stock increment', 'Cost tracking', 'Full purchase history'],
  },
  {
    icon: HiShieldCheck,
    title: 'Secure Access',
    color: 'bg-red-50 text-red-600',
    desc: 'All data is protected with JWT authentication. Passwords are hashed using bcrypt. Only authenticated users can access inventory data.',
    features: ['JWT authentication', 'bcrypt password hashing', 'Token expiry', 'Protected API routes'],
  },
]

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Services</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            A complete suite of inventory management capabilities, built for modern teams.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map(({ icon: Icon, title, color, desc, features }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
