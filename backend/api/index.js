// Vercel serverless entry point — wraps the Express app
require('dotenv').config()
const app = require('../src/app')
const { connectDB } = require('../src/config/database')

// Connect DB once (Vercel may reuse the same instance)
let isConnected = false
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB()
    isConnected = true
  }
}

module.exports = async (req, res) => {
  await ensureDB()
  app(req, res)
}
