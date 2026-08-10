const Recruiter = require("../models/Recruiter")
const User = require("../models/User")
const Job = require("../models/Job")
const Application = require("../models/Application")
const Student = require("../models/Student")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { parsePagination, buildPagination } = require("../utils/pagination")
const {
  ROLES,
  JOB_STATUS,
  APPLICATION_STATUS,
  JOB_TRANSITIONS,
} = require("../config/constants")
const applicationService = require("../services/application.service")
const { sendResumeFile } = require("../services/file.service")

const getProfile = asyncHandler(async (req, res) => {
  const profile = await Recruiter.findOne({ user: req.user._id })
  if (!profile) {
    throw new ApiError(
      404,
      "Company profile not found. Please create it first.",
      "PROFILE_NOT_FOUND",
    )
  }
  res.json({ success: true, data: { profile } })
})

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Recruiter.findOneAndUpdate(
    { user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true, upsert: true },
  )
  res.json({ success: true, data: { profile } })
})

const validateDeadline = (deadline) => {
  if (deadline && new Date(deadline) < new Date()) {
    throw new ApiError(
      400,
      "Application deadline must be in the future",
      "INVALID_DEADLINE",
    )
  }
}

const applyJobStatusChange = (job, newStatus) => {
  const allowed = JOB_TRANSITIONS[job.status] || []
  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change job status from ${job.status} to ${newStatus}`,
      "INVALID_STATUS_TRANSITION",
    )
  }
  job.status = newStatus
}

const attachStudentProfiles = async (applications) => {
  const studentIds = applications.map((a) => a.student._id)
  const profiles = studentIds.length
    ? await Student.find({ user: { $in: studentIds } })
        .select("user department cgpa graduationYear skills resume phone education")
        .lean()
    : []
  const profileMap = new Map(profiles.map((p) => [String(p.user), p]))
  return applications.map((a) => ({
    ...a,
    studentProfile: profileMap.get(String(a.student._id)) || null,
  }))
}

// @desc    Create a job
// @route   POST /api/recruiter/jobs
const createJob = asyncHandler(async (req, res) => {
  validateDeadline(req.body.applicationDeadline)
  const job = await Job.create({
    recruiter: req.user._id,
    status: req.body.status || JOB_STATUS.DRAFT,
    ...req.body,
  })
  res.status(201).json({ success: true, data: { job } })
})

// @desc    List own jobs
// @route   GET /api/recruiter/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = { recruiter: req.user._id }
  if (req.query.status) {
    filter.status = req.query.status
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter),
  ])

  const jobIds = jobs.map((j) => j._id)
  const counts = jobIds.length
    ? await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: { _id: "$job", count: { $sum: 1 } } },
      ])
    : []
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]))

  const data = jobs.map((j) => ({
    ...j,
    applicantCount: countMap.get(String(j._id)) || 0,
  }))

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Get own job
// @route   GET /api/recruiter/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }
  res.json({ success: true, data: { job } })
})

// @desc    Update own job
// @route   PUT /api/recruiter/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }

  if (req.body.applicationDeadline) {
    validateDeadline(req.body.applicationDeadline)
  }

  if (req.body.status) {
    applyJobStatusChange(job, req.body.status)
  }

  Object.keys(req.body).forEach((key) => {
    if (key !== "status") {
      job[key] = req.body[key]
    }
  })

  await job.save()
  res.json({ success: true, data: { job } })
})

// @desc    Change job status
// @route   PATCH /api/recruiter/jobs/:id/status
const changeJobStatus = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }

  applyJobStatusChange(job, req.body.status)
  await job.save()
  res.json({ success: true, data: { job } })
})

// @desc    Delete own job (only if no applications exist)
// @route   DELETE /api/recruiter/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }

  const applicationCount = await Application.countDocuments({ job: job._id })
  if (applicationCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete a job that has applications. Close the job instead.",
      "JOB_HAS_APPLICATIONS",
    )
  }

  await job.deleteOne()
  res.json({
    success: true,
    data: { message: "Job deleted successfully" },
  })
})

// @desc    List applicants for own job
// @route   GET /api/recruiter/jobs/:jobId/applications
const getJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params
  const job = await Job.findOne({
    _id: jobId,
    recruiter: req.user._id,
  })
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }

  const { page, limit, skip } = parsePagination(req.query)
  const filter = { job: jobId }
  if (req.query.status) {
    filter.status = req.query.status
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("student", "name email")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(filter),
  ])

  const data = await attachStudentProfiles(applications)

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    List applicants across all own job postings
// @route   GET /api/recruiter/applications
const listApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = { recruiter: req.user._id }

  if (req.query.status) {
    filter.status = req.query.status
  }
  if (req.query.jobId) {
    filter.job = req.query.jobId
  }
  if (req.query.search && req.query.search.trim()) {
    const searchRegex = new RegExp(req.query.search.trim(), "i")
    const [studentUsers, jobs] = await Promise.all([
      User.find({
        role: ROLES.STUDENT,
        $or: [{ name: searchRegex }, { email: searchRegex }],
      })
        .select("_id")
        .lean(),
      Job.find({
        recruiter: req.user._id,
        $or: [{ title: searchRegex }, { companyName: searchRegex }],
      })
        .select("_id")
        .lean(),
    ])
    const or = []
    if (studentUsers.length) or.push({ student: { $in: studentUsers.map((u) => u._id) } })
    if (jobs.length) or.push({ job: { $in: jobs.map((j) => j._id) } })
    if (!or.length) {
      return res.json({
        success: true,
        data: [],
        pagination: buildPagination(page, limit, 0),
      })
    }
    filter.$or = or
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("student", "name email")
      .populate("job", "title companyName location status applicationDeadline")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(filter),
  ])

  const data = await attachStudentProfiles(applications)

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Recruiter dashboard statistics
// @route   GET /api/recruiter/stats
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const [jobs, statusCounts] = await Promise.all([
    Job.find({ recruiter: userId })
      .select("_id status applicationDeadline")
      .lean(),
    Application.aggregate([
      { $match: { recruiter: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ])

  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const openJobs = jobs.filter((j) => j.status === JOB_STATUS.OPEN)
  const closingSoon = openJobs.filter(
    (j) =>
      j.applicationDeadline &&
      j.applicationDeadline.getTime() - now <= sevenDays &&
      j.applicationDeadline.getTime() >= now,
  ).length

  const countMap = {}
  statusCounts.forEach((s) => {
    countMap[s._id] = s.count
  })

  res.json({
    success: true,
    data: {
      totalJobs: jobs.length,
      activeJobs: openJobs.length,
      closingSoon,
      totalApplicants: statusCounts.reduce((sum, s) => sum + s.count, 0),
      applied: countMap[APPLICATION_STATUS.APPLIED] || 0,
      shortlisted: countMap[APPLICATION_STATUS.SHORTLISTED] || 0,
      rejected: countMap[APPLICATION_STATUS.REJECTED] || 0,
      selected: countMap[APPLICATION_STATUS.SELECTED] || 0,
      withdrawn: countMap[APPLICATION_STATUS.WITHDRAWN] || 0,
    },
  })
})

// @desc    Get a single application for own job
// @route   GET /api/recruiter/applications/:id
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
    .populate("student", "name email")
    .populate("job", "title companyName location")
    .lean()

  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }

  const studentProfile = await Student.findOne({
    user: application.student._id,
  })
    .select("department cgpa graduationYear skills phone resume education")
    .lean()

  res.json({
    success: true,
    data: { ...application, studentProfile },
  })
})

// @desc    Update application status (state machine enforced)
// @route   PATCH /api/recruiter/applications/:id/status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus({
    applicationId: req.params.id,
    recruiterUser: req.user,
    newStatus: req.body.status,
    remarks: req.body.remarks,
  })
  res.json({ success: true, data: { application } })
})

// @desc    Download applicant resume
// @route   GET /api/recruiter/applications/:id/resume
const getApplicationResume = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    recruiter: req.user._id,
  })
  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }

  const snapshot = application.resumeSnapshot
  if (!snapshot || !snapshot.storedName) {
    throw new ApiError(404, "Resume not found", "RESUME_NOT_FOUND")
  }

  sendResumeFile(res, snapshot.storedName, snapshot.originalName)
})

module.exports = {
  getProfile,
  updateProfile,
  createJob,
  getJobs,
  getJob,
  updateJob,
  changeJobStatus,
  deleteJob,
  getJobApplications,
  listApplications,
  getStats,
  getApplication,
  updateApplicationStatus,
  getApplicationResume,
}
