import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { HiShoppingCart } from 'react-icons/hi'

export default function SalesPage() {
  const [sales,    setSales]    = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [form,     setForm]     = useState({ product: '', quantitySold: '', customerName: '' })

  const loadSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/sales')
      setSales(data)
    } catch {
      setError('Failed to load sales.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
    api.get('/products').then(({ data }) => setProducts(data.products || data)).catch(() => {})
  }, [])

  const selectedProduct = products.find((p) => p._id === form.product)
  const estimatedTotal  = selectedProduct && form.quantitySold
    ? (selectedProduct.unitPrice * Number(form.quantitySold)).toFixed(2)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/sales', {
        product: form.product,
        quantitySold: Number(form.quantitySold),
        customerName: form.customerName || 'Walk-in Customer',
      })
      setForm({ product: '', quantitySold: '', customerName: '' })
      setSuccess('Sale recorded successfully!')
      loadSales()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sale.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Sales</h1>
        <p className="text-slate-500 text-sm mt-1">Record new sales and view transaction history</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Record Sale Form */}
        <div className="xl:col-span-1">
          <div className="card">
            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <HiShoppingCart className="w-5 h-5 text-indigo-500" /> Record a Sale
            </h2>

            {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product *</label>
                <select required value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field">
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id} disabled={p.quantity === 0}>
                      {p.name} — {p.quantity} in stock (${p.unitPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
                <input
                  required
                  type="number"
                  min="1"
                  max={selectedProduct?.quantity || undefined}
                  value={form.quantitySold}
                  onChange={(e) => setForm({ ...form, quantitySold: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
                {selectedProduct && (
                  <p className="text-xs text-slate-400 mt-1">Available: {selectedProduct.quantity} units</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="input-field"
                  placeholder="Walk-in Customer"
                />
              </div>

              {estimatedTotal && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Estimated Total</p>
                  <p className="text-2xl font-extrabold text-indigo-700 mt-0.5">${estimatedTotal}</p>
                </div>
              )}

              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? 'Recording...' : 'Record Sale'}
              </button>
            </form>
          </div>
        </div>

        {/* Sales Table */}
        <div className="xl:col-span-2 card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Sales History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Product', 'Customer', 'Qty', 'Total', 'Date'].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">Loading...</td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">No sales recorded yet.</td></tr>
                ) : sales.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-cell font-medium text-slate-900">{s.product?.name || 'Deleted'}</td>
                    <td className="table-cell text-slate-600">{s.customerName}</td>
                    <td className="table-cell font-semibold">{s.quantitySold}</td>
                    <td className="table-cell font-bold text-emerald-600">${Number(s.totalAmount).toFixed(2)}</td>
                    <td className="table-cell text-slate-500">
                      {new Date(s.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
