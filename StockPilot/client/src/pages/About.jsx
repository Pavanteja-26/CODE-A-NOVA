import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { HiCheckCircle } from 'react-icons/hi'

const VALUES = [
  'Built for speed and scale',
  'Data security first',
  'Intuitive, distraction-free UI',
  'Continuous improvement',
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About StockPilot</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            We're on a mission to make inventory management effortless for businesses of every size.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              StockPilot was born out of frustration with clunky, overpriced inventory tools that were designed for
              enterprises — not the growing businesses that needed them most.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our team set out to build a clean, modern alternative that gives small and medium businesses the same
              powerful capabilities at a fraction of the cost.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, StockPilot is used by hundreds of businesses worldwide to track inventory, manage suppliers,
              record sales, and make data-driven decisions.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Our Core Values</h3>
            <ul className="space-y-4">
              {VALUES.map((v) => (
                <li key={v} className="flex items-center gap-3">
                  <HiCheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-indigo-100 grid grid-cols-2 gap-4">
              {[['2024', 'Founded'], ['500+', 'Businesses'], ['10k+', 'Products'], ['99.9%', 'Uptime']].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-2xl font-extrabold text-indigo-600">{val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Built by Founders, for Founders</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our team combines deep experience in logistics, software engineering, and design to deliver a platform that actually makes sense.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
