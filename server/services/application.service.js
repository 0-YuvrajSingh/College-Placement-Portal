const Application = require("../models/Application")
const Student = require("../models/Student")
const Job = require("../models/Job")
const ApiError = require("../utils/ApiError")
const { checkEligibility } = require("./eligibility.service")
const { normalizeExpiredJobs } = require("./job.service")
const { snapshotResumeFile, deleteResumeFile } = require("./file.service")
const {
  APPLICATION_STATUS,
  APPLICATION_TRANSITIONS,
} = require("../config/constants")

const applyToJob = async ({ studentUser, jobId }) => {
  await normalizeExpiredJobs()

  const student = await Student.findOne({ user: studentUser._id })
  if (!student) {
    throw new ApiError(
      400,
      "Create your student profile before applying",
      "PROFILE_REQUIRED",
    )
  }

  const job = await Job.findById(jobId)
  if (!job) {
    throw new ApiError(404, "Job not found", "JOB_NOT_FOUND")
  }

  if (job.status === "DRAFT") {
    throw new ApiError(400, "This job is not open for applications", "JOB_NOT_OPEN")
  }
  if (job.status === "CLOSED") {
    throw new ApiError(400, "This job has been closed", "JOB_CLOSED")
  }
  if (job.status === "EXPIRED" || job.applicationDeadline < new Date()) {
    throw new ApiError(
      400,
      "Application deadline has passed",
      "APPLICATION_DEADLINE_PASSED",
    )
  }

  const { eligible, reasons } = checkEligibility(student, job)
  if (!eligible) {
    throw new ApiError(400, "You are not eligible for this job", "NOT_ELIGIBLE", reasons)
  }

  if (!student.resume || !student.resume.filename) {
    throw new ApiError(
      400,
      "Upload a resume before applying",
      "RESUME_REQUIRED",
    )
  }

  const existing = await Application.findOne({
    student: studentUser._id,
    job: job._id,
  })
  if (existing) {
    throw new ApiError(
      409,
      "You have already applied to this job",
      "ALREADY_APPLIED",
    )
  }

  // Copy the submitted resume into an immutable snapshot. The snapshot is kept
  // for the lifetime of the application (a withdrawn application is still a
  // historical record), so later resume replacements on the student profile do
  // not break downloads of the resume that was actually submitted.
  const snapshotName = await snapshotResumeFile(student.resume.filename)
  if (!snapshotName) {
    throw new ApiError(
      400,
      "Upload a resume before applying",
      "RESUME_REQUIRED",
    )
  }

  let application
  try {
    application = await Application.create({
      student: studentUser._id,
      job: job._id,
      recruiter: job.recruiter,
      resumeSnapshot: {
        originalName: student.resume.originalname,
        storedName: snapshotName,
        mimeType: student.resume.mimetype,
        size: student.resume.size,
      },
      status: APPLICATION_STATUS.APPLIED,
      statusHistory: [
        {
          status: APPLICATION_STATUS.APPLIED,
          changedBy: studentUser._id,
          remarks: "Application submitted",
        },
      ],
    })
  } catch (err) {
    await deleteResumeFile(snapshotName)
    if (err && err.code === 11000) {
      // Two concurrent requests both passed the findOne() above; the compound
      // unique index on { student, job } caught the race.
      throw new ApiError(
        409,
        "You have already applied to this job",
        "ALREADY_APPLIED",
      )
    }
    throw err
  }

  return application
}

const updateApplicationStatus = async ({
  applicationId,
  recruiterUser,
  newStatus,
  remarks,
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    recruiter: recruiterUser._id,
  })
  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }

  const allowed = APPLICATION_TRANSITIONS[application.status] || []
  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change status from ${application.status} to ${newStatus}`,
      "INVALID_STATUS_TRANSITION",
    )
  }

  application.status = newStatus
  if (remarks !== undefined) {
    application.remarks = remarks
  }
  application.statusHistory.push({
    status: newStatus,
    changedBy: recruiterUser._id,
    remarks: remarks || `Status changed to ${newStatus}`,
  })

  await application.save()
  return application
}

const withdrawApplication = async ({ applicationId, studentUser }) => {
  const application = await Application.findOne({
    _id: applicationId,
    student: studentUser._id,
  })
  if (!application) {
    throw new ApiError(404, "Application not found", "APPLICATION_NOT_FOUND")
  }

  const allowed = APPLICATION_TRANSITIONS[application.status] || []
  if (!allowed.includes(APPLICATION_STATUS.WITHDRAWN)) {
    throw new ApiError(
      400,
      "This application can no longer be withdrawn",
      "CANNOT_WITHDRAW",
    )
  }

  application.status = APPLICATION_STATUS.WITHDRAWN
  application.withdrawnAt = new Date()
  application.statusHistory.push({
    status: APPLICATION_STATUS.WITHDRAWN,
    changedBy: studentUser._id,
    remarks: "Application withdrawn by student",
  })

  await application.save()
  return application
}

module.exports = {
  applyToJob,
  updateApplicationStatus,
  withdrawApplication,
}
