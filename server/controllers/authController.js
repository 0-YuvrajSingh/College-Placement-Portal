const asyncHandler = require("../utils/asyncHandler")
const authService = require("../services/auth.service")
const { ROLES } = require("../config/constants")

// @desc    Register a new user (student or recruiter)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, cgpa, rollNumber, companyName } = req.body
  const user = await authService.registerUser({
    name,
    email,
    password,
    role: role || ROLES.STUDENT,
    department,
    cgpa,
    rollNumber,
    companyName,
  })
  res.status(201).json({ success: true, data: authService.buildAuthResponse(user) })
})

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await authService.loginUser({ email, password })
  res.json({ success: true, data: authService.buildAuthResponse(user) })
})

// @desc    Logout current user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { message: "Logged out successfully. Discard the client-side token." },
  })
})

// @desc    Get current logged-in user with role profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfileForUser(req.user)
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        lastLoginAt: req.user.lastLoginAt,
        createdAt: req.user.createdAt,
      },
      profile,
    },
  })
})

module.exports = { register, login, logout, getMe }
