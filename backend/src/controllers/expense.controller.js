const expenseService = require('../services/expense.service')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const getExpenses = asyncHandler(async (req, res) => {
  const { expenses, total, page, limit } = await expenseService.getAllExpenses(
    req.user.id,
    req.query
  )
  ApiResponse.paginated(res, expenses, total, page, limit)
})

const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.user.id, req.params.id)
  ApiResponse.success(res, expense)
})

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.user.id, req.body)
  ApiResponse.created(res, expense, 'Expense created successfully')
})

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.user.id, req.params.id, req.body)
  ApiResponse.success(res, expense, 'Expense updated successfully')
})

const deleteExpense = asyncHandler(async (req, res) => {
  const result = await expenseService.deleteExpense(req.user.id, req.params.id)
  ApiResponse.success(res, result, 'Expense deleted successfully')
})

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense }
