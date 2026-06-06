const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/expenses', require('./expense.routes'))
router.use('/dashboard', require('./dashboard.routes'))

// Health check
router.get('/health', (req, res) =>
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() })
)

module.exports = router
