import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Eye, Pencil, Plus, Search, Trash2, XCircle } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { JobStatusBadge, Modal } from "@/components/ui"
import PendingApproval from "@/components/PendingApproval"
import { useRecruiterApproval } from "@/hooks/useRecruiterApproval"
import { cx, formatDate, formatSalary, isClosingSoon } from "@/lib/format"
import type { Job, JobStatus } from "@/types"

const STATUS_TABS: { label: string; value: JobStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "Draft", value: "DRAFT" },
  { label: "Closed", value: "CLOSED" },
  { label: "Expired", value: "EXPIRED" },
]

const SORTS = ["Newest First", "Closing Soon", "Most Applicants"] as const
type SortKey = (typeof SORTS)[number]

export default function Jobs() {
  const navigate = useNavigate()
  const { pending } = useRecruiterApproval()
  const [jobs, setJobs] = useState<(Job & { applicantCount: number })[]>([])
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [statusTab, setStatusTab] = useState<JobStatus | "">("")
  const [sort, setSort] = useState<SortKey>("Newest First")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [confirmAction, setConfirmAction] = useState<"close" | "delete" | null>(null)
  const [targetJob, setTargetJob] = useState<(Job & { applicantCount: number }) | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (pending) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const { data } = await recruiterApi.listJobs({ page: 1, limit: 100 })
      setJobs(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load job postings")
    } finally {
      setLoading(false)
    }
  }, [pending])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    const list = jobs.filter((job) => {
      const matchesStatus = !statusTab || job.status === statusTab
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
    const sorted = [...list]
    if (sort === "Closing Soon") {
      sorted.sort((a, b) => {
        const ad = a.applicationDeadline ? new Date(a.applicationDeadline).getTime() : Infinity
        const bd = b.applicationDeadline ? new Date(b.applicationDeadline).getTime() : Infinity
        return ad - bd
      })
    } else if (sort === "Most Applicants") {
      sorted.sort((a, b) => b.applicantCount - a.applicantCount)
    } else {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return sorted
  }, [jobs, debouncedSearch, statusTab, sort])

  if (pending) return <PendingApproval />

  const runConfirm = async () => {
    if (!targetJob || !confirmAction) return
    setBusy(true)
    try {
      if (confirmAction === "close") {
        await recruiterApi.changeJobStatus(targetJob._id, "CLOSED")
      } else {
        await recruiterApi.deleteJob(targetJob._id)
      }
      setConfirmAction(null)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed")
    } finally {
      setBusy(false)
    }
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="page-body" style={{ paddingTop: 48, color: "var(--pf-text-muted)", fontSize: 14 }}>Loading job postings…</div>
    )
  }

  if (error && jobs.length === 0) {
    return (
      <div className="page-body" style={{ paddingTop: 48 }}>
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Postings</h1>
          <p className="page-subtitle">
            {filtered.length} posting{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => navigate("/recruiter/jobs/new")}>
          <Plus size={14} /> Post New Job
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="pf-flex-between" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value || "all"}
                className={cx("chip", statusTab === tab.value && "chip-active")}
                onClick={() => setStatusTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pf-flex-center" style={{ gap: 8 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
              <input
                className="input"
                style={{ width: 240, paddingLeft: 32 }}
                placeholder="Search jobs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-section">
          {filtered.length === 0 ? (
            <div className="card-section-body">
              <div className="card" style={{ padding: 32, textAlign: "center" }}>
                <p className="pf-muted" style={{ marginBottom: 16 }}>No job postings match your filters.</p>
                <button className="btn btn-outline btn-md" onClick={() => { setSearch(""); setStatusTab(""); setSort("Newest First") }}>
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th>Applicants</th>
                      <th>Type</th>
                      <th>Posted</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                          <div style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{job.location || "—"} · {formatSalary(job.salary)}</div>
                        </td>
                        <td><JobStatusBadge status={job.status} /></td>
                        <td style={{ fontSize: 13, color: isClosingSoon(job.applicationDeadline) ? "var(--pf-amber)" : "var(--pf-text-secondary)", whiteSpace: "nowrap" }}>
                          {isClosingSoon(job.applicationDeadline) && <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                          {formatDate(job.applicationDeadline)}
                        </td>
                        <td style={{ fontSize: 13, fontWeight: 700 }}>{job.applicantCount}</td>
                        <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{job.employmentType || "—"}</td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(job.createdAt)}</td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 2 }}>
                            <button title="View" className="btn btn-ghost btn-sm" onClick={() => navigate(`/recruiter/jobs/${job._id}`)}>
                              <Eye size={13} />
                            </button>
                            <button title="Edit" className="btn btn-ghost btn-sm" onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>
                              <Pencil size={13} />
                            </button>
                            {job.status === "OPEN" && (
                              <button
                                title="Close posting"
                                className="btn btn-ghost btn-sm"
                                style={{ color: "var(--pf-amber)" }}
                                onClick={() => { setTargetJob(job); setConfirmAction("close") }}
                              >
                                <XCircle size={13} />
                              </button>
                            )}
                            <button
                              title="Delete"
                              className="btn btn-ghost btn-sm"
                              style={{ color: "var(--pf-danger)" }}
                              onClick={() => { setTargetJob(job); setConfirmAction("delete") }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={confirmAction === "close"} onClose={() => setConfirmAction(null)} title="Close this job posting?">
        <p className="pf-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          Students will no longer be able to apply to <strong>{targetJob?.title}</strong>. You can reopen it later if needed.
        </p>
        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmAction(null)}>Cancel</button>
          <button className="btn btn-danger btn-md" disabled={busy} onClick={() => void runConfirm()}>
            {busy ? "Closing…" : "Close Posting"}
          </button>
        </div>
      </Modal>

      <Modal open={confirmAction === "delete"} onClose={() => setConfirmAction(null)} title="Delete this job posting?">
        <p className="pf-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          <strong>{targetJob?.title}</strong> and all its applications will be permanently removed. This cannot be undone.
        </p>
        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmAction(null)}>Cancel</button>
          <button className="btn btn-danger btn-md" disabled={busy} onClick={() => void runConfirm()}>
            {busy ? "Deleting…" : "Delete Posting"}
          </button>
        </div>
      </Modal>
    </>
  )
}
