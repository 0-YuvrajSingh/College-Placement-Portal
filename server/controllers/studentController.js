const Student = require("../models/Student")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { deleteResumeFile, sendResumeFile } = require("../services/file.service")

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

const computeProfileCompletion = (data) =>
  PROFILE_CORE_FIELDS.every(
    (field) => data[field] !== undefined && data[field] !== null && data[field] !== "",
  )

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

  const payload = {
    user: req.user._id,
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    ...req.body,
  }
  payload.profileCompleted = computeProfileCompletion(payload)

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

  const merged = { ...existing.toObject(), ...req.body }
  merged.profileCompleted = computeProfileCompletion(merged)

  const profile = await Student.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, profileCompleted: merged.profileCompleted },
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

  if (profile.resume && profile.resume.filename) {
    deleteResumeFile(profile.resume.filename)
  }

  profile.resume = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: "/api/students/me/resume",
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date(),
  }

  await profile.save()

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

  deleteResumeFile(profile.resume.filename)
  profile.resume = null
  await profile.save()

  res.json({
    success: true,
    data: { message: "Resume deleted successfully" },
  })
})

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  downloadResume,
  deleteResume,
}
