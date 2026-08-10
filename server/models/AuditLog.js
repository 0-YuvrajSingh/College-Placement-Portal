const mongoose = require("mongoose")
const { ROLES } = require("../config/constants")

// Immutable, append-only trail of administrative actions. Each entry records
// who changed what, when, and the before/after state so a placement office
// can reconstruct exactly what happened.
const changeSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false },
)

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: { type: String, trim: true, maxlength: 500 },
    changes: {
      type: [changeSchema],
      default: [],
    },
    ip: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  },
)

auditLogSchema.index({ actor: 1, createdAt: -1 })
auditLogSchema.index({ targetType: 1, targetId: 1 })
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ action: 1 })

module.exports = mongoose.model("AuditLog", auditLogSchema)
