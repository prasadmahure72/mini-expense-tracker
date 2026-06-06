const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const httpLogger = require('./middleware/logger.middleware')
const { globalLimiter } = require('./middleware/rateLimit.middleware')
const { errorHandler, notFound } = require('./middleware/error.middleware')
const routes = require('./routes')

const app = express()

// ── Security ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Rate limiting ─────────────────────────────────────────
app.use(globalLimiter)

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(compression())

// ── Logging ───────────────────────────────────────────────
app.use(httpLogger)

// ── Trust proxy (Render/Heroku) ───────────────────────────
app.set('trust proxy', 1)

// ── API Routes ────────────────────────────────────────────
app.use('/api', routes)

// ── Root ──────────────────────────────────────────────────
app.get('/', (req, res) =>
  res.json({
    message: 'ExpenseIQ API',
    version: '1.0.0',
    docs: '/api/health',
  })
)

// ── Error handling ────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
