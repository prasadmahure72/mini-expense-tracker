import api from './api'
import { mockExpenseService } from './mockService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const expenseService = USE_MOCK ? mockExpenseService : {
  // Returns { expenses, total } to match mock shape
  getAll: async (params = {}) => {
    const { data } = await api.get('/expenses', { params })
    return { expenses: data.data, total: data.meta?.total ?? data.data?.length ?? 0 }
  },
  getById: async (id) => { const { data } = await api.get(`/expenses/${id}`); return data.data },
  create: async (expense) => { const { data } = await api.post('/expenses', expense); return data.data },
  update: async (id, expense) => { const { data } = await api.put(`/expenses/${id}`, expense); return data.data },
  delete: async (id) => { const { data } = await api.delete(`/expenses/${id}`); return data.data },
  // Dashboard endpoints live under /dashboard, not /expenses
  getSummary: async () => { const { data } = await api.get('/dashboard/summary'); return data.data },
  getMonthlyTrend: async () => { const { data } = await api.get('/dashboard/monthly-trend'); return data.data },
}
