const ApiError = require('../utils/ApiError')
const logger = require('../utils/logger')

// Prisma error codes → HTTP errors
const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return ApiError.conflict(`Duplicate value on field: ${err.meta?.target?.join(', ')}`)
    case 'P2025':
      return ApiError.notFound('Record not found')
    case 'P2003':
      return ApiError.badRequest('Foreign key constraint failed')
    case 'P2014':
      return ApiError.badRequest('Invalid data provided')
    default:
      return ApiError.internal('Database error')
  }
}

const errorHandler = (err, req, res, next) => {
  let error = err

  // Handle Prisma errors
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    error = handlePrismaError(err)
  } else if (err.constructor?.name === 'PrismaClientValidationError') {
    error = ApiError.badRequest('Invalid data format')
  } else if (!(err instanceof ApiError)) {
    error = new ApiError(
      err.statusCode || 500,
      err.message || 'Internal server error',
      [],
      err.stack
    )
  }

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: error.stack,
    })
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors?.length && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`))
}

module.exports = { errorHandler, notFound }
