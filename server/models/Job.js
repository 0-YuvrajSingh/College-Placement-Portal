const mongoose = require("mongoose")
const {
  JOB_STATUS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  DEPARTMENTS,
} = require("../config/constants")

const salarySchema = new mongoose.Schema(
  {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, trim: true, default: "INR" },
  },
  { _id: false },
)

const eligibilitySchema = new mongoose.Schema(
  {
    minimumCgpa: { type: Number, min: 0, max: 10, default: 0 },
    eligibleDepartments: {
      type: [String],
      enum: DEPARTMENTS,
      default: [],
    },
    eligibleGraduationYears: {
      type: [Number],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    backlogAllowed: { type: Boolean, default: true },
  },
  { _id: false },
)

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter reference is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [120, "Job title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: WORK_MODES,
      default: "On-site",
    },
    salary: {
      type: salarySchema,
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: eligibilitySchema,
      default: () => ({}),
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.DRAFT,
    },
  },
  {
    timestamps: true,
  },
)

jobSchema.index({ recruiter: 1 })
jobSchema.index({ status: 1, applicationDeadline: 1 })
jobSchema.index({ title: 1 })

module.exports = mongoose.model("Job", jobSchema)
