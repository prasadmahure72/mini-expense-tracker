const router = require('express').Router()
const expenseController = require('../controllers/expense.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const {
  expenseBodyValidator,
  expenseQueryValidator,
  expenseIdValidator,
} = require('../middleware/validators/expense.validator')

router.use(authenticate)

router.get('/', expenseQueryValidator, validate, expenseController.getExpenses)
router.post('/', expenseBodyValidator, validate, expenseController.createExpense)
router.get('/:id', expenseIdValidator, validate, expenseController.getExpense)
router.put('/:id', [...expenseIdValidator, ...expenseBodyValidator], validate, expenseController.updateExpense)
router.delete('/:id', expenseIdValidator, validate, expenseController.deleteExpense)

module.exports = router
