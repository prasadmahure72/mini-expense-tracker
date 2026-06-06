import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1 <= 5 ? i + 1 : i === 5 ? '...' : totalPages
    if (page >= totalPages - 3) return i === 0 ? 1 : i === 1 ? '...' : totalPages - 4 + i
    return i === 0 ? 1 : i === 1 ? '...' : i === 5 ? '...' : i === 6 ? totalPages : page - 2 + i
  })

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages} &middot; {total} total
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && onChange(p)}
            disabled={p === '...'}
            className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-primary-600 text-white'
                : p === '...'
                ? 'cursor-default text-gray-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
