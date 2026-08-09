import { useCallback, useEffect, useState } from "react"
import { CheckCircle2, Power, Search, XCircle } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { Modal, PageLoader, Pagination } from "@/components/ui"
import { cx, formatDate, initials } from "@/lib/format"
import type { AdminUserRow } from "@/types"

type FilterKey = "all" | "active" | "pending" | "inactive"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "inactive", label: "Inactive" },
]

export default function Recruiters() {
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [confirmTarget, setConfirmTarget] = useState<AdminUserRow | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError("")
      try {
        if (filter === "pending") {
          const res = await adminApi.listRecruiters({ page: 1, limit: 100, search: debouncedSearch || undefined })
          const pending = res.data.filter((r) => r.recruiterProfile?.isApproved === false)
          setRows(pending)
          setPagination({ page: 1, totalPages: 1 })
        } else {
          const res = await adminApi.listRecruiters({
            page,
            search: debouncedSearch || undefined,
            isActive: filter === "active" ? true : filter === "inactive" ? false : undefined,
            limit: 10,
          })
          setRows(res.data)
          setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages })
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load recruiters")
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, filter],
  )

  useEffect(() => {
    void load()
  }, [load])

  const update = async (row: AdminUserRow, isActive: boolean, isApproved?: boolean) => {
    setBusy(true)
    try {
      await adminApi.updateRecruiterStatus(row._id, isActive, isApproved)
      setConfirmTarget(null)
      await load(pagination.page)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update status")
    } finally {
      setBusy(false)
    }
  }

  if (loading && rows.length === 0) return <PageLoader label="Loading recruiters…" />

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Recruiters</h1>
        <p className="page-subtitle">
          {pagination.totalPages <= 1 ? `${rows.length} registered companies` : `Page ${pagination.page} of ${pagination.totalPages}`}
        </p>
      </div>

      <div className="pf-flex-between" style={{ flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div className="pf-gap-6" style={{ flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button key={f.key} className={cx("chip", filter === f.key && "chip-active")} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
          <input className="input" style={{ width: 240, paddingLeft: 32 }} placeholder="Search companies…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted">No companies match your filters.</p>
        </div>
      ) : (
        <div className="card-section">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Recruiter</th>
                    <th>Email</th>
                    <th>Jobs</th>
                    <th>Approval</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const company = r.recruiterProfile?.companyName || r.name
                    const approved = r.recruiterProfile?.isApproved !== false
                    return (
                      <tr key={r._id}>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                            <div className="pf-avatar" style={{ width: 32, height: 32, fontSize: 11, borderRadius: 6, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                              {initials(company)[0] || "?"}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{company}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{r.name}</td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{r.email}</td>
                        <td style={{ fontSize: 13, fontWeight: 600, textAlign: "center" }}>{r.jobCount ?? 0}</td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 600, color: approved ? "var(--pf-success)" : "var(--pf-amber)" }}>
                            {approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 600, color: r.isActive ? "var(--pf-teal)" : "var(--pf-text-muted)" }}>
                            {r.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(r.createdAt)}</td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 2 }}>
                            {!approved && (
                              <>
                                <button className="btn btn-ghost btn-sm" style={{ color: "var(--pf-success)" }} title="Approve" onClick={() => void update(r, r.isActive, true)}>
                                  <CheckCircle2 size={13} />
                                </button>
                                <button className="btn btn-ghost btn-sm" style={{ color: "var(--pf-danger)" }} title="Reject" onClick={() => void update(r, false, false)}>
                                  <XCircle size={13} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-ghost btn-sm"
                              title={r.isActive ? "Deactivate" : "Activate"}
                              style={{ color: r.isActive ? "var(--pf-danger)" : "var(--pf-teal)" }}
                              onClick={() => setConfirmTarget(r)}
                            >
                              <Power size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {filter !== "pending" && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPage={(p) => void load(p)} />}
        </div>
      )}

      <Modal open={confirmTarget !== null} onClose={() => setConfirmTarget(null)} title={confirmTarget?.isActive ? "Deactivate company?" : "Activate company?"}>
        <p className="pf-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          <strong>{confirmTarget?.recruiterProfile?.companyName || confirmTarget?.name}</strong> will be {confirmTarget?.isActive ? "unable to access the platform" : "able to access the platform again"}.
        </p>
        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmTarget(null)}>Cancel</button>
          <button className="btn btn-primary btn-md" disabled={busy} onClick={() => confirmTarget && void update(confirmTarget, !confirmTarget.isActive)}>
            {busy ? "Saving…" : confirmTarget?.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </Modal>
    </>
  )
}
