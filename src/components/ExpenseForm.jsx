import { useState } from 'react'
import { CATEGORIES } from '@/utils/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { format } from 'date-fns'

const today = format(new Date(), 'yyyy-MM-dd')

export default function ExpenseForm({ initial = {}, onSubmit, loading, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: today,
    notes: '',
    ...initial,
    amount: initial.amount !== undefined ? String(initial.amount) : '',
    date: initial.date ? format(new Date(initial.date), 'yyyy-MM-dd') : today,
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount) e.amount = 'Amount is required'
    else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) e.amount = 'Amount must be a positive number'
    if (!form.date) e.date = 'Date is required'
    if (!form.category) e.category = 'Category is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="label">Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={form.title}
          onChange={set('title')}
          className={`input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
          placeholder="e.g. Lunch at restaurant"
          maxLength={100}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Amount + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Amount ($) <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={form.amount}
              onChange={set('amount')}
              min="0.01"
              step="0.01"
              className={`input pl-7 ${errors.amount ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>
        <div>
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select
            value={form.category}
            onChange={set('category')}
            className={`input ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          value={form.date}
          onChange={set('date')}
          max={today}
          className={`input ${errors.date ? 'border-red-400 focus:ring-red-400' : ''}`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={3}
          className="input resize-none"
          placeholder="Any additional details..."
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{form.notes.length}/500</p>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
          {loading && <LoadingSpinner size="sm" />}
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
