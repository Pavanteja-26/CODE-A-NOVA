import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { HiArchive } from 'react-icons/hi'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [products,  setProducts]  = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [form,      setForm]      = useState({ product: '', supplier: '', quantityPurchased: '', totalCost: '' })

  const loadPurchases = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/purchases')
      setPurchases(data)
    } catch {
      setError('Failed to load purchases.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPurchases()
    api.get('/products').then(({ data }) => setProducts(data.products || data)).catch(() => {})
    api.get('/suppliers').then(({ data }) => setSuppliers(data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/purchases', {
        product: form.product,
        supplier: form.supplier,
        quantityPurchased: Number(form.quantityPurchased),
        totalCost: Number(form.totalCost),
      })
      setForm({ product: '', supplier: '', quantityPurchased: '', totalCost: '' })
      setSuccess('Purchase recorded! Stock has been updated.')
      loadPurchases()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record purchase.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Purchases</h1>
        <p className="text-slate-500 text-sm mt-1">Record restocks and view purchase history</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Record Purchase Form */}
        <div className="xl:col-span-1">
          <div className="card">
            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <HiArchive className="w-5 h-5 text-indigo-500" /> Record Purchase
            </h2>

            {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product *</label>
                <select required value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field">
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} — Current Qty: {p.quantity}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier *</label>
                <select required value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field">
                  <option value="">Select a supplier</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
                  <input required type="number" min="1" value={form.quantityPurchased} onChange={(e) => setForm({ ...form, quantityPurchased: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Total Cost *</label>
                  <input required type="number" min="0" step="0.01" value={form.totalCost} onChange={(e) => setForm({ ...form, totalCost: e.target.value })} className="input-field" placeholder="0.00" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? 'Recording...' : 'Record Purchase'}
              </button>
            </form>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="xl:col-span-2 card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Purchase History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Product', 'Supplier', 'Qty', 'Cost', 'Date'].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">Loading...</td></tr>
                ) : purchases.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">No purchases recorded yet.</td></tr>
                ) : purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-cell font-medium text-slate-900">{p.product?.name || 'Deleted'}</td>
                    <td className="table-cell text-slate-600">{p.supplier?.name || 'Deleted'}</td>
                    <td className="table-cell font-semibold">{p.quantityPurchased}</td>
                    <td className="table-cell font-bold text-red-600">${Number(p.totalCost).toFixed(2)}</td>
                    <td className="table-cell text-slate-500">
                      {new Date(p.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
