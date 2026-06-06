import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useExpenses } from '@/hooks/useExpenses'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { CATEGORIES, ITEMS_PER_PAGE } from '@/utils/constants'
import CategoryBadge from '@/components/ui/CategoryBadge'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Pagination from '@/components/ui/Pagination'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, SlidersHorizontal } from 'lucide-react'

function SortBtn({ field, current, dir, onSort }) {
  const active = current === field
  return (
    <button onClick={() => onSort(field)} className="inline-flex items-center gap-1 hover:text-primary-600 transition-colors">
      {field.charAt(0).toUpperCase() + field.slice(1)}
      <span className="flex flex-col">
        <ChevronUp className={`w-3 h-3 -mb-0.5 ${active && dir === 'asc' ? 'text-primary-600' : 'text-gray-300'}`} />
        <ChevronDown className={`w-3 h-3 ${active && dir === 'desc' ? 'text-primary-600' : 'text-gray-300'}`} />
      </span>
    </button>
  )
}

export default function ExpensesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { expenses, total, loading, remove } = useExpenses({
    page, limit: ITEMS_PER_PAGE, search, category, startDate, endDate, sortBy, sortDir,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleSort = useCallback((field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
    setPage(1)
  }, [sortBy])

  const clearFilters = () => {
    setSearch(''); setSearchInput(''); setCategory(''); setStartDate(''); setEndDate('')
    setPage(1)
  }

  const hasFilters = search || category || startDate || endDate

  const handleDelete = async () => {
    setDeleting(true)
    await remove(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search expenses..."
              className="input pl-9"
            />
          </div>
          <button type="submit" className="btn-primary px-3">Search</button>
        </form>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`btn-secondary flex items-center gap-2 ${hasFilters ? 'ring-2 ring-primary-400' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
          </button>
          <Link to="/expenses/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} className="input">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">From Date</label>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1) }} className="input" />
          </div>
          <div>
            <label className="label">To Date</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1) }} className="input" />
          </div>
          {hasFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <SortBtn field="date" current={sortBy} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <SortBtn field="amount" current={sortBy} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="py-16"><PageLoader /></td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  {hasFilters ? 'No results match your filters' : 'No expenses found. Add your first expense!'}
                </td></tr>
              ) : (
                expenses.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">{e.title}</div>
                      {e.notes && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{e.notes}</div>}
                    </td>
                    <td className="py-3 px-4"><CategoryBadge category={e.category} /></td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{formatDate(e.date)}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{formatCurrency(e.amount)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/expenses/${e._id}/edit`)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(e._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && total > ITEMS_PER_PAGE && (
          <div className="px-4 pb-4">
            <Pagination page={page} total={total} perPage={ITEMS_PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
