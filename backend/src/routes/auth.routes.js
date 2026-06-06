const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { authLimiter } = require('../middleware/rateLimit.middleware')
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require('../middleware/validators/auth.validator')

// Public
router.post('/register', authLimiter, registerValidator, validate, authController.register)
router.post('/login', authLimiter, loginValidator, validate, authController.login)

// Protected
router.use(authenticate)
router.get('/me', authController.getMe)
router.put('/profile', updateProfileValidator, validate, authController.updateProfile)
router.put('/change-password', changePasswordValidator, validate, authController.changePassword)

module.exports = router
