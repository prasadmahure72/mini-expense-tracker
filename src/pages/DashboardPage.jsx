import { useDashboard, useExpenses } from '@/hooks/useExpenses'
import StatCard from '@/components/ui/StatCard'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { getCategoryMeta } from '@/utils/constants'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { DollarSign, TrendingUp, Calendar, ShoppingCart } from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { PageLoader } from '@/components/ui/LoadingSpinner'

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#6366f1', '#0ea5e9', '#6b7280']

function RecentTable({ expenses, loading }) {
  if (loading) return <PageLoader />
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            {['Title', 'Category', 'Date', 'Amount'].map(h => (
              <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {expenses.slice(0, 8).map(e => (
            <tr key={e.id || e._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{e.title}</td>
              <td className="py-2.5 px-3"><CategoryBadge category={e.category} /></td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{formatDate(e.date)}</td>
              <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(e.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && (
        <div className="text-center py-10 text-gray-400">No expenses yet</div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { summary, trend, loading: dashLoading } = useDashboard()
  const { expenses, loading: expLoading } = useExpenses({ limit: 10, page: 1 })

  // Support both real API field names and mock field names
  const totalExpenses = summary?.totalExpenses ?? summary?.totalAll ?? 0
  const totalCount    = summary?.totalCount    ?? summary?.count    ?? 0
  const monthExpenses = summary?.currentMonthExpenses ?? summary?.totalMonth    ?? 0
  const monthCount    = summary?.currentMonthCount    ?? summary?.monthCount    ?? 0
  const categories    = summary?.categoryWiseExpenses ?? summary?.byCategory    ?? []

  const pieData = categories.map(c => ({
    name: getCategoryMeta(c.category).label,
    value: parseFloat(Number(c.total).toFixed(2)),
  }))

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle={`${totalCount} transactions`}
          icon={DollarSign}
          color="primary"
          loading={dashLoading}
        />
        <StatCard
          title="This Month"
          value={formatCurrency(monthExpenses)}
          subtitle={`${monthCount} transactions`}
          icon={Calendar}
          color="green"
          loading={dashLoading}
        />
        <StatCard
          title="Avg per Transaction"
          value={formatCurrency(totalCount ? totalExpenses / totalCount : 0)}
          subtitle="All time average"
          icon={TrendingUp}
          color="amber"
          loading={dashLoading}
        />
        <StatCard
          title="Top Category"
          value={categories[0] ? getCategoryMeta(categories[0].category).label : '—'}
          subtitle={categories[0] ? formatCurrency(categories[0].total) : ''}
          icon={ShoppingCart}
          color="violet"
          loading={dashLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monthly Trend */}
        <div className="card p-5 xl:col-span-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Expense Trend</h3>
          {dashLoading ? <PageLoader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v}`} />
                <Tooltip
                  formatter={(v) => [formatCurrency(v), 'Total']}
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Expense Distribution</h3>
          {dashLoading ? <PageLoader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      {!dashLoading && categories.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {[...categories].sort((a, b) => b.total - a.total).map((c, i) => {
              const pct = totalExpenses > 0 ? ((c.total / totalExpenses) * 100).toFixed(1) : '0.0'
              const meta = getCategoryMeta(c.category)
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{meta.label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(c.total)}{' '}
                      <span className="text-xs text-gray-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <RecentTable expenses={expenses} loading={expLoading} />
      </div>
    </div>
  )
}
