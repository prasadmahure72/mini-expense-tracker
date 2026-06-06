const router = require('express').Router()
const dashboardController = require('../controllers/dashboard.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.use(authenticate)
router.get('/summary', dashboardController.getSummary)
router.get('/monthly-trend', dashboardController.getMonthlyTrend)

module.exports = router
