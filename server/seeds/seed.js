const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = require("../config/db")
const User = require("../models/User")
const Student = require("../models/Student")
const Recruiter = require("../models/Recruiter")
const Job = require("../models/Job")
const Application = require("../models/Application")
const { ROLES } = require("../config/constants")
const { getUploadsDir, ensureUploadsDir } = require("../services/file.service")

const SAMPLE_PDF = Buffer.from(
  "%PDF-1.4\n" +
  "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n" +
  "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n" +
  "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n" +
  "4 0 obj << /Length 67 >> stream\n" +
  "BT /F1 14 Tf 72 712 Td (Aarav Mehta - Computer Science Engineering Resume) Tj ET\n" +
  "endstream\n" +
  "endobj\n" +
  "xref\n" +
  "0 5\n" +
  "0000000000 65535 f \n" +
  "0000000009 00000 n \n" +
  "0000000058 00000 n \n" +
  "0000000115 00000 n \n" +
  "0000000214 00000 n \n" +
  "trailer << /Root 1 0 R /Size 5 >>\n" +
  "startxref\n" +
  "333\n" +
  "%%EOF\n",
  "latin1"
)

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)

const clearCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Recruiter.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ])
}

const seed = async () => {
  await connectDB()
  await clearCollections()

  // ---------- Admin ----------
  const admin = await User.create({
    name: "Prof. Meera Iyer",
    email: "admin@placeforge.edu",
    password: "Admin@1234",
    role: ROLES.ADMIN,
  })

  // ---------- Recruiters ----------
  const priya = await User.create({
    name: "Priya Sharma",
    email: "priya@acme.com",
    password: "Recruiter@123",
    role: ROLES.RECRUITER,
  })
  const rajesh = await User.create({
    name: "Rajesh Kumar",
    email: "rajesh@infotech.com",
    password: "Recruiter@123",
    role: ROLES.RECRUITER,
  })
  const neha = await User.create({
    name: "Neha Gupta",
    email: "neha@novabank.com",
    password: "Recruiter@123",
    role: ROLES.RECRUITER,
  })

  await Recruiter.create([
    {
      user: priya._id,
      companyName: "Acme Technologies",
      companyDescription: "Product company building cloud collaboration tools.",
      website: "https://acme.example.com",
      industry: "Software",
      location: "Bengaluru",
      contactPerson: "Priya Sharma",
      contactPhone: "9812345670",
      companySize: "501-1000",
      isApproved: true,
    },
    {
      user: rajesh._id,
      companyName: "Infotech Solutions",
      companyDescription: "IT services and consulting across verticals.",
      website: "https://infotech.example.com",
      industry: "IT Services",
      location: "Hyderabad",
      contactPerson: "Rajesh Kumar",
      contactPhone: "9823456781",
      companySize: "1001-5000",
      isApproved: true,
    },
    {
      user: neha._id,
      companyName: "NovaBank",
      companyDescription: "Digital-first retail banking group.",
      website: "https://novabank.example.com",
      industry: "Banking",
      location: "Mumbai",
      contactPerson: "Neha Gupta",
      contactPhone: "9834567892",
      companySize: "5000+",
      isApproved: true,
    },
  ])

  // ---------- Students ----------
  const aarav = await User.create({
    name: "Aarav Mehta",
    email: "aarav@college.edu",
    password: "Student@123",
    role: ROLES.STUDENT,
  })
  const sanya = await User.create({
    name: "Sanya Kapoor",
    email: "sanya@college.edu",
    password: "Student@123",
    role: ROLES.STUDENT,
  })
  const rohan = await User.create({
    name: "Rohan Verma",
    email: "rohan@college.edu",
    password: "Student@123",
    role: ROLES.STUDENT,
  })
  const ishita = await User.create({
    name: "Ishita Reddy",
    email: "ishita@college.edu",
    password: "Student@123",
    role: ROLES.STUDENT,
  })
  const kabir = await User.create({
    name: "Kabir Singh",
    email: "kabir@college.edu",
    password: "Student@123",
    role: ROLES.STUDENT,
  })

  await Student.create([
    {
      user: aarav._id,
      name: "Aarav Mehta",
      email: "aarav@college.edu",
      rollNumber: "CS21A001",
      registrationNumber: "2021CS001",
      phone: "9988776655",
      college: "Example Institute of Technology",
      course: "B.Tech",
      department: "CSE",
      year: 4,
      semester: 8,
      cgpa: 8.9,
      graduationYear: 2026,
      hasActiveBacklogs: false,
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      education: [
        {
          degree: "B.Tech CSE",
          institution: "Example Institute of Technology",
          startYear: 2022,
          endYear: 2026,
          percentage: 8.9,
        },
      ],
      resume: {
        filename: "seed-resume-aarav.pdf",
        originalname: "Aarav_Mehta_Resume.pdf",
        path: "/api/students/me/resume",
        mimetype: "application/pdf",
        size: SAMPLE_PDF.length,
        uploadedAt: new Date(),
      },
    },
    {
      user: sanya._id,
      name: "Sanya Kapoor",
      email: "sanya@college.edu",
      rollNumber: "IT21A014",
      registrationNumber: "2021IT014",
      phone: "9876543210",
      college: "Example Institute of Technology",
      course: "B.Tech",
      department: "IT",
      year: 4,
      semester: 8,
      cgpa: 7.2,
      graduationYear: 2026,
      hasActiveBacklogs: false,
      skills: ["Java", "Spring", "MySQL", "AWS"],
    },
    {
      user: rohan._id,
      name: "Rohan Verma",
      email: "rohan@college.edu",
      rollNumber: "EC21A027",
      registrationNumber: "2021EC027",
      phone: "9765432109",
      college: "Example Institute of Technology",
      course: "B.Tech",
      department: "ECE",
      year: 3,
      semester: 6,
      cgpa: 6.8,
      graduationYear: 2027,
      hasActiveBacklogs: false,
      skills: ["Python", "Embedded C", "VLSI"],
    },
    {
      user: ishita._id,
      name: "Ishita Reddy",
      email: "ishita@college.edu",
      rollNumber: "CS21A009",
      registrationNumber: "2021CS009",
      phone: "9654321098",
      college: "Example Institute of Technology",
      course: "B.Tech",
      department: "CSE",
      year: 4,
      semester: 8,
      cgpa: 9.1,
      graduationYear: 2026,
      hasActiveBacklogs: false,
      skills: ["Python", "Django", "SQL", "Machine Learning"],
      isPlaced: true,
    },
    {
      user: kabir._id,
      name: "Kabir Singh",
      email: "kabir@college.edu",
      rollNumber: "ME21A033",
      registrationNumber: "2021ME033",
      phone: "9543210987",
      college: "Example Institute of Technology",
      course: "B.Tech",
      department: "ME",
      year: 4,
      semester: 8,
      cgpa: 7.9,
      graduationYear: 2026,
      hasActiveBacklogs: true,
      skills: ["AutoCAD", "SolidWorks", "CATIA"],
    },
  ])

  // Seed students are fully-formed, so mark them as completed.
  await Student.updateMany({}, { $set: { profileCompleted: true } })

  // ---------- Jobs ----------
  const softwareEngineer = await Job.create({
    recruiter: priya._id,
    title: "Software Engineer",
    description:
      "Build and ship features for our cloud collaboration platform. Work with a cross-functional team on backend APIs and frontend components.",
    companyName: "Acme Technologies",
    location: "Bengaluru",
    employmentType: "Full-time",
    workMode: "Hybrid",
    salary: { min: 8, max: 14, currency: "LPA" },
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    eligibility: {
      minimumCgpa: 7.5,
      eligibleDepartments: ["CSE", "IT"],
      eligibleGraduationYears: [2026],
      requiredSkills: ["JavaScript"],
      backlogAllowed: false,
    },
    applicationDeadline: daysFromNow(20),
    status: "OPEN",
  })

  const backendDeveloper = await Job.create({
    recruiter: priya._id,
    title: "Backend Developer",
    description:
      "Design scalable REST APIs and database schemas for high-traffic services.",
    companyName: "Acme Technologies",
    location: "Bengaluru",
    employmentType: "Full-time",
    workMode: "On-site",
    salary: { min: 7, max: 12, currency: "LPA" },
    skills: ["Node.js", "MongoDB", "Express"],
    eligibility: {
      minimumCgpa: 7,
      eligibleDepartments: ["CSE"],
      eligibleGraduationYears: [2026],
      requiredSkills: ["Node.js"],
      backlogAllowed: false,
    },
    applicationDeadline: daysFromNow(15),
    status: "OPEN",
  })

  await Job.create({
    recruiter: priya._id,
    title: "Software Engineer Intern",
    description: "Six-month internship for final-year students with strong fundamentals.",
    companyName: "Acme Technologies",
    location: "Remote",
    employmentType: "Internship",
    workMode: "Remote",
    salary: { min: 2, max: 4, currency: "LPA" },
    skills: ["JavaScript", "HTML", "CSS"],
    eligibility: {
      minimumCgpa: 6.5,
      eligibleDepartments: ["CSE", "IT"],
      eligibleGraduationYears: [2026],
      requiredSkills: [],
      backlogAllowed: true,
    },
    applicationDeadline: daysFromNow(30),
    status: "DRAFT",
  })

  const javaDeveloper = await Job.create({
    recruiter: rajesh._id,
    title: "Java Developer",
    description:
      "Develop enterprise-grade Java applications for our banking clients.",
    companyName: "Infotech Solutions",
    location: "Hyderabad",
    employmentType: "Full-time",
    workMode: "On-site",
    salary: { min: 6, max: 10, currency: "LPA" },
    skills: ["Java", "Spring", "MySQL"],
    eligibility: {
      minimumCgpa: 7,
      eligibleDepartments: ["CSE", "IT"],
      eligibleGraduationYears: [2026, 2027],
      requiredSkills: ["Java"],
      backlogAllowed: true,
    },
    applicationDeadline: daysFromNow(25),
    status: "OPEN",
  })

  await Job.create({
    recruiter: rajesh._id,
    title: "Data Analyst",
    description:
      "Analyse business data and build dashboards for decision support.",
    companyName: "Infotech Solutions",
    location: "Hyderabad",
    employmentType: "Full-time",
    workMode: "Hybrid",
    salary: { min: 5, max: 8, currency: "LPA" },
    skills: ["SQL", "Excel", "Power BI"],
    eligibility: {
      minimumCgpa: 6.5,
      eligibleDepartments: ["CSE", "IT"],
      eligibleGraduationYears: [2026],
      requiredSkills: ["SQL"],
      backlogAllowed: true,
    },
    applicationDeadline: daysFromNow(-5),
    status: "CLOSED",
  })

  const managementTrainee = await Job.create({
    recruiter: neha._id,
    title: "Management Trainee",
    description:
      "Rotational management trainee programme across retail banking operations.",
    companyName: "NovaBank",
    location: "Mumbai",
    employmentType: "Full-time",
    workMode: "On-site",
    salary: { min: 6, max: 9, currency: "LPA" },
    skills: ["Communication", "Analytics"],
    eligibility: {
      minimumCgpa: 6.5,
      eligibleDepartments: [],
      eligibleGraduationYears: [],
      requiredSkills: [],
      backlogAllowed: true,
    },
    applicationDeadline: daysFromNow(18),
    status: "OPEN",
  })

  await Job.create({
    recruiter: neha._id,
    title: "IT Support Engineer",
    description:
      "First-line technical support for internal banking applications.",
    companyName: "NovaBank",
    location: "Mumbai",
    employmentType: "Full-time",
    workMode: "On-site",
    salary: { min: 4, max: 6, currency: "LPA" },
    skills: ["Networking", "Windows"],
    eligibility: {
      minimumCgpa: 6,
      eligibleDepartments: [],
      eligibleGraduationYears: [],
      requiredSkills: [],
      backlogAllowed: true,
    },
    applicationDeadline: daysFromNow(-2),
    status: "OPEN",
  })

  // ---------- Files & Applications ----------
  const uploadDir = ensureUploadsDir()
  const aaravResumeFile = "seed-resume-aarav.pdf"
  const snapSeFile = "snap-aarav-se.pdf"
  const snapBeFile = "snap-aarav-be.pdf"

  fs.writeFileSync(path.join(uploadDir, aaravResumeFile), SAMPLE_PDF)
  fs.writeFileSync(path.join(uploadDir, snapSeFile), SAMPLE_PDF)
  fs.writeFileSync(path.join(uploadDir, snapBeFile), SAMPLE_PDF)

  const apply = (studentUserId, job, status, history, resumeSnapshot = null) =>
    Application.create({
      student: studentUserId,
      job: job._id,
      recruiter: job.recruiter,
      resumeSnapshot,
      status,
      appliedAt: daysFromNow(-6),
      withdrawnAt: status === "WITHDRAWN" ? daysFromNow(-1) : null,
      statusHistory: history,
    })

  await apply(
    aarav._id,
    softwareEngineer,
    "APPLIED",
    [{ status: "APPLIED", changedBy: aarav._id, remarks: "Application submitted" }],
    {
      originalName: "Aarav_Mehta_Resume.pdf",
      storedName: snapSeFile,
      mimeType: "application/pdf",
      size: SAMPLE_PDF.length,
    },
  )

  await apply(
    aarav._id,
    backendDeveloper,
    "SHORTLISTED",
    [
      { status: "APPLIED", changedBy: aarav._id, remarks: "Application submitted" },
      { status: "SHORTLISTED", changedBy: priya._id, remarks: "Strong profile" },
    ],
    {
      originalName: "Aarav_Mehta_Resume.pdf",
      storedName: snapBeFile,
      mimeType: "application/pdf",
      size: SAMPLE_PDF.length,
    },
  )

  await apply(sanya._id, javaDeveloper, "APPLIED", [
    { status: "APPLIED", changedBy: sanya._id, remarks: "Application submitted" },
  ])

  await apply(ishita._id, softwareEngineer, "SELECTED", [
    { status: "APPLIED", changedBy: ishita._id, remarks: "Application submitted" },
    { status: "SHORTLISTED", changedBy: priya._id, remarks: "Interview scheduled" },
    { status: "SELECTED", changedBy: priya._id, remarks: "Offer extended" },
  ])

  await apply(rohan._id, managementTrainee, "REJECTED", [
    { status: "APPLIED", changedBy: rohan._id, remarks: "Application submitted" },
    { status: "REJECTED", changedBy: neha._id, remarks: "Round 1 not cleared" },
  ])

  await apply(kabir._id, managementTrainee, "WITHDRAWN", [
    { status: "APPLIED", changedBy: kabir._id, remarks: "Application submitted" },
    { status: "WITHDRAWN", changedBy: kabir._id, remarks: "Accepted another offer" },
  ])

  await apply(ishita._id, javaDeveloper, "APPLIED", [
    { status: "APPLIED", changedBy: ishita._id, remarks: "Application submitted" },
  ])

  console.log("\n=== Seed data created ===\n")
  console.log("Admin:      admin@placeforge.edu / Admin@1234")
  console.log("Recruiters: priya@acme.com, rajesh@infotech.com, neha@novabank.com / Recruiter@123")
  console.log("Students:   aarav@college.edu, sanya@college.edu, rohan@college.edu,")
  console.log("            ishita@college.edu, kabir@college.edu / Student@123")
  console.log(
    `\nUsers: ${await User.countDocuments()}, Students: ${await Student.countDocuments()}, ` +
      `Recruiters: ${await Recruiter.countDocuments()}, Jobs: ${await Job.countDocuments()}, ` +
      `Applications: ${await Application.countDocuments()}`,
  )
}

seed()
  .then(() => {
    mongoose.disconnect()
    process.exit(0)
  })
  .catch((error) => {
    console.error("Seed failed:", error)
    mongoose.disconnect()
    process.exit(1)
  })
