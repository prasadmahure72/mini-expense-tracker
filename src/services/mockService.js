import { generateExpenses, generateMonthlyTrend, generateSummary } from '@/utils/mockData'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

let expenses = generateExpenses(60)

const mockUsers = [
  { _id: 'u1', name: 'Demo User', email: 'demo@example.com', password: 'demo123' }
]

export const mockAuthService = {
  login: async ({ email, password }) => {
    await delay()
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) throw Object.assign(new Error('Invalid credentials'), { response: { data: { message: 'Invalid email or password' } } })
    const { password: _, ...safe } = user
    return { token: 'mock_jwt_token_' + Date.now(), user: safe }
  },
  register: async ({ name, email, password }) => {
    await delay()
    if (mockUsers.find(u => u.email === email)) throw Object.assign(new Error('Email taken'), { response: { data: { message: 'Email already registered' } } })
    const user = { _id: 'u' + Date.now(), name, email }
    mockUsers.push({ ...user, password })
    return { token: 'mock_jwt_token_' + Date.now(), user }
  },
  changePassword: async () => { await delay(); return { message: 'Password changed' } },
  updateProfile: async ({ name, email }) => {
    await delay()
    return { _id: 'u1', name, email }
  },
}

export const mockExpenseService = {
  getAll: async (params = {}) => {
    await delay()
    let result = [...expenses]
    if (params.search) result = result.filter(e => e.title.toLowerCase().includes(params.search.toLowerCase()))
    if (params.category) result = result.filter(e => e.category === params.category)
    if (params.startDate) result = result.filter(e => new Date(e.date) >= new Date(params.startDate))
    if (params.endDate) result = result.filter(e => new Date(e.date) <= new Date(params.endDate))
    if (params.sortBy === 'amount') result.sort((a, b) => params.sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount)
    else result.sort((a, b) => params.sortDir === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date))
    const total = result.length
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    return { expenses: result.slice((page - 1) * limit, page * limit), total }
  },
  getById: async (id) => { await delay(); return expenses.find(e => e._id === id) },
  create: async (data) => {
    await delay()
    const exp = { ...data, _id: 'exp_' + Date.now(), createdAt: new Date().toISOString() }
    expenses.unshift(exp)
    return exp
  },
  update: async (id, data) => {
    await delay()
    const i = expenses.findIndex(e => e._id === id)
    if (i === -1) throw new Error('Not found')
    expenses[i] = { ...expenses[i], ...data }
    return expenses[i]
  },
  delete: async (id) => { await delay(); expenses = expenses.filter(e => e._id !== id); return { message: 'Deleted' } },
  getSummary: async () => { await delay(); return generateSummary(expenses) },
  getMonthlyTrend: async () => { await delay(); return generateMonthlyTrend() },
}
