const mongoose = require("mongoose")
const { APPLICATION_STATUS } = require("../config/constants")

const resumeSnapshotSchema = new mongoose.Schema(
  {
    originalName: { type: String },
    storedName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { _id: false },
)

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      required: true,
    },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
    remarks: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false },
)

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter reference is required"],
    },
    resumeSnapshot: {
      type: resumeSnapshotSchema,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    appliedAt: { type: Date, default: Date.now },
    withdrawnAt: { type: Date, default: null },
    remarks: { type: String, trim: true, maxlength: 1000 },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

applicationSchema.index({ student: 1, job: 1 }, { unique: true })
applicationSchema.index({ job: 1 })
applicationSchema.index({ recruiter: 1 })
applicationSchema.index({ status: 1 })

module.exports = mongoose.model("Application", applicationSchema)
