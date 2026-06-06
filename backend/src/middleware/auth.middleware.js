const { verifyToken } = require('../config/jwt')
const { prisma } = require('../config/database')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access token required')
  }

  const token = authHeader.split(' ')[1]
  let decoded
  try {
    decoded = verifyToken(token)
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Token expired')
    throw ApiError.unauthorized('Invalid token')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  if (!user) throw ApiError.unauthorized('User no longer exists')

  req.user = user
  next()
})

module.exports = { authenticate }
