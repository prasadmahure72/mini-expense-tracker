import { subDays, subMonths, startOfMonth, format } from 'date-fns'

const categories = ['food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'education', 'other']
const titles = {
  food: ['Lunch at Subway', 'Groceries', 'Coffee Shop', 'Pizza Delivery', 'Restaurant Dinner'],
  transport: ['Uber Ride', 'Gas Station', 'Bus Pass', 'Train Ticket', 'Parking Fee'],
  shopping: ['Amazon Order', 'Clothing Store', 'Electronics', 'Home Decor', 'Shoes'],
  entertainment: ['Netflix', 'Movie Tickets', 'Spotify Premium', 'Game Purchase', 'Concert Tickets'],
  health: ['Gym Membership', 'Pharmacy', 'Doctor Visit', 'Vitamins', 'Dental Checkup'],
  utilities: ['Electric Bill', 'Water Bill', 'Internet Plan', 'Phone Bill', 'Gas Bill'],
  education: ['Online Course', 'Books', 'Udemy Course', 'Subscription', 'Workshop'],
  other: ['Haircut', 'Laundry', 'Pet Food', 'Charity Donation', 'Miscellaneous'],
}

function rand(min, max) { return Math.random() * (max - min) + min }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export function generateExpenses(count = 50) {
  return Array.from({ length: count }, (_, i) => {
    const cat = pick(categories)
    return {
      _id: `exp_${i + 1}`,
      title: pick(titles[cat]),
      amount: parseFloat(rand(5, 500).toFixed(2)),
      category: cat,
      date: subDays(new Date(), Math.floor(rand(0, 90))).toISOString(),
      notes: Math.random() > 0.6 ? 'Notes for this expense' : '',
      createdAt: subDays(new Date(), Math.floor(rand(0, 90))).toISOString(),
    }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function generateMonthlyTrend() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i)
    return {
      month: format(startOfMonth(d), 'MMM yyyy'),
      total: parseFloat(rand(800, 3000).toFixed(2)),
    }
  })
}

export function generateSummary(expenses) {
  const now = new Date()
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0)
  const totalMonth = thisMonth.reduce((s, e) => s + e.amount, 0)
  const byCategory = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0)

  return { totalAll, totalMonth, byCategory, count: expenses.length, monthCount: thisMonth.length }
}
