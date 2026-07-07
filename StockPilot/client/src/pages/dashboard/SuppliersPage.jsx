import { useEffect, useState, useCallback } from 'react'
import api from '../../api/axios'
import { HiPlus, HiPencil, HiTrash, HiX, HiMail, HiPhone } from 'react-icons/hi'

const EMPTY = { name: '', contactEmail: '', contactPhone: '', address: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(null)
  const [selected,  setSelected]  = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  const loadSuppliers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/suppliers')
      setSuppliers(data)
    } catch {
      setError('Failed to load suppliers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSuppliers() }, [loadSuppliers])

  const openAdd    = () => { setForm(EMPTY); setModal('add') }
  const openEdit   = (s) => { setSelected(s); setForm({ name: s.name, contactEmail: s.contactEmail, contactPhone: s.contactPhone || '', address: s.address || '' }); setModal('edit') }
  const openDelete = (s) => { setSelected(s); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null); setError('') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (modal === 'add') await api.post('/suppliers', form)
      else await api.put(`/suppliers/${selected._id}`, form)
      closeModal()
      loadSuppliers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/suppliers/${selected._id}`)
      closeModal()
      loadSuppliers()
    } catch {
      setError('Failed to delete supplier.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Suppliers</h1>
          <p className="text-slate-500 text-sm mt-1">{suppliers.length} suppliers in directory</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading...</div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 mb-4">No suppliers added yet.</p>
          <button onClick={openAdd} className="btn-primary">Add your first supplier</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {suppliers.map((s) => (
            <div key={s._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.productsSupplied?.length || 0} products</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDelete(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <HiMail className="w-3.5 h-3.5 text-slate-400" /> {s.contactEmail}
                </div>
                {s.contactPhone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <HiPhone className="w-3.5 h-3.5 text-slate-400" /> {s.contactPhone}
                  </div>
                )}
                {s.address && (
                  <p className="text-xs text-slate-500 truncate">{s.address}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Supplier' : 'Edit Supplier'} onClose={closeModal}>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Email *</label>
              <input required type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="input-field" placeholder="contact@supplier.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input type="tel" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="input-field" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field resize-none" placeholder="123 Main St, City, State" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'add' ? 'Add Supplier' : 'Update'}
              </button>
              <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Supplier" onClose={closeModal}>
          <p className="text-slate-600 mb-6">
            Delete <strong className="text-slate-900">{selected?.name}</strong>? This cannot be undone.
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
