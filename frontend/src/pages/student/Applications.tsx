import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, FileText, Inbox } from "lucide-react"
import { studentApi } from "@/api/student"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { ApplicationStatusBadge, EmptyState, Modal, PageLoader, Pagination } from "@/components/ui"
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { formatDate, initials } from "@/lib/format"
import type { Application, ApplicationStatus } from "@/types"

const STAGES_BY_STATUS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ["APPLIED"],
  SHORTLISTED: ["APPLIED", "SHORTLISTED"],
  SELECTED: ["APPLIED", "SHORTLISTED", "SELECTED"],
  REJECTED: ["APPLIED", "REJECTED"],
  WITHDRAWN: ["APPLIED", "WITHDRAWN"],
}

function stageDate(app: Application, stage: ApplicationStatus): string | undefined {
  if (stage === "APPLIED") return app.appliedAt
  const entry = app.statusHistory.find((h) => h.status === stage)
  return entry?.changedAt
}

function Timeline({ app }: { app: Application }) {
  const isEnd = app.status === "REJECTED" || app.status === "WITHDRAWN"
  const stages = STAGES_BY_STATUS[app.status] || ["APPLIED"]
  const currentIdx = stages.indexOf(app.status)

  const stageColor = (idx: number): string => {
    if (isEnd && idx === stages.length - 1) return "var(--pf-danger)"
    if (idx <= currentIdx) return "var(--pf-teal)"
    return "var(--pf-border-strong)"
  }
  const stageBg = (idx: number): string => {
    if (isEnd && idx === stages.length - 1) return "var(--pf-danger-soft)"
    if (idx <= currentIdx) return "var(--pf-teal-soft)"
    return "var(--pf-surface-elevated)"
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative", paddingTop: 8 }}>
      {stages.map((stage, i) => (
        <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {i < stages.length - 1 && (
            <div
              style={{
                position: "absolute",
                top: 13,
                left: "50%",
                right: "-50%",
                height: 2,
                background: i < currentIdx ? "var(--pf-teal)" : "var(--pf-border)",
              }}
            />
          )}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: stageBg(i),
              border: `2px solid ${stageColor(i)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: stageColor(i) }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: i <= currentIdx ? "var(--pf-text)" : "var(--pf-text-muted)", textAlign: "center" }}>
            {APPLICATION_STATUS_LABELS[stage]}
          </div>
          {stageDate(app, stage) && (
            <div style={{ fontSize: 10, color: "var(--pf-text-muted)", marginTop: 2, textAlign: "center" }}>
              {formatDate(stageDate(app, stage))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Applications() {
  const { success, error: toastError } = useToast()
  const [apps, setApps] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [confirmWithdraw, setConfirmWithdraw] = useState<Application | null>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data, pagination } = await studentApi.myApplications({ status: status || undefined, page })
      setApps(data)
      setTotal(pagination.total)
      setTotalPages(pagination.totalPages)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load applications")
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    void load()
  }, [load])

  const onWithdraw = async () => {
    if (!confirmWithdraw) return
    setWithdrawing(true)
    try {
      await studentApi.withdraw(confirmWithdraw._id)
      success("Application withdrawn")
      setConfirmWithdraw(null)
      await load()
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not withdraw application")
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="pf-flex-between">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">{loading ? "Loading applications…" : `${total} application${total === 1 ? "" : "s"} submitted this season`}</p>
          </div>
          <select className="select" style={{ width: 170 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {loading ? (
          <PageLoader label="Loading applications…" />
        ) : error ? (
          <EmptyState
            title="Could not load applications"
            message={error}
            action={<button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>}
          />
        ) : apps.length === 0 ? (
          <EmptyState
            icon={<Inbox size={36} />}
            title="No applications yet"
            message="You haven't applied to any opportunities yet."
            action={<Link to="/jobs" className="btn btn-primary btn-md">Browse opportunities</Link>}
          />
        ) : (
          <>
            {apps.map((app) => {
              const job = typeof app.job === "object" && app.job ? app.job : null
              const lastEntry = app.statusHistory[app.statusHistory.length - 1]
              return (
                <div key={app._id} className="card" style={{ overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--pf-border)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "var(--pf-navy)",
                        color: "var(--pf-teal)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Manrope",
                        fontWeight: 800,
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {initials(job?.companyName || "?")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15 }}>{job?.title || "—"}</div>
                      <div style={{ color: "var(--pf-text-secondary)", fontSize: 13 }}>{job?.companyName || "—"}</div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <ApplicationStatusBadge status={app.status} />
                      <div style={{ color: "var(--pf-text-muted)", fontSize: 11 }}>Applied {formatDate(app.appliedAt)}</div>
                      {app.status === "APPLIED" && (
                        <button className="btn btn-ghost btn-sm" style={{ color: "var(--pf-danger)" }} onClick={() => setConfirmWithdraw(app)}>
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "20px 28px" }}>
                    <Timeline app={app} />
                    {lastEntry?.remarks && (
                      <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 6, background: "var(--pf-bg)", border: "1px solid var(--pf-border)", fontSize: 13, color: "var(--pf-text-secondary)", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: "var(--pf-text)" }}>Latest: </span>
                        {lastEntry.remarks}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>

      <Modal open={confirmWithdraw !== null} onClose={() => setConfirmWithdraw(null)} title="Withdraw application" width={420}>
        <p style={{ fontSize: 13.5, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>
          Are you sure you want to withdraw your application for{" "}
          <strong>{typeof confirmWithdraw?.job === "object" && confirmWithdraw?.job ? confirmWithdraw.job.title : "this job"}</strong>? This action cannot be undone.
        </p>
        <div className="pf-gap-8" style={{ marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmWithdraw(null)}>Cancel</button>
          <button className="btn btn-danger btn-md" onClick={() => void onWithdraw()} disabled={withdrawing}>
            {withdrawing ? "Withdrawing…" : "Withdraw application"}
          </button>
        </div>
      </Modal>
    </>
  )
}
