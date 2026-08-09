const User = require("../models/User")
const Student = require("../models/Student")
const Recruiter = require("../models/Recruiter")
const ApiError = require("../utils/ApiError")
const generateToken = require("../utils/generateToken")
const { ROLES } = require("../config/constants")

const registerUser = async ({
  name,
  email,
  password,
  role,
  department,
  cgpa,
  rollNumber,
  companyName,
}) => {
  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(
      409,
      "A user already exists with this email",
      "EMAIL_EXISTS",
    )
  }

  const user = await User.create({ name, email, password, role })

  // Create a partial role profile at signup; remaining fields are completed
  // via the profile page (profileCompleted stays false until it is).
  if (user.role === ROLES.STUDENT) {
    const studentData = { user: user._id, name, email }
    if (department) studentData.department = department
    if (cgpa != null && cgpa !== "") studentData.cgpa = Number(cgpa)
    if (rollNumber) studentData.rollNumber = rollNumber
    await Student.create(studentData)
  } else if (user.role === ROLES.RECRUITER && companyName) {
    await Recruiter.create({ user: user._id, companyName })
  }

  return user
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password")

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS")
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated. Contact the placement office.",
      "ACCOUNT_DEACTIVATED",
    )
  }

  user.lastLoginAt = new Date()
  await user.save()
  return user
}

const buildAuthResponse = (user) => ({
  token: generateToken(user._id, user.role),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  },
})

const getProfileForUser = async (user) => {
  let profile = null
  if (user.role === "student") {
    profile = await Student.findOne({ user: user._id }).lean()
  } else if (user.role === "recruiter") {
    profile = await Recruiter.findOne({ user: user._id }).lean()
  }
  return profile
}

module.exports = { registerUser, loginUser, buildAuthResponse, getProfileForUser }
