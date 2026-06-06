const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
  errorFormat: 'minimal',
})

async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ PostgreSQL connected via Prisma')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = { prisma, connectDB }
