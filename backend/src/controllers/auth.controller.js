const authService = require('../services/auth.service')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)
  ApiResponse.created(res, result, 'Account created successfully')
})

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)
  ApiResponse.success(res, result, 'Login successful')
})

const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, req.user, 'Profile retrieved')
})

const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body)
  ApiResponse.success(res, result, 'Password changed successfully')
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body)
  ApiResponse.success(res, user, 'Profile updated successfully')
})

module.exports = { register, login, getMe, changePassword, updateProfile }
