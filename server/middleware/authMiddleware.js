const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Recruiter = require("../models/Recruiter")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided", "UNAUTHORIZED")
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new ApiError(
      401,
      "Not authorized, token invalid or expired",
      "INVALID_TOKEN",
    )
  }

  const user = await User.findById(decoded.userId).select("-password")
  if (!user) {
    throw new ApiError(
      401,
      "Not authorized, user not found",
      "USER_NOT_FOUND",
    )
  }
  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated. Contact the placement office.",
      "ACCOUNT_DEACTIVATED",
    )
  }

  req.user = user
  next()
})

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "Access denied, insufficient role",
        "FORBIDDEN",
      )
    }
    next()
  }

// Gates recruitment operations (job + application mutations) behind admin
// approval. A pending recruiter may still log in and manage their company
// profile, but cannot create, edit, close or delete jobs, nor change
// application statuses, until the placement office approves them.
const requireApprovedRecruiter = asyncHandler(async (req, res, next) => {
  const profile = await Recruiter.findOne({ user: req.user._id })
    .select("isApproved")
    .lean()
  if (!profile) {
    throw new ApiError(
      400,
      "Create your company profile first",
      "PROFILE_REQUIRED",
    )
  }
  if (!profile.isApproved) {
    throw new ApiError(
      403,
      "Your company account is pending approval by the placement office",
      "RECRUITER_NOT_APPROVED",
    )
  }
  next()
})

module.exports = { protect, requireRole, requireApprovedRecruiter }
