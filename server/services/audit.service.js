const AuditLog = require("../models/AuditLog")

// Records an administrative action on the append-only audit trail. Fire and
// forget by design: a failed audit write must never roll back the action it is
// documenting.
const writeAudit = async ({
  actor,
  actorRole,
  action,
  targetType,
  targetId = null,
  description = "",
  changes = [],
  ip = "",
}) => {
  try {
    await AuditLog.create({
      actor,
      actorRole,
      action,
      targetType,
      targetId,
      description,
      changes,
      ip,
    })
  } catch (err) {
    console.error(`Failed to write audit log for ${action}: ${err.message}`)
  }
}

// Computes a before/after diff between two plain objects, keeping only fields
// that actually changed and normalizing undefined -> null.
const diffChanges = (before = {}, after = {}) => {
  const changes = []
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])
  for (const key of keys) {
    const a = before[key] === undefined ? null : before[key]
    const b = after[key] === undefined ? null : after[key]
    if (a === b) continue
    changes.push({ field: key, before: a, after: b })
  }
  return changes
}

const listAuditLogs = async ({ page, limit, skip, action, targetType, actorId }) => {
  const filter = {}
  if (action) filter.action = action
  if (targetType) filter.targetType = targetType
  if (actorId) filter.actor = actorId

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ])

  return { logs, total }
}

module.exports = { writeAudit, diffChanges, listAuditLogs }
