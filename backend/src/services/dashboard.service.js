const { prisma } = require('../config/database')
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns')

const getSummary = async (userId) => {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Run all queries in parallel for performance
  const [
    totalAgg,
    monthAgg,
    categoryAgg,
    recentExpenses,
  ] = await Promise.all([
    // Total all-time
    prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
    }),

    // Current month
    prisma.expense.aggregate({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
      _count: { id: true },
    }),

    // Category-wise breakdown
    prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    }),

    // Recent 10 transactions
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        date: true,
        notes: true,
        createdAt: true,
      },
    }),
  ])

  // Monthly trend: last 6 months
  const monthlyTrend = await getMonthlyTrend(userId, 6)

  return {
    totalExpenses: parseFloat(totalAgg._sum.amount || 0),
    totalCount: totalAgg._count.id,
    currentMonthExpenses: parseFloat(monthAgg._sum.amount || 0),
    currentMonthCount: monthAgg._count.id,
    categoryWiseExpenses: categoryAgg.map(c => ({
      category: c.category,
      total: parseFloat(c._sum.amount || 0),
      count: c._count.id,
    })),
    recentTransactions: recentExpenses.map(e => ({
      ...e,
      amount: parseFloat(e.amount),
    })),
    monthlyTrend,
  }
}

const getMonthlyTrend = async (userId, months = 6) => {
  const now = new Date()
  const results = []

  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(now, i)
    const start = startOfMonth(d)
    const end = endOfMonth(d)

    const agg = await prisma.expense.aggregate({
      where: { userId, date: { gte: start, lte: end } },
      _sum: { amount: true },
      _count: { id: true },
    })

    results.push({
      month: format(start, 'MMM yyyy'),
      monthKey: format(start, 'yyyy-MM'),
      total: parseFloat(agg._sum.amount || 0),
      count: agg._count.id,
    })
  }

  return results
}

module.exports = { getSummary, getMonthlyTrend }
