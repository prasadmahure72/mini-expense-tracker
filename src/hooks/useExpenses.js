import { useState, useEffect, useCallback } from 'react'
import { expenseService } from '@/services/expenseService'
import toast from 'react-hot-toast'

export function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expenseService.getAll(params)
      setExpenses(data.expenses || data)
      setTotal(data.total || (data.expenses || data).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  const remove = useCallback(async (id) => {
    try {
      await expenseService.delete(id)
      setExpenses(prev => prev.filter(e => e._id !== id && e.id !== id))
      setTotal(t => t - 1)
      toast.success('Expense deleted')
    } catch {
      // error handled by interceptor
    }
  }, [])

  return { expenses, total, loading, error, refetch: fetch, remove }
}

export function useDashboard() {
  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [s, t] = await Promise.all([
          expenseService.getSummary(),
          expenseService.getMonthlyTrend(),
        ])
        setSummary(s)
        setTrend(t)
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { summary, trend, loading }
}
