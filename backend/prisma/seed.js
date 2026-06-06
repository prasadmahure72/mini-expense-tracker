const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'education', 'other']
const SAMPLE_EXPENSES = [
  { title: 'Grocery Shopping', category: 'food', amount: 85.50 },
  { title: 'Netflix Subscription', category: 'entertainment', amount: 15.99 },
  { title: 'Gas Station', category: 'transport', amount: 60.00 },
  { title: 'Gym Membership', category: 'health', amount: 49.99 },
  { title: 'Electric Bill', category: 'utilities', amount: 120.00 },
  { title: 'Amazon Order', category: 'shopping', amount: 145.75 },
  { title: 'Uber Ride', category: 'transport', amount: 18.50 },
  { title: 'Restaurant Dinner', category: 'food', amount: 65.00 },
  { title: 'Online Course', category: 'education', amount: 29.99 },
  { title: 'Phone Bill', category: 'utilities', amount: 55.00 },
]

async function main() {
  console.log('🌱 Seeding database...')

  const hashed = await bcrypt.hash('demo123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { name: 'Demo User', email: 'demo@example.com', password: hashed },
  })

  await prisma.expense.deleteMany({ where: { userId: user.id } })

  const now = new Date()
  const expenses = []
  for (let i = 0; i < 50; i++) {
    const base = SAMPLE_EXPENSES[i % SAMPLE_EXPENSES.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    expenses.push({
      userId: user.id,
      title: base.title,
      amount: parseFloat((base.amount * (0.8 + Math.random() * 0.4)).toFixed(2)),
      category: base.category,
      date,
      notes: Math.random() > 0.6 ? 'Sample expense note' : null,
    })
  }

  await prisma.expense.createMany({ data: expenses })
  console.log(`✅ Created demo user and ${expenses.length} expenses`)
  console.log('   Email: demo@example.com | Password: demo123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
