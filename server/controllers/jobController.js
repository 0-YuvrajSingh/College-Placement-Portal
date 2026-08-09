const Student = require("../models/Student")
const asyncHandler = require("../utils/asyncHandler")
const jobService = require("../services/job.service")
const { checkEligibility } = require("../services/eligibility.service")
const { ROLES } = require("../config/constants")

// @desc    List open jobs (paginated, searchable, filterable)
// @route   GET /api/jobs
// @access  Private
const listJobs = asyncHandler(async (req, res) => {
  const student =
    req.user.role === ROLES.STUDENT
      ? await Student.findOne({ user: req.user._id }).lean()
      : null

  const result = await jobService.listJobs(req.query, student)
  res.json({ success: true, data: result.data, pagination: result.pagination })
})

// @desc    Get job details
// @route   GET /api/jobs/:id
// @access  Private
const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobForStudent(req.params.id)

  let isEligible = null
  let eligibilityReasons = null
  if (req.user.role === ROLES.STUDENT) {
    const student = await Student.findOne({ user: req.user._id }).lean()
    if (student) {
      const result = checkEligibility(student, job)
      isEligible = result.eligible
      eligibilityReasons = result.reasons
    }
  }

  res.json({
    success: true,
    data: { job, isEligible, eligibilityReasons },
  })
})

module.exports = { listJobs, getJob }
