require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/database')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDB()
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
      logger.info(`🔗 API: http://localhost:${PORT}/api`)
    })

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        const { prisma } = require('./config/database')
        await prisma.$disconnect()
        logger.info('Server closed')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason)
      shutdown('unhandledRejection')
    })

    return server
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
