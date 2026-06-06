import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { expenseService } from '@/services/expenseService'
import ExpenseForm from '@/components/ExpenseForm'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function AddExpensePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await expenseService.create(data)
      toast.success('Expense added successfully!')
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Expense</h2>
        <ExpenseForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Expense" />
      </div>
    </div>
  )
}
