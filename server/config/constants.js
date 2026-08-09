const ROLES = Object.freeze({
  STUDENT: "student",
  RECRUITER: "recruiter",
  ADMIN: "admin",
})

const DEPARTMENTS = Object.freeze([
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil",
  "Automobile",
  "Chemical",
  "Other",
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "ME",
  "CE",
  "AE",
  "AIDS",
  "CSD",
])

const JOB_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  EXPIRED: "EXPIRED",
})

const EMPLOYMENT_TYPES = Object.freeze(["Full-time", "Part-time", "Internship"])
const WORK_MODES = Object.freeze(["On-site", "Remote", "Hybrid"])

const APPLICATION_STATUS = Object.freeze({
  APPLIED: "APPLIED",
  SHORTLISTED: "SHORTLISTED",
  REJECTED: "REJECTED",
  SELECTED: "SELECTED",
  WITHDRAWN: "WITHDRAWN",
})

const APPLICATION_TRANSITIONS = Object.freeze({
  APPLIED: ["SHORTLISTED", "REJECTED", "WITHDRAWN"],
  SHORTLISTED: ["SELECTED", "REJECTED"],
  REJECTED: [],
  SELECTED: [],
  WITHDRAWN: [],
})

const JOB_TRANSITIONS = Object.freeze({
  DRAFT: ["OPEN", "CLOSED"],
  OPEN: ["CLOSED"],
  CLOSED: [],
  EXPIRED: [],
})

module.exports = {
  ROLES,
  DEPARTMENTS,
  JOB_STATUS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  APPLICATION_STATUS,
  APPLICATION_TRANSITIONS,
  JOB_TRANSITIONS,
}
