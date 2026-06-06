const dashboardService = require('../services/dashboard.service')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user.id)
  ApiResponse.success(res, summary, 'Dashboard summary retrieved')
})

const getMonthlyTrend = asyncHandler(async (req, res) => {
  const months = Math.min(24, Math.max(1, parseInt(req.query.months) || 6))
  const trend = await dashboardService.getMonthlyTrend(req.user.id, months)
  ApiResponse.success(res, trend, 'Monthly trend retrieved')
})

module.exports = { getSummary, getMonthlyTrend }
