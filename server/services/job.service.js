const Job = require("../models/Job")
const Application = require("../models/Application")
const ApiError = require("../utils/ApiError")
const { parsePagination, buildPagination } = require("../utils/pagination")
const { JOB_STATUS } = require("../config/constants")
const { checkEligibility } = require("./eligibility.service")

const SORT_FIELDS = Object.freeze([
  "createdAt",
  "applicationDeadline",
  "title",
  "salary",
])

const normalizeExpiredJobs = async () => {
  await Job.updateMany(
    {
      status: JOB_STATUS.OPEN,
      applicationDeadline: { $lt: new Date() },
    },
    { $set: { status: JOB_STATUS.EXPIRED } },
  )
}

const buildEligibilityFilter = (student) => {
  const conditions = []
  if (student && student.cgpa != null) {
    conditions.push({ "eligibility.minimumCgpa": { $lte: student.cgpa } })
  }
  if (student && student.department) {
    conditions.push({
      $or: [
        { "eligibility.eligibleDepartments": { $size: 0 } },
        {
          "eligibility.eligibleDepartments": {
            $in: [new RegExp(`^${escapeRegExp(student.department)}$`, "i")],
          },
        },
      ],
    })
  }
  if (student && student.graduationYear) {
    conditions.push({
      $or: [
        { "eligibility.eligibleGraduationYears": { $size: 0 } },
        { "eligibility.eligibleGraduationYears": student.graduationYear },
      ],
    })
  }
  if (student && student.hasActiveBacklogs) {
    conditions.push({ "eligibility.backlogAllowed": true })
  }
  if (student && Array.isArray(student.skills) && student.skills.length > 0) {
    const skills = student.skills.map((s) => new RegExp(`^${escapeRegExp(s)}$`, "i"))
    conditions.push({
      "eligibility.requiredSkills": {
        $not: { $elemMatch: { $nin: skills } },
      },
    })
  }
  return conditions
}

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const listJobs = async (query, student) => {
  await normalizeExpiredJobs()

  const { page, limit, skip } = parsePagination(query)
  const filter = { status: JOB_STATUS.OPEN }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(escapeRegExp(query.search.trim()), "i")
    filter.$or = [
      { title: searchRegex },
      { companyName: searchRegex },
      { location: searchRegex },
    ]
  }

  if (query.location) {
    filter.location = new RegExp(escapeRegExp(query.location), "i")
  }

  if (query.employmentType) {
    filter.employmentType = query.employmentType
  }

  if (query.workMode) {
    filter.workMode = query.workMode
  }

  if (query.department) {
    filter.$and = [
      {
        $or: [
          { "eligibility.eligibleDepartments": { $size: 0 } },
          {
            "eligibility.eligibleDepartments": {
              $in: [new RegExp(`^${escapeRegExp(query.department)}$`, "i")],
            },
          },
        ],
      },
    ]
  }

  if (query.minCgpa) {
    filter["eligibility.minimumCgpa"] = { $lte: parseFloat(query.minCgpa) }
  }

  if (query.eligible === "true" && student) {
    const eligibilityConditions = buildEligibilityFilter(student)
    filter.$and = [...(filter.$and || []), ...eligibilityConditions]
  }

  const sortBy = SORT_FIELDS.includes(query.sortBy) ? query.sortBy : "createdAt"
  const sortOrder = query.order === "asc" ? 1 : -1
  const sort = sortBy === "salary" ? { "salary.min": sortOrder } : { [sortBy]: sortOrder }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-description")
      .lean(),
    Job.countDocuments(filter),
  ])

  const data = await enrichJobsForStudent(jobs, student)

  return { data, pagination: buildPagination(page, limit, total) }
}

const enrichJobsForStudent = async (jobs, student) => {
  if (!jobs.length) return jobs

  const jobIds = jobs.map((j) => j._id)

  const [counts, applications] = await Promise.all([
    Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
    ]),
    student
      ? Application.find({
          student: student.user || student._id,
          job: { $in: jobIds },
        })
          .select("job")
          .lean()
      : Promise.resolve([]),
  ])

  const countMap = new Map(counts.map((c) => [String(c._id), c.count]))
  const appliedSet = new Set(applications.map((a) => String(a.job)))

  return jobs.map((job) => {
    const eligible = student ? checkEligibility(student, job).eligible : null
    return {
      ...job,
      applicantCount: countMap.get(String(job._id)) || 0,
      isEligible: student ? eligible : null,
      applied: student ? appliedSet.has(String(job._id)) : false,
    }
  })
}

const getJobForStudent = async (jobId) => {
  await normalizeExpiredJobs()
  const job = await Job.findById(jobId).lean()
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }
  if (job.status !== JOB_STATUS.OPEN) {
    throw new ApiError(400, "This job is not currently open", "JOB_NOT_OPEN")
  }
  return job
}

module.exports = { listJobs, getJobForStudent, normalizeExpiredJobs }
