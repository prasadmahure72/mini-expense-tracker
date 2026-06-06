export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'transport', label: 'Transport', color: '#3b82f6', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'shopping', label: 'Shopping', color: '#8b5cf6', bg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  { value: 'entertainment', label: 'Entertainment', color: '#ec4899', bg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { value: 'health', label: 'Health', color: '#10b981', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'utilities', label: 'Utilities', color: '#6366f1', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { value: 'education', label: 'Education', color: '#0ea5e9', bg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  { value: 'other', label: 'Other', color: '#6b7280', bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
]

export const getCategoryMeta = (value) =>
  CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1]

export const ITEMS_PER_PAGE = 10
