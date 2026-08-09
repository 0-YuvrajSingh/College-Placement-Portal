import { useCallback, useEffect, useState } from "react"
import { Power, Search } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { Modal, PageLoader, Pagination } from "@/components/ui"
import { cx, formatDate, initials } from "@/lib/format"
import type { AdminUserRow } from "@/types"

type FilterKey = "all" | "active" | "inactive" | "placed"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "placed", label: "Placed" },
  { key: "inactive", label: "Inactive" },
]

export default function Students() {
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
        const res = await adminApi.listStudents({
          page,
          search: debouncedSearch || undefined,
          isActive: filter === "active" ? true : filter === "inactive" ? false : undefined,
          isPlaced: filter === "placed" ? true : undefined,
          limit: 10,
        })
        setRows(res.data)
        setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages })
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load students")
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, filter],
  )

  useEffect(() => {
    void load()
  }, [load])

  const toggleActive = async () => {
    if (!confirmTarget) return
    setBusy(true)
    try {
      await adminApi.updateStudentStatus(confirmTarget._id, !confirmTarget.isActive)
      setConfirmTarget(null)
      await load(pagination.page)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update status")
    } finally {
      setBusy(false)
    }
  }

  if (loading && rows.length === 0) return <PageLoader label="Loading students…" />

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <p className="page-subtitle">
          {pagination.totalPages <= 1 ? `${rows.length} registered students` : `Page ${pagination.page} of ${pagination.totalPages}`}
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
          <input className="input" style={{ width: 240, paddingLeft: 32 }} placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted">No students match your filters.</p>
        </div>
      ) : (
        <div className="card-section">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Grad Year</th>
                    <th>Profile</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const p = s.studentProfile
                    const complete = !!p?.profileCompleted
                    return (
                      <tr key={s._id}>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                            <div className="pf-avatar" style={{ width: 30, height: 30, fontSize: 11, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                              {initials(s.name)[0] || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                              <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{p?.department || "—"}</td>
                        <td style={{ fontSize: 13, fontWeight: 700, color: (p?.cgpa ?? 0) >= 8.5 ? "var(--pf-teal)" : "var(--pf-text)" }}>{p?.cgpa ?? "—"}</td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-secondary)" }}>{p?.graduationYear ?? "—"}</td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 6 }}>
                            <div style={{ flex: 1, maxWidth: 60, height: 4, background: "var(--pf-surface-elevated)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: complete ? "100%" : "35%", background: complete ? "var(--pf-teal)" : "var(--pf-amber)", borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{complete ? "Complete" : "Incomplete"}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: p?.isPlaced ? "var(--pf-success)" : s.isActive ? "var(--pf-teal)" : "var(--pf-text-muted)", fontSize: 12, fontWeight: 600 }}>
                            {p?.isPlaced ? "Placed" : s.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(s.createdAt)}</td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              title={s.isActive ? "Deactivate" : "Activate"}
                              style={{ color: s.isActive ? "var(--pf-danger)" : "var(--pf-teal)" }}
                              onClick={() => setConfirmTarget(s)}
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
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPage={(p) => void load(p)} />
        </div>
      )}

      <Modal open={confirmTarget !== null} onClose={() => setConfirmTarget(null)} title={confirmTarget?.isActive ? "Deactivate student?" : "Activate student?"}>
        <p className="pf-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          <strong>{confirmTarget?.name}</strong> will be {confirmTarget?.isActive ? "prevented from accessing the platform" : "able to access the platform again"}.
        </p>
        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmTarget(null)}>Cancel</button>
          <button className="btn btn-primary btn-md" disabled={busy} onClick={() => void toggleActive()}>
            {busy ? "Saving…" : confirmTarget?.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </Modal>
    </>
  )
}
