const Student = require("../models/Student")
const User = require("../models/User")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const {
  deleteResumeFile,
  sendResumeFile,
  validateResumeSignature,
} = require("../services/file.service")

const PROFILE_CORE_FIELDS = [
  "name",
  "email",
  "phone",
  "department",
  "year",
  "semester",
  "cgpa",
  "graduationYear",
]

// Only these fields may be set by the student through the profile API.
// Sensitive fields (isPlaced, resume, user, profileCompleted) are excluded
// to prevent mass-assignment attacks.
const STUDENT_WRITABLE_FIELDS = [
  "name",
  "email",
  "phone",
  "department",
  "year",
  "semester",
  "cgpa",
  "graduationYear",
  "hasActiveBacklogs",
  "skills",
  "rollNumber",
  "registrationNumber",
  "college",
  "course",
  "education",
]

const pickFields = (source, allowed) => {
  const result = {}
  for (const key of allowed) {
    if (source[key] !== undefined) result[key] = source[key]
  }
  return result
}

const computeProfileCompletion = (data) =>
  PROFILE_CORE_FIELDS.every(
    (field) => data[field] !== undefined && data[field] !== null && data[field] !== "",
  )

// The User document owns the login identity (name + email). A student's career
// profile mirrors it, so edits made on the profile page also update the account
// name/email used in navigation and auth. Email uniqueness is enforced by the
// User unique index (E11000); a duplicate is surfaced as a 409 here.
const syncIdentity = async (userId, updates) => {
  const changes = {}
  if (updates.name !== undefined && updates.name !== "") changes.name = updates.name
  if (updates.email !== undefined && updates.email !== "") changes.email = updates.email
  if (Object.keys(changes).length === 0) return
  try {
    await User.findByIdAndUpdate(userId, { $set: changes }, { runValidators: true })
  } catch (err) {
    if (err && err.code === 11000) {
      throw new ApiError(409, "This email is already in use", "EMAIL_TAKEN")
    }
    throw err
  }
}

// @desc    View own student profile
// @route   GET /api/students/me/profile
// @access  Private (student)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Student.findOne({ user: req.user._id })
  if (!profile) {
    throw new ApiError(
      404,
      "Profile not found. Please create your profile first.",
      "PROFILE_NOT_FOUND",
    )
  }
  res.json({ success: true, data: { profile } })
})

// @desc    Create own student profile
// @route   POST /api/students/me/profile
// @access  Private (student)
const createProfile = asyncHandler(async (req, res) => {
  const existing = await Student.findOne({ user: req.user._id })
  if (existing) {
    throw new ApiError(
      409,
      "Profile already exists. Use update instead.",
      "PROFILE_EXISTS",
    )
  }

  const safeBody = pickFields(req.body, STUDENT_WRITABLE_FIELDS)
  const payload = {
    user: req.user._id,
    name: safeBody.name || req.user.name,
    email: safeBody.email || req.user.email,
    ...safeBody,
  }
  payload.profileCompleted = computeProfileCompletion(payload)

  await syncIdentity(req.user._id, { name: payload.name, email: payload.email })

  const profile = await Student.create(payload)
  res.status(201).json({ success: true, data: { profile } })
})

// @desc    Update own student profile
// @route   PUT /api/students/me/profile
// @access  Private (student)
const updateProfile = asyncHandler(async (req, res) => {
  const existing = await Student.findOne({ user: req.user._id })
  if (!existing) {
    throw new ApiError(
      404,
      "Profile not found. Please create your profile first.",
      "PROFILE_NOT_FOUND",
    )
  }

  const safeBody = pickFields(req.body, STUDENT_WRITABLE_FIELDS)
  const merged = { ...existing.toObject(), ...safeBody }
  merged.profileCompleted = computeProfileCompletion(merged)

  // Mirror identity changes (name/email) back onto the User account so the
  // auth identity stays consistent with the career profile.
  await syncIdentity(req.user._id, { name: safeBody.name, email: safeBody.email })

  const profile = await Student.findOneAndUpdate(
    { user: req.user._id },
    { ...safeBody, profileCompleted: merged.profileCompleted },
    { new: true, runValidators: true },
  )

  res.json({ success: true, data: { profile } })
})

// @desc    Upload resume for own profile
// @route   POST /api/students/me/resume
// @access  Private (student)
const uploadResume = asyncHandler(async (req, res) => {
  const profile = await Student.findOne({ user: req.user._id })
  if (!profile) {
    throw new ApiError(
      404,
      "Create your profile before uploading a resume.",
      "PROFILE_NOT_FOUND",
    )
  }

  if (!req.file) {
    throw new ApiError(400, "No file uploaded", "NO_FILE_UPLOADED")
  }

  // Reject spoofed files: the uploaded bytes must match a real PDF or Word
  // document, not just carry the right extension/MIME type.
  const valid = await validateResumeSignature(req.file.path, req.file.mimetype)
  if (!valid) {
    await deleteResumeFile(req.file.filename)
    throw new ApiError(
      400,
      "Invalid resume file: only PDF and Word (.doc/.docx) documents are allowed",
      "INVALID_RESUME_FILE",
    )
  }

  const previousFilename = profile.resume && profile.resume.filename

  profile.resume = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: "/api/students/me/resume",
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date(),
  }

  await profile.save()

  // Only after the profile is persisted is the previous file removed, so a
  // failed save never leaves the student without a resume.
  if (previousFilename) {
    await deleteResumeFile(previousFilename)
  }

  res.json({ success: true, data: { resume: profile.resume } })
})

// @desc    Download own resume
// @route   GET /api/students/me/resume
// @access  Private (student)
const downloadResume = asyncHandler(async (req, res) => {
  const profile = await Student.findOne({ user: req.user._id })
  if (!profile || !profile.resume) {
    throw new ApiError(404, "No resume found", "RESUME_NOT_FOUND")
  }
  sendResumeFile(res, profile.resume.filename, profile.resume.originalname)
})

// @desc    Delete resume from own profile
// @route   DELETE /api/students/me/resume
// @access  Private (student)
const deleteResume = asyncHandler(async (req, res) => {
  const profile = await Student.findOne({ user: req.user._id })
  if (!profile || !profile.resume) {
    throw new ApiError(404, "No resume found", "RESUME_NOT_FOUND")
  }

  await deleteResumeFile(profile.resume.filename)
  profile.resume = null
  await profile.save()

  res.json({
    success: true,
    data: { message: "Resume deleted successfully" },
  })})

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  downloadResume,
  deleteResume,
}
