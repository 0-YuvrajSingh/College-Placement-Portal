const fs = require("fs")
const path = require("path")
const { validationResult } = require("express-validator")
const Student = require("../models/Student")

const UPLOADS_DIR = path.join(__dirname, "..", "uploads")

const checkValidation = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg })
    return true
  }
  return false
}

const deleteResumeFile = (filename) => {
  if (!filename) return
  const filePath = path.join(UPLOADS_DIR, filename)
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete resume file ${filename}: ${err.message}`)
    }
  })
}

// @desc    View own student profile
// @route   GET /api/students/me/profile
// @access  Private (student)
const getProfile = async (req, res, next) => {
  try {
    const profile = await Student.findOne({ user: req.user._id })
    if (!profile) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Profile not found. Please create your profile first.",
        })
    }
    res.json({ success: true, data: { profile } })
  } catch (error) {
    next(error)
  }
}

// @desc    Create own student profile
// @route   POST /api/students/me/profile
// @access  Private (student)
const createProfile = async (req, res, next) => {
  try {
    if (checkValidation(req, res)) return

    const existing = await Student.findOne({ user: req.user._id })
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Profile already exists. Use update instead.",
        })
    }

    const profile = await Student.create({ user: req.user._id, ...req.body })

    res.status(201).json({ success: true, data: { profile } })
  } catch (error) {
    next(error)
  }
}

// @desc    Update own student profile
// @route   PUT /api/students/me/profile
// @access  Private (student)
const updateProfile = async (req, res, next) => {
  try {
    if (checkValidation(req, res)) return

    let profile = await Student.findOne({ user: req.user._id })
    if (!profile) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Profile not found. Please create your profile first.",
        })
    }

    profile = await Student.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true },
    )

    res.json({ success: true, data: { profile } })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload resume for own profile
// @route   POST /api/students/me/resume
// @access  Private (student)
const uploadResume = async (req, res, next) => {
  try {
    const profile = await Student.findOne({ user: req.user._id })
    if (!profile) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Create your profile before uploading a resume.",
        })
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" })
    }

    if (profile.resume && profile.resume.filename) {
      deleteResumeFile(profile.resume.filename)
    }

    profile.resume = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    }

    await profile.save()

    res.json({ success: true, data: { resume: profile.resume } })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete resume from own profile
// @route   DELETE /api/students/me/resume
// @access  Private (student)
const deleteResume = async (req, res, next) => {
  try {
    const profile = await Student.findOne({ user: req.user._id })
    if (!profile || !profile.resume) {
      return res
        .status(404)
        .json({ success: false, message: "No resume found" })
    }

    deleteResumeFile(profile.resume.filename)

    profile.resume = null
    await profile.save()

    res.json({
      success: true,
      data: { message: "Resume deleted successfully" },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  deleteResume,
}
