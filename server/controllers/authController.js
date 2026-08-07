const { validationResult } = require("express-validator")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")

const checkValidation = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg })
    return true
  }
  return false
}

const buildAuthResponse = (user) => ({
  token: generateToken(user._id, user.role),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
})

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    if (checkValidation(req, res)) return

    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A user already exists with this email",
        })
    }

    const user = await User.create({ name, email, password, role: "student" })

    res.status(201).json({ success: true, data: buildAuthResponse(user) })
  } catch (error) {
    next(error)
  }
}

// @desc    Login a student
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    if (checkValidation(req, res)) return

    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" })
    }

    res.json({ success: true, data: buildAuthResponse(user) })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: { user: req.user } })
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser, getMe }
