import LoadingSpinner from './LoadingSpinner'

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', loading }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          {loading ? (
            <div className="mt-2"><LoadingSpinner size="sm" /></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">{value}</p>
          )}
          {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colors[color]} shrink-0 ml-3`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}
