const Application = require("../models/Application")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { parsePagination, buildPagination } = require("../utils/pagination")
const applicationService = require("../services/application.service")

// @desc    Apply to a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (student)
const apply = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob({
    studentUser: req.user,
    jobId: req.params.jobId,
  })
  res.status(201).json({ success: true, data: { application } })
})

// @desc    List own applications
// @route   GET /api/student/applications
// @access  Private (student)
const getMyApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = { student: req.user._id }
  if (req.query.status) {
    filter.status = req.query.status
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("job", "title companyName location status applicationDeadline")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(filter),
  ])

  res.json({
    success: true,
    data: applications,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Get own application
// @route   GET /api/student/applications/:id
// @access  Private (student)
const getMyApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    student: req.user._id,
  })
    .populate("job", "title companyName location employmentType salary skills")
    .lean()

  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }

  res.json({ success: true, data: { application } })
})

// @desc    Withdraw own application
// @route   PATCH /api/student/applications/:id/withdraw
// @access  Private (student)
const withdraw = asyncHandler(async (req, res) => {
  const application = await applicationService.withdrawApplication({
    applicationId: req.params.id,
    studentUser: req.user,
  })
  res.json({ success: true, data: { application } })
})

module.exports = { apply, getMyApplications, getMyApplication, withdraw }
