import api from './api'
import { mockExpenseService } from './mockService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const expenseService = USE_MOCK ? mockExpenseService : {
  getAll: async (params = {}) => { const { data } = await api.get('/expenses', { params }); return data },
  getById: async (id) => { const { data } = await api.get(`/expenses/${id}`); return data },
  create: async (expense) => { const { data } = await api.post('/expenses', expense); return data },
  update: async (id, expense) => { const { data } = await api.put(`/expenses/${id}`, expense); return data },
  delete: async (id) => { const { data } = await api.delete(`/expenses/${id}`); return data },
  getSummary: async () => { const { data } = await api.get('/expenses/summary'); return data },
  getMonthlyTrend: async () => { const { data } = await api.get('/expenses/monthly-trend'); return data },
}
