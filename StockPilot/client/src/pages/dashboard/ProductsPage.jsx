import { useEffect, useState, useCallback } from 'react'
import api from '../../api/axios'
import { HiPlus, HiSearch, HiPencil, HiTrash, HiX } from 'react-icons/hi'

const EMPTY = { name: '', SKU: '', category: '', description: '', quantity: '', unitPrice: '', reorderThreshold: '', supplier: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products,  setProducts]  = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [modal,     setModal]     = useState(null)  // 'add' | 'edit' | 'delete'
  const [selected,  setSelected]  = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search)   params.search   = search
      if (category) params.category = category
      const { data } = await api.get('/products', { params })
      setProducts(data.products || data)
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => { loadProducts() }, [loadProducts])

  useEffect(() => {
    api.get('/suppliers').then(({ data }) => setSuppliers(data)).catch(() => {})
  }, [])

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (p) => {
    setSelected(p)
    setForm({
      name: p.name, SKU: p.SKU, category: p.category, description: p.description || '',
      quantity: p.quantity, unitPrice: p.unitPrice, reorderThreshold: p.reorderThreshold,
      supplier: p.supplier?._id || '',
    })
    setModal('edit')
  }
  const openDelete = (p) => { setSelected(p); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null); setError('') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice), reorderThreshold: Number(form.reorderThreshold) }
      if (!payload.supplier) delete payload.supplier
      if (modal === 'add') {
        await api.post('/products', payload)
      } else {
        await api.put(`/products/${selected._id}`, payload)
      }
      closeModal()
      loadProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/products/${selected._id}`)
      closeModal()
      loadProducts()
    } catch {
      setError('Failed to delete product.')
    } finally {
      setSaving(false)
    }
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} products in inventory</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Name', 'SKU', 'Category', 'Qty', 'Unit Price', 'Supplier', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">No products found.</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-cell font-medium text-slate-900">{p.name}</td>
                  <td className="table-cell"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{p.SKU}</code></td>
                  <td className="table-cell"><span className="badge-blue">{p.category}</span></td>
                  <td className="table-cell font-semibold">{p.quantity}</td>
                  <td className="table-cell">${Number(p.unitPrice).toFixed(2)}</td>
                  <td className="table-cell text-slate-500">{p.supplier?.name || '—'}</td>
                  <td className="table-cell">
                    {p.quantity <= p.reorderThreshold
                      ? <span className="badge-red">Low Stock</span>
                      : <span className="badge-green">In Stock</span>
                    }
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDelete(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={closeModal}>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">SKU *</label>
                <input required value={form.SKU} onChange={(e) => setForm({ ...form, SKU: e.target.value })} className="input-field" placeholder="SKU-001" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" placeholder="Electronics, Furniture..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Qty *</label>
                <input required type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Price *</label>
                <input required type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reorder At</label>
                <input type="number" min="0" value={form.reorderThreshold} onChange={(e) => setForm({ ...form, reorderThreshold: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier</label>
              <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field">
                <option value="">None</option>
                {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'add' ? 'Add Product' : 'Update Product'}
              </button>
              <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && (
        <Modal title="Delete Product" onClose={closeModal}>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete <strong className="text-slate-900">{selected?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex-1 disabled:opacity-60">
              {saving ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
