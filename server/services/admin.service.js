const User = require("../models/User")
const Student = require("../models/Student")
const Job = require("../models/Job")
const Application = require("../models/Application")
const { ROLES, JOB_STATUS, APPLICATION_STATUS } = require("../config/constants")

const getDashboardStats = async () => {
  const userGroups = await User.aggregate([
    {
      $group: {
        _id: "$role",
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
  ])
  const roleStats = {}
  userGroups.forEach((group) => {
    roleStats[group._id] = group
  })

  const [jobStats] = await Job.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: {
          $sum: { $cond: [{ $eq: ["$status", JOB_STATUS.OPEN] }, 1, 0] },
        },
      },
    },
  ])

  const [appStats] = await Application.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        shortlisted: {
          $sum: {
            $cond: [{ $eq: ["$status", APPLICATION_STATUS.SHORTLISTED] }, 1, 0],
          },
        },
        selected: {
          $sum: {
            $cond: [{ $eq: ["$status", APPLICATION_STATUS.SELECTED] }, 1, 0],
          },
        },
      },
    },
  ])

  const students = roleStats[ROLES.STUDENT] || { total: 0, active: 0 }
  const recruiters = roleStats[ROLES.RECRUITER] || { total: 0, active: 0 }

  const [placedStats] = await Student.aggregate([
    {
      $group: {
        _id: null,
        placed: {
          $sum: { $cond: [{ $eq: ["$isPlaced", true] }, 1, 0] },
        },
      },
    },
  ])

  return {
    totalStudents: students.total,
    activeStudents: students.active,
    totalRecruiters: recruiters.total,
    activeRecruiters: recruiters.active,
    totalJobs: (jobStats && jobStats.total) || 0,
    openJobs: (jobStats && jobStats.open) || 0,
    totalApplications: (appStats && appStats.total) || 0,
    shortlistedApplications: (appStats && appStats.shortlisted) || 0,
    selectedApplications: (appStats && appStats.selected) || 0,
    placedStudents: (placedStats && placedStats.placed) || 0,
  }
}

const getPublicStats = async () => {
  const dashboard = await getDashboardStats()
  const [highestPackage] = await Job.aggregate([
    { $group: { _id: null, max: { $max: "$salary.max" } } },
  ])
  const placementRate =
    dashboard.totalStudents > 0
      ? Math.round((dashboard.placedStudents / dashboard.totalStudents) * 100)
      : 0
  return {
    ...dashboard,
    placementRate,
    highestPackage: (highestPackage && highestPackage.max) || null,
  }
}

module.exports = { getDashboardStats, getPublicStats }
