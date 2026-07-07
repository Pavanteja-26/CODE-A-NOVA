import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiViewGrid,
  HiCube,
  HiTruck,
  HiShoppingCart,
  HiArchive,
  HiExclamation,
  HiLogout,
} from 'react-icons/hi'

const NAV_ITEMS = [
  { label: 'Overview',       to: '/dashboard/overview',   icon: HiViewGrid },
  { label: 'Products',       to: '/dashboard/products',   icon: HiCube },
  { label: 'Suppliers',      to: '/dashboard/suppliers',  icon: HiTruck },
  { label: 'Sales',          to: '/dashboard/sales',      icon: HiShoppingCart },
  { label: 'Purchases',      to: '/dashboard/purchases',  icon: HiArchive },
  { label: 'Low Stock',      to: '/dashboard/low-stock',  icon: HiExclamation },
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="font-bold text-sm">SP</span>
        </div>
        <div>
          <p className="font-bold text-base leading-tight">Stock<span className="text-indigo-400">Pilot</span></p>
          <p className="text-xs text-slate-400 leading-tight">Inventory Suite</p>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
              <p className="text-xs text-slate-400 leading-tight capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-900/50 hover:text-red-300 transition-all duration-150"
        >
          <HiLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
