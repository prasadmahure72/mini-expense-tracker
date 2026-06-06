import { format, parseISO } from 'date-fns'

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch {
    return date
  }
}

export const formatShortDate = (date) => formatDate(date, 'MMM dd')

export const formatMonthYear = (date) => formatDate(date, 'MMM yyyy')
