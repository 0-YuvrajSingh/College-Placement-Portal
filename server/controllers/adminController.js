const User = require("../models/User")
const Student = require("../models/Student")
const Recruiter = require("../models/Recruiter")
const Job = require("../models/Job")
const Application = require("../models/Application")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { parsePagination, buildPagination } = require("../utils/pagination")
const { ROLES, JOB_STATUS } = require("../config/constants")
const adminService = require("../services/admin.service")
const { sendResumeFile } = require("../services/file.service")

const USER_SELECT = "name email role isActive lastLoginAt createdAt updatedAt"

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
const dashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats()
  res.json({ success: true, data: stats })
})

// @desc    List students
// @route   GET /api/admin/students
const listStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = { role: ROLES.STUDENT }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), "i")
    filter.$or = [{ name: searchRegex }, { email: searchRegex }]
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true"
  }
  if (req.query.isPlaced !== undefined) {
    const placed = req.query.isPlaced === "true"
    const placedUserIds = (
      await Student.find({ isPlaced: placed }).select("user").lean()
    ).map((p) => p.user)
    if (!placedUserIds.length) {
      return res.json({
        success: true,
        data: [],
        pagination: buildPagination(page, limit, 0),
      })
    }
    filter._id = { $in: placedUserIds }
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(USER_SELECT)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ])

  const userIds = users.map((u) => u._id)
  const profiles = userIds.length
    ? await Student.find({ user: { $in: userIds } })
        .select("user department cgpa graduationYear skills profileCompleted isPlaced")
        .lean()
    : []
  const profileMap = new Map(profiles.map((p) => [String(p.user), p]))

  const data = users.map((u) => ({
    ...u,
    studentProfile: profileMap.get(String(u._id)) || null,
  }))

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Get a single student
// @route   GET /api/admin/students/:id
const getStudent = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: ROLES.STUDENT })
    .select(USER_SELECT)
    .lean()
  if (!user) {
    throw new ApiError(404, "Student not found", "USER_NOT_FOUND")
  }
  const profile = await Student.findOne({ user: user._id }).lean()
  res.json({ success: true, data: { ...user, profile } })
})

// @desc    Activate/deactivate a student
// @route   PATCH /api/admin/students/:id/status
const updateStudentStatus = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: ROLES.STUDENT },
    { isActive: req.body.isActive },
    { new: true, runValidators: true },
  ).select(USER_SELECT)
  if (!user) {
    throw new ApiError(404, "Student not found", "USER_NOT_FOUND")
  }

  if (req.body.isPlaced !== undefined) {
    await Student.updateOne(
      { user: req.params.id },
      { isPlaced: req.body.isPlaced },
    )
  }

  res.json({ success: true, data: { user } })
})

// @desc    List recruiters
// @route   GET /api/admin/recruiters
const listRecruiters = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = { role: ROLES.RECRUITER }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), "i")
    filter.$or = [{ name: searchRegex }, { email: searchRegex }]
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true"
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(USER_SELECT)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ])

  const userIds = users.map((u) => u._id)
  const profiles = userIds.length
    ? await Recruiter.find({ user: { $in: userIds } })
        .select("user companyName industry location isApproved")
        .lean()
    : []
  const profileMap = new Map(profiles.map((p) => [String(p.user), p]))

  const jobCounts = userIds.length
    ? await Job.aggregate([
        { $match: { recruiter: { $in: userIds } } },
        { $group: { _id: "$recruiter", count: { $sum: 1 } } },
      ])
    : []
  const jobCountMap = new Map(jobCounts.map((c) => [String(c._id), c.count]))

  const data = users.map((u) => ({
    ...u,
    recruiterProfile: profileMap.get(String(u._id)) || null,
    jobCount: jobCountMap.get(String(u._id)) || 0,
  }))

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Get a single recruiter
// @route   GET /api/admin/recruiters/:id
const getRecruiter = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    role: ROLES.RECRUITER,
  })
    .select(USER_SELECT)
    .lean()
  if (!user) {
    throw new ApiError(404, "Recruiter not found", "USER_NOT_FOUND")
  }
  const profile = await Recruiter.findOne({ user: user._id }).lean()
  res.json({ success: true, data: { ...user, profile } })
})

// @desc    Activate/deactivate a recruiter
// @route   PATCH /api/admin/recruiters/:id/status
const updateRecruiterStatus = asyncHandler(async (req, res) => {
  const updates = {}
  if (req.body.isActive !== undefined) {
    updates.isActive = req.body.isActive
  }
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: ROLES.RECRUITER },
    updates,
    { new: true, runValidators: true },
  ).select(USER_SELECT)
  if (!user) {
    throw new ApiError(404, "Recruiter not found", "USER_NOT_FOUND")
  }

  if (req.body.isApproved !== undefined) {
    await Recruiter.updateOne(
      { user: req.params.id },
      { isApproved: req.body.isApproved },
    )
  }

  res.json({ success: true, data: { user } })
})

// @desc    List all jobs
// @route   GET /api/admin/jobs
const listJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = {}

  if (req.query.status) {
    filter.status = req.query.status
  }
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), "i")
    filter.$or = [{ title: searchRegex }, { companyName: searchRegex }]
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
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
  const data = jobs.map((job) => ({
    ...job,
    applicantCount: countMap.get(String(job._id)) || 0,
  }))

  res.json({
    success: true,
    data,
    pagination: buildPagination(page, limit, total),
  })
})

// @desc    Get a single job
// @route   GET /api/admin/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("recruiter", "name email")
    .lean()
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }
  res.json({ success: true, data: { job } })
})

// @desc    Change job status
// @route   PATCH /api/admin/jobs/:id/status
const updateJobStatus = asyncHandler(async (req, res) => {
  const validStatuses = Object.values(JOB_STATUS)
  if (!validStatuses.includes(req.body.status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${validStatuses.join(", ")}`,
      "INVALID_STATUS",
    )
  }
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  )
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }
  res.json({ success: true, data: { job } })
})

// @desc    List all applications
// @route   GET /api/admin/applications
const listApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filter = {}
  if (req.query.status) {
    filter.status = req.query.status
  }
  if (req.query.jobId) {
    filter.job = req.query.jobId
  }
  if (req.query.search && req.query.search.trim()) {
    const searchRegex = new RegExp(req.query.search.trim(), "i")
    const [studentIds, jobIds] = await Promise.all([
      User.find({ role: ROLES.STUDENT, $or: [{ name: searchRegex }, { email: searchRegex }] }).select("_id").lean(),
      Job.find({ $or: [{ title: searchRegex }, { companyName: searchRegex }] }).select("_id").lean(),
    ])
    filter.$or = [
      { student: { $in: studentIds.map((s) => s._id) } },
      { job: { $in: jobIds.map((j) => j._id) } },
    ]
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("student", "name email")
      .populate("job", "title companyName")
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

// @desc    Get a single application
// @route   GET /api/admin/applications/:id
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("student", "name email")
    .populate("job", "title companyName location status")
    .lean()
  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }
  const profile = await Student.findOne({ user: application.student._id }).lean()
  res.json({ success: true, data: { ...application, studentProfile: profile } })
})

// @desc    Download applicant resume
// @route   GET /api/admin/applications/:id/resume
const getApplicationResume = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }
  const student = await Student.findOne({ user: application.student })
  if (!student || !student.resume) {
    throw new ApiError(404, "Resume not found", "RESUME_NOT_FOUND")
  }
  sendResumeFile(res, student.resume.filename, student.resume.originalname)
})

module.exports = {
  dashboard,
  listStudents,
  getStudent,
  updateStudentStatus,
  listRecruiters,
  getRecruiter,
  updateRecruiterStatus,
  listJobs,
  getJob,
  updateJobStatus,
  listApplications,
  getApplication,
  getApplicationResume,
}
