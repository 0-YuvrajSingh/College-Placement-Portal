import { useCallback, useEffect, useState } from "react"
import { Eye, FileText, Search } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { ApplicationStatusBadge, Modal, PageLoader, Pagination } from "@/components/ui"
import { cx, formatDate, initials } from "@/lib/format"
import type { AdminApplication, ApplicationStatus } from "@/types"

export default function Applications() {
  const [rows, setRows] = useState<AdminApplication[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [status, setStatus] = useState<ApplicationStatus | "">("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewApp, setViewApp] = useState<AdminApplication | null>(null)

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError("")
      try {
        const res = await adminApi.listApplications({ page, status: status || undefined, search: debouncedSearch || undefined, limit: 10 })
        setRows(res.data)
        setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages })
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load applications")
      } finally {
        setLoading(false)
      }
    },
    [status, debouncedSearch],
  )

  useEffect(() => {
    void load()
  }, [load])

  const openDetail = (app: AdminApplication) => {
    setViewApp(app)
  }

  if (loading && rows.length === 0) return <PageLoader label="Loading applications…" />

  const history = viewApp?.statusHistory ?? []
  const latest = history[history.length - 1]

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">
          {pagination.totalPages <= 1 ? `${rows.length} applications this season` : `Page ${pagination.page} of ${pagination.totalPages}`}
        </p>
      </div>

      <div className="pf-flex-center" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div className="pf-gap-6" style={{ flexWrap: "wrap" }}>
          <button className={cx("chip", status === "" && "chip-active")} onClick={() => setStatus("")}>All</button>
          {APPLICATION_STATUSES.map((s) => (
            <button key={s} className={cx("chip", status === s && "chip-active")} onClick={() => setStatus(s)}>
              {APPLICATION_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
          <input className="input" style={{ width: 240, paddingLeft: 32 }} placeholder="Search applications…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted">No applications match your filters.</p>
        </div>
      ) : (
        <div className="card-section">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{app.student.name}</div>
                        <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{app.student.email}</div>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{app.job.title}</td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{app.job.companyName}</td>
                      <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(app.appliedAt)}</td>
                      <td><ApplicationStatusBadge status={app.status} /></td>
                      <td>
                        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 8 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => void openDetail(app)}>
                            <Eye size={13} /> View
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: "var(--pf-teal)" }}
                            title="Download resume"
                            onClick={() => void adminApi.applicationResume(app._id, `${app.student.name}-resume`)}
                          >
                            <FileText size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPage={(p) => void load(p)} />
        </div>
      )}

      <Modal open={viewApp !== null} onClose={() => setViewApp(null)} title="Application details" width={540}>
        {viewApp && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="pf-flex-between" style={{ flexWrap: "wrap", gap: 8 }}>
              <div>
                <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                  <div className="pf-avatar" style={{ width: 34, height: 34, fontSize: 12, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                    {initials(viewApp.student.name)[0] || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{viewApp.student.name}</div>
                    <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{viewApp.student.email}</div>
                  </div>
                </div>
              </div>
              <ApplicationStatusBadge status={viewApp.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Job", val: viewApp.job.title },
                { label: "Company", val: viewApp.job.companyName },
                { label: "Location", val: viewApp.job.location || "—" },
                { label: "Applied", val: formatDate(viewApp.appliedAt) },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
            {latest?.remarks && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Latest remarks</div>
                <p style={{ fontSize: 13, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>{latest.remarks}</p>
              </div>
            )}
            {history.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Timeline</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[...history].reverse().map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pf-teal)", marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 13 }}>
                        <strong>{APPLICATION_STATUS_LABELS[h.status]}</strong>{" "}
                        <span style={{ color: "var(--pf-text-muted)" }}>· {formatDate(h.changedAt)}</span>
                        {h.remarks && <div style={{ color: "var(--pf-text-secondary)", fontSize: 12 }}>{h.remarks}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
              <button className="btn btn-outline btn-md" onClick={() => void adminApi.applicationResume(viewApp._id, `${viewApp.student.name}-resume`)}>
                <FileText size={14} /> Download resume
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
