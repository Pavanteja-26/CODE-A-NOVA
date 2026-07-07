import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Public pages
import Home      from './pages/Home'
import About     from './pages/About'
import Services  from './pages/Services'
import Products  from './pages/Products'
import Contact   from './pages/Contact'
import Login     from './pages/Login'

// Dashboard pages
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview        from './pages/dashboard/Overview'
import ProductsPage    from './pages/dashboard/ProductsPage'
import SuppliersPage   from './pages/dashboard/SuppliersPage'
import SalesPage       from './pages/dashboard/SalesPage'
import PurchasesPage   from './pages/dashboard/PurchasesPage'
import LowStockPage    from './pages/dashboard/LowStockPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Home />} />
      <Route path="/about"   element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/our-products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login"   element={<Login />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index              element={<Navigate to="overview" replace />} />
        <Route path="overview"   element={<Overview />} />
        <Route path="products"   element={<ProductsPage />} />
        <Route path="suppliers"  element={<SuppliersPage />} />
        <Route path="sales"      element={<SalesPage />} />
        <Route path="purchases"  element={<PurchasesPage />} />
        <Route path="low-stock"  element={<LowStockPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
