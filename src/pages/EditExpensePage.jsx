import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { expenseService } from '@/services/expenseService'
import ExpenseForm from '@/components/ExpenseForm'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export default function EditExpensePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    expenseService.getById(id)
      .then(setExpense)
      .catch(() => { toast.error('Expense not found'); navigate('/expenses') })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await expenseService.update(id, data)
      toast.success('Expense updated!')
      navigate('/expenses')
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Edit Expense</h2>
        {fetching ? <PageLoader /> : (
          <ExpenseForm initial={expense} onSubmit={handleSubmit} loading={loading} submitLabel="Update Expense" />
        )}
      </div>
    </div>
  )
}
