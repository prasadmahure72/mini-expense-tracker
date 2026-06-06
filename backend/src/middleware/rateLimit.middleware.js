const rateLimit = require('express-rate-limit')

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
  })

const globalLimiter = createLimiter(
  15 * 60 * 1000,  // 15 min
  200,
  'Too many requests, please try again later'
)

const authLimiter = createLimiter(
  15 * 60 * 1000,  // 15 min
  20,
  'Too many authentication attempts, please try again in 15 minutes'
)

module.exports = { globalLimiter, authLimiter }
