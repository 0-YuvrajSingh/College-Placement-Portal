import { useState } from "react"
import { Modal } from "@/components/ui"
import { TRANSITIONS_BY_STATUS } from "@/lib/constants"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONES } from "@/lib/constants"
import type { ApplicationStatus } from "@/types"

const TONE_TO_CLASS: Record<string, string> = {
  success: "btn-primary",
  warning: "btn-secondary",
  danger: "btn-danger",
  info: "btn-secondary",
  muted: "btn-outline",
}

export default function StatusActions({
  status,
  onStatusChange,
  compact,
}: {
  status: ApplicationStatus
  onStatusChange: (status: ApplicationStatus, remarks?: string) => Promise<void> | void
  compact?: boolean
}) {
  const allowed = TRANSITIONS_BY_STATUS[status] || []
  const [pending, setPending] = useState<ApplicationStatus | null>(null)
  const [remarks, setRemarks] = useState("")
  const [busy, setBusy] = useState(false)

  if (allowed.length === 0) return null

  const confirm = async () => {
    if (!pending) return
    setBusy(true)
    try {
      await onStatusChange(pending, remarks.trim() || undefined)
      setPending(null)
      setRemarks("")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
        {allowed.map((next) => (
          <button
            key={next}
            className={`btn ${compact ? "btn-sm" : "btn-md"} ${TONE_TO_CLASS[APPLICATION_STATUS_TONES[next]] || "btn-outline"}`}
            onClick={() => setPending(next)}
          >
            Mark as {APPLICATION_STATUS_LABELS[next]}
          </button>
        ))}
      </div>

      <Modal open={pending !== null} onClose={() => setPending(null)} title={`Move to ${pending ? APPLICATION_STATUS_LABELS[pending] : ""}`} width={420}>
        <p style={{ fontSize: 13, color: "var(--pf-text-secondary)", marginBottom: 12 }}>
          Update the application status from <strong>{APPLICATION_STATUS_LABELS[status]}</strong> to{" "}
          <strong>{pending ? APPLICATION_STATUS_LABELS[pending] : ""}</strong>.
        </p>
        <label className="field-label">Remarks (optional)</label>
        <textarea
          className="textarea"
          placeholder="e.g. Interview scheduled for Monday"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="pf-gap-8" style={{ marginTop: 18, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-md" onClick={() => setPending(null)}>Cancel</button>
          <button className="btn btn-primary btn-md" onClick={confirm} disabled={busy}>
            {busy ? "Updating…" : "Update status"}
          </button>
        </div>
      </Modal>
    </>
  )
}
