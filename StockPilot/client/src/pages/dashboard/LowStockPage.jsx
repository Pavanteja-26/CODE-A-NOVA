import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { HiExclamation, HiMail, HiChevronRight } from 'react-icons/hi'

export default function LowStockPage() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const loadLowStock = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products/low-stock')
      setProducts(data)
    } catch {
      setError('Failed to load low-stock alerts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadLowStock() }, [loadLowStock])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Low Stock Alerts</h1>
        <p className="text-slate-500 text-sm mt-1">Products currently at or below their reorder threshold</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
      ) : products.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">All Clear!</h2>
          <p className="text-slate-500">All your products are adequately stocked.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {products.map((p) => (
            <div key={p._id} className="card border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <HiExclamation className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{p.name}</h3>
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 mt-1 inline-block">{p.SKU}</code>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Current Qty</p>
                  <p className="text-3xl font-extrabold text-red-600">{p.quantity}</p>
                  <p className="text-xs text-slate-400 mt-1">Threshold: {p.reorderThreshold}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Supplier</p>
                  <p className="text-sm font-medium text-slate-900">{p.supplier?.name || 'No Supplier Linked'}</p>
                  {p.supplier?.contactEmail && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <HiMail className="w-3.5 h-3.5" /> {p.supplier.contactEmail}
                    </p>
                  )}
                </div>

                <Link
                  to="/dashboard/purchases"
                  className="btn-primary py-2 text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Create Purchase Order <HiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
