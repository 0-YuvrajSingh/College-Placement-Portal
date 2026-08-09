const request = require("supertest")
const app = require("../app")
const User = require("../models/User")
const Student = require("../models/Student")
const Recruiter = require("../models/Recruiter")
const Job = require("../models/Job")
const { ROLES } = require("../config/constants")

const createUser = async ({ name, email, password = "secret123", role, isActive = true }) =>
  User.create({ name, email, password, role, isActive })

const createStudent = async (overrides = {}) => {
  const email = overrides.email || `student${Date.now()}@test.edu`
  const name = overrides.name || "Test Student"
  const user = await createUser({ name, email, role: ROLES.STUDENT })
  const profile = await Student.create({
    user: user._id,
    name,
    email,
    phone: overrides.phone || "9876543210",
    department: overrides.department || "Computer Science",
    year: overrides.year ?? 4,
    semester: overrides.semester ?? 8,
    cgpa: overrides.cgpa ?? 8.5,
    graduationYear: overrides.graduationYear ?? 2026,
    skills: overrides.skills || ["JavaScript", "Node.js"],
    hasActiveBacklogs: overrides.hasActiveBacklogs ?? false,
  })
  return { user, profile }
}

const createRecruiter = async (overrides = {}) => {
  const email = overrides.email || `recruiter${Date.now()}@test.com`
  const name = overrides.name || "Test Recruiter"
  const user = await createUser({ name, email, role: ROLES.RECRUITER })
  const profile = await Recruiter.create({
    user: user._id,
    companyName: overrides.companyName || "Test Corp",
    companyDescription: "We build things",
    website: "https://testcorp.example.com",
    industry: "Software",
    location: overrides.location || "Bengaluru",
    contactPerson: "HR",
    contactPhone: "9876543210",
    companySize: "11-50",
    isApproved: overrides.isApproved ?? true,
  })
  return { user, profile }
}

const createAdmin = async () => {
  const email = `admin${Date.now()}@test.edu`
  return createUser({ name: "Test Admin", email, role: ROLES.ADMIN })
}

const createJob = async (recruiterUserId, overrides = {}) => {
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const job = {
    recruiter: recruiterUserId,
    title: overrides.title || "Software Engineer",
    description: "Build cool things",
    companyName: overrides.companyName || "Test Corp",
    location: overrides.location || "Bengaluru",
    employmentType: "Full-time",
    workMode: "On-site",
    salary: { min: 6, max: 12, currency: "LPA" },
    skills: ["JavaScript", "Node.js"],
    eligibility: {
      minimumCgpa: 7,
      eligibleDepartments: ["Computer Science"],
      eligibleGraduationYears: [2026],
      requiredSkills: ["JavaScript"],
      backlogAllowed: false,
    },
    applicationDeadline: future,
    status: "OPEN",
    ...overrides,
  }
  if (overrides.eligibility) {
    job.eligibility = { ...job.eligibility, ...overrides.eligibility }
  }
  const eligibilityKeys = [
    "minimumCgpa",
    "eligibleDepartments",
    "eligibleGraduationYears",
    "requiredSkills",
    "backlogAllowed",
  ]
  eligibilityKeys.forEach((key) => {
    if (overrides[key] !== undefined) {
      job.eligibility[key] = overrides[key]
    }
  })
  return Job.create(job)
}

const login = async (email, password = "secret123") => {
  return request(app).post("/api/auth/login").send({ email, password })
}

const authHeader = (token) => ({ Authorization: `Bearer ${token}` })

const addResume = async (token) => {
  const res = await request(app)
    .post("/api/students/me/resume")
    .set("Authorization", `Bearer ${token}`)
    .attach("resume", Buffer.from("%PDF-1.4 mock resume content"), "resume.pdf")
  return res
}

module.exports = {
  createUser,
  createStudent,
  createRecruiter,
  createAdmin,
  createJob,
  login,
  authHeader,
  addResume,
}
