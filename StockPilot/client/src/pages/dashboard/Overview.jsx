import { useEffect, useState } from 'react'
import api from '../../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { HiCube, HiCurrencyDollar, HiExclamation, HiTrendingUp, HiShoppingCart } from 'react-icons/hi'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        <p>Revenue: <span className="text-indigo-400">${payload[0].value?.toFixed(2)}</span></p>
        {payload[1] && <p>Orders: <span className="text-purple-400">{payload[1].value}</span></p>}
      </div>
    )
  }
  return null
}

export default function Overview() {
  const [stats,  setStats]  = useState(null)
  const [chart,  setChart]  = useState([])
  const [loading, setLoad]  = useState(true)
  const [error,   setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/sales/summary'),
        ])
        setStats(statsRes.data)
        // Enrich chart with short date labels
        const enriched = (salesRes.data.chartData || []).map((d) => ({
          ...d,
          date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }))
        setChart(enriched)
      } catch {
        setError('Failed to load dashboard data.')
      } finally {
        setLoad(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-medium">{error}</div>
    )
  }

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={HiCube}
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          color="bg-indigo-500"
          sub="across all categories"
        />
        <StatCard
          icon={HiCurrencyDollar}
          label="Stock Value"
          value={fmt(stats?.totalStockValue ?? 0)}
          color="bg-emerald-500"
          sub="total inventory worth"
        />
        <StatCard
          icon={HiExclamation}
          label="Low Stock Alerts"
          value={stats?.lowStockCount ?? 0}
          color={stats?.lowStockCount > 0 ? 'bg-red-500' : 'bg-slate-400'}
          sub={stats?.lowStockCount > 0 ? 'needs attention' : 'all levels healthy'}
        />
        <StatCard
          icon={HiShoppingCart}
          label="Today's Sales"
          value={fmt(stats?.todaySales ?? 0)}
          color="bg-purple-500"
          sub={`Monthly: ${fmt(stats?.monthRevenue ?? 0)}`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Bar chart */}
        <div className="xl:col-span-2 card">
          <h2 className="text-base font-bold text-slate-900 mb-5">Sales Revenue — Last 30 Days</h2>
          {chart.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              No sales data yet. Record a sale to see the chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chart} barSize={14} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="orders"  fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-6 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 bg-indigo-500 rounded-sm inline-block" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 bg-violet-400 rounded-sm inline-block" /> Orders
            </span>
          </div>
        </div>

        {/* Top selling */}
        <div className="card">
          <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
            <HiTrendingUp className="w-4 h-4 text-indigo-500" /> Top Products
          </h2>
          {!stats?.topSelling?.length ? (
            <p className="text-slate-400 text-sm">No sales recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topSelling.map((p, i) => (
                <li key={p._id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.totalSold} units sold</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{fmt(p.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
