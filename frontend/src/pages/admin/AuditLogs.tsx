import { useCallback, useEffect, useState } from "react"
import { Activity, ChevronDown, ChevronUp, Search } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { PageLoader, Pagination } from "@/components/ui"
import { formatDateTime, initials } from "@/lib/format"
import type { AuditLogEntry } from "@/types"

const ACTION_LABELS: Record<string, string> = {
  "student.status_changed": "Student status changed",
  "recruiter.status_changed": "Recruiter status changed",
  "job.status_changed": "Job status changed",
}

const ACTIONS = [
  { value: "", label: "All actions" },
  { value: "student.status_changed", label: "Student status changed" },
  { value: "recruiter.status_changed", label: "Recruiter status changed" },
  { value: "job.status_changed", label: "Job status changed" },
]

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function EntryRow({ entry }: { entry: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false)
  const actionLabel = ACTION_LABELS[entry.action] || entry.action
  const hasChanges = entry.changes.length > 0

  return (
    <>
      <tr
        style={{ cursor: hasChanges ? "pointer" : "default" }}
        onClick={() => hasChanges && setExpanded((v) => !v)}
      >
        <td>
          <div className="pf-flex-center" style={{ gap: 8 }}>
            <div
              className="pf-avatar"
              style={{
                width: 28,
                height: 28,
                fontSize: 11,
                background: "var(--pf-teal-soft)",
                border: "1px solid var(--pf-teal)",
                color: "var(--pf-teal)",
              }}
            >
              {entry.actor ? initials(entry.actor.name) : "?"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {entry.actor?.name || "Deleted user"}
              </div>
              <div className="pf-muted" style={{ fontSize: 11 }}>
                {entry.actor?.email || "—"}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span className="chip">{actionLabel}</span>
        </td>
        <td className="pf-muted">{entry.targetType}</td>
        <td className="pf-muted" style={{ fontSize: 12.5 }}>
          {entry.description || "—"}
        </td>
        <td className="pf-muted" style={{ fontSize: 12 }}>
          {formatDateTime(entry.createdAt)}
        </td>
        <td style={{ textAlign: "right" }}>
          {hasChanges ? (
            expanded ? (
              <ChevronUp size={14} className="pf-muted" />
            ) : (
              <ChevronDown size={14} className="pf-muted" />
            )
          ) : null}
        </td>
      </tr>
      {expanded && hasChanges && (
        <tr>
          <td
            colSpan={6}
            style={{ background: "var(--pf-soft)", padding: "4px 18px 14px" }}
          >
            <div
              className="card"
              style={{
                boxShadow: "none",
                border: "1px solid var(--pf-border)",
              }}
            >
              <div className="table-wrap" style={{ border: "none" }}>
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Before</th>
                        <th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.changes.map((c, i) => (
                        <tr key={i}>
                          <td className="pf-muted">{c.field}</td>
                          <td>{formatValue(c.before)}</td>
                          <td style={{ fontWeight: 600 }}>
                            {formatValue(c.after)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AuditLogs() {
  const [rows, setRows] = useState<AuditLogEntry[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [action, setAction] = useState("")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError("")
      try {
        const res = await adminApi.listAuditLogs({
          page,
          limit: 25,
          action: action || undefined,
        })
        const filtered = debouncedSearch.trim()
          ? res.data.filter(
              (r) =>
                (r.actor?.name || "")
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase()) ||
                (r.description || "")
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase()),
            )
          : res.data
        setRows(filtered)
        setPagination({
          page: res.pagination.page,
          totalPages: res.pagination.totalPages,
        })
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Could not load audit logs",
        )
      } finally {
        setLoading(false)
      }
    },
    [action, debouncedSearch],
  )

  useEffect(() => {
    void load()
  }, [load])

  if (loading && rows.length === 0)
    return <PageLoader label="Loading audit logs…" />

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">
          A chronological record of administrative actions
        </p>
      </div>

      <div
        className="pf-flex-between"
        style={{ flexWrap: "wrap", gap: 12, marginBottom: 16 }}
      >
        <select
          className="input"
          style={{ width: 220 }}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          {ACTIONS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <div style={{ position: "relative" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--pf-text-muted)",
            }}
          />
          <input
            className="input"
            style={{ width: 240, paddingLeft: 32 }}
            placeholder="Search actor or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>
            {error}
          </p>
          <button
            className="btn btn-outline btn-md"
            onClick={() => void load()}
          >
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <Activity
            size={28}
            className="pf-muted"
            style={{ marginBottom: 12 }}
          />
          <p className="pf-muted">No audit entries match your filters.</p>
        </div>
      ) : (
        <div className="card-section">
          <div
            className="table-wrap"
            style={{ border: "none", borderRadius: 0 }}
          >
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Description</th>
                    <th>Timestamp</th>
                    <th style={{ textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((entry) => (
                    <EntryRow key={entry._id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPage={(p) => void load(p)}
          />
        </div>
      )}
    </>
  )
}
