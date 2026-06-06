const bcrypt = require('bcryptjs')
const { prisma } = require('../config/database')
const { generateToken } = require('../config/jwt')
const ApiError = require('../utils/ApiError')

const SALT_ROUNDS = 12

const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw ApiError.conflict('Email already registered')

  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const token = generateToken({ userId: user.id, email: user.email })
  return { user, token }
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw ApiError.unauthorized('Invalid email or password')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw ApiError.unauthorized('Invalid email or password')

  const { password: _, ...safe } = user
  const token = generateToken({ userId: user.id, email: user.email })
  return { user: safe, token }
}

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) throw ApiError.badRequest('Current password is incorrect')

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
  return { message: 'Password changed successfully' }
}

const updateProfile = async (userId, data) => {
  if (data.email) {
    const exists = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    })
    if (exists) throw ApiError.conflict('Email already in use')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { ...(data.name && { name: data.name }), ...(data.email && { email: data.email }) },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return user
}

module.exports = { register, login, changePassword, updateProfile }
