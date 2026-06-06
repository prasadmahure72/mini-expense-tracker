const { prisma } = require('../config/database')
const ApiError = require('../utils/ApiError')

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const ALLOWED_SORT_FIELDS = ['date', 'amount', 'title', 'createdAt']

const buildWhereClause = (userId, { search, category, startDate, endDate }) => {
  const where = { userId }

  if (search?.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { notes: { contains: search.trim(), mode: 'insensitive' } },
    ]
  }
  if (category) where.category = category
  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = new Date(startDate)
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      where.date.lte = end
    }
  }
  return where
}

const getAllExpenses = async (userId, query = {}) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    search,
    category,
    startDate,
    endDate,
    sortBy = 'date',
    sortDir = 'desc',
  } = query

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'date'
  const safeSortDir = sortDir === 'asc' ? 'asc' : 'desc'

  const where = buildWhereClause(userId, { search, category, startDate, endDate })

  const [expenses, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortDir },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        notes: true,
        date: true,
        createdAt: true,
      },
    }),
    prisma.expense.count({ where }),
  ])

  return { expenses: expenses.map(normalizeExpense), total, page: pageNum, limit: limitNum }
}

const getExpenseById = async (userId, id) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  })
  if (!expense) throw ApiError.notFound('Expense not found')
  return normalizeExpense(expense)
}

const createExpense = async (userId, data) => {
  const expense = await prisma.expense.create({
    data: {
      userId,
      title: data.title.trim(),
      amount: parseFloat(data.amount),
      category: data.category,
      notes: data.notes?.trim() || null,
      date: new Date(data.date),
    },
  })
  return normalizeExpense(expense)
}

const updateExpense = async (userId, id, data) => {
  const exists = await prisma.expense.findFirst({ where: { id, userId } })
  if (!exists) throw ApiError.notFound('Expense not found')

  const updated = await prisma.expense.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.amount !== undefined && { amount: parseFloat(data.amount) }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
    },
  })
  return normalizeExpense(updated)
}

const deleteExpense = async (userId, id) => {
  const exists = await prisma.expense.findFirst({ where: { id, userId } })
  if (!exists) throw ApiError.notFound('Expense not found')
  await prisma.expense.delete({ where: { id } })
  return { id }
}

// Convert Prisma Decimal to number for JSON
const normalizeExpense = (expense) => ({
  ...expense,
  amount: parseFloat(expense.amount),
})

module.exports = { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense }
