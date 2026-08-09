import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, FileText, Search } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { ApplicationStatusBadge, PageLoader, Pagination } from "@/components/ui"
import { cx, formatDate, initials } from "@/lib/format"
import type { ApplicationStatus, RecruiterApplication } from "@/types"

const QUICK_STATUSES: ApplicationStatus[] = ["SHORTLISTED", "SELECTED", "REJECTED"]

export default function Applications() {
  const navigate = useNavigate()
  const [apps, setApps] = useState<RecruiterApplication[]>([])
  const [pagination, setPagination] = useState<{ page: number; totalPages: number }>({ page: 1, totalPages: 1 })
  const [jobs, setJobs] = useState<{ _id: string; title: string }[]>([])
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [status, setStatus] = useState<ApplicationStatus | "">("")
  const [jobId, setJobId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    setError("")
    try {
      const res = await recruiterApi.listApplications({
        page,
        status: status || undefined,
        jobId: jobId || undefined,
        search: debouncedSearch || undefined,
        limit: 10,
      })
      setApps(res.data)
      setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load applicants")
    } finally {
      setLoading(false)
    }
  }, [status, jobId, debouncedSearch])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    recruiterApi
      .listJobs({ page: 1, limit: 100 })
      .then((res) => setJobs(res.data.map((j) => ({ _id: j._id, title: j.title }))))
      .catch(() => undefined)
  }, [])

  const quickUpdate = async (appId: string, next: ApplicationStatus) => {
    try {
      await recruiterApi.updateApplicationStatus(appId, next)
      await load(pagination.page)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update status")
    }
  }

  if (loading && apps.length === 0) return <PageLoader label="Loading applicants…" />

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Applicants</h1>
        <p className="page-subtitle">
          {pagination.totalPages <= 1 ? `${apps.length} student${apps.length === 1 ? "" : "s"}` : `${pagination.page} of ${pagination.totalPages} pages`} across your postings
        </p>
      </div>

      <div className="pf-flex-center" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button className={cx("chip", status === "" && "chip-active")} onClick={() => setStatus("")}>All</button>
          {APPLICATION_STATUSES.map((s) => (
            <button key={s} className={cx("chip", status === s && "chip-active")} onClick={() => setStatus(s)}>
              {APPLICATION_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="pf-flex-center" style={{ gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
            <input
              className="input"
              style={{ width: 220, paddingLeft: 32 }}
              placeholder="Search applicants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="select" value={jobId} onChange={(e) => setJobId(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">All jobs</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {error && apps.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      ) : apps.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted">No applicants match your filters.</p>
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
                    <th>Skills</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => {
                    const student = app.student
                    const job = typeof app.job === "object" && app.job ? app.job : null
                    const skills = app.studentProfile?.skills ?? []
                    return (
                      <tr key={app._id} onClick={() => navigate(`/recruiter/applications/${app._id}`)} style={{ cursor: "pointer" }}>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                            <div className="pf-avatar" style={{ width: 32, height: 32, fontSize: 12, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                              {initials(student.name)[0] || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</div>
                              <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{app.studentProfile?.department || "—"}</td>
                        <td style={{ fontSize: 13, fontWeight: 700, color: (app.studentProfile?.cgpa ?? 0) >= 8.5 ? "var(--pf-teal)" : "var(--pf-text)" }}>
                          {app.studentProfile?.cgpa ?? "—"}
                        </td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 4, flexWrap: "wrap" }}>
                            {skills.slice(0, 2).map((sk) => (
                              <span key={sk} className="skill-chip">{sk}</span>
                            ))}
                            {skills.length > 2 && <span style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>+{skills.length - 2}</span>}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)" }}>{job?.title || "—"}</div>
                          <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{formatDate(app.appliedAt)}</div>
                        </td>
                        <td><ApplicationStatusBadge status={app.status} /></td>
                        <td>
                          <button
                            className="link"
                            style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              void recruiterApi.applicationResume(app._id, `${student.name}-resume`)
                            }}
                          >
                            <FileText size={13} /> View
                          </button>
                        </td>
                        <td>
                          <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 8 }}>
                            <select
                              className="select"
                              style={{ width: 130, fontSize: 12, padding: "5px 8px" }}
                              value=""
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const next = e.target.value as ApplicationStatus
                                if (next) void quickUpdate(app._id, next)
                              }}
                            >
                              <option value="">Update status</option>
                              {QUICK_STATUSES.map((s) => (
                                <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/recruiter/applications/${app._id}`)
                              }}
                            >
                              Review <ArrowRight size={11} />
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
    </>
  )
}
