const { body, query, param } = require('express-validator')

const VALID_CATEGORIES = [
  'food', 'transport', 'shopping', 'entertainment',
  'health', 'utilities', 'education', 'other',
]

// Treat '', null, undefined, 0, false all as absent (skip validation)
const FALSY = { values: 'falsy' }

const expenseBodyValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be at most 100 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
    .custom(v => {
      if (parseFloat(v) > 1_000_000) throw new Error('Amount cannot exceed 1,000,000')
      return true
    }),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date')
    .toDate(),
  body('notes')
    .optional(FALSY)
    .trim()
    .isLength({ max: 500 }).withMessage('Notes must be at most 500 characters'),
]

const expenseQueryValidator = [
  query('page')
    .optional(FALSY)
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional(FALSY)
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('category')
    .optional(FALSY)
    .isIn(VALID_CATEGORIES).withMessage('Invalid category'),
  query('startDate')
    .optional(FALSY)
    .isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate')
    .optional(FALSY)
    .isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
  query('sortBy')
    .optional(FALSY)
    .isIn(['date', 'amount', 'title', 'createdAt']).withMessage('Invalid sortBy field'),
  query('sortDir')
    .optional(FALSY)
    .isIn(['asc', 'desc']).withMessage('sortDir must be asc or desc'),
]

const expenseIdValidator = [
  param('id')
    .notEmpty().withMessage('Expense ID is required')
    .isUUID().withMessage('Invalid expense ID format'),
]

module.exports = { expenseBodyValidator, expenseQueryValidator, expenseIdValidator }
