import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmit] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmit(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll get back to you shortly.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: HiMail,           label: 'Email',   val: 'hello@stockpilot.io' },
                { icon: HiPhone,          label: 'Phone',   val: '+1 (555) 000-1234' },
                { icon: HiLocationMarker, label: 'Address', val: '123 Inventory Lane, San Francisco, CA' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-slate-800 font-medium mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white">
              <h3 className="font-bold text-lg mb-2">Support Hours</h3>
              <p className="text-indigo-200 text-sm">Monday – Friday: 9am – 6pm PST</p>
              <p className="text-indigo-200 text-sm">Weekend: Email only</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmit(false)} className="btn-secondary mt-6 text-sm">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Send a Message</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
