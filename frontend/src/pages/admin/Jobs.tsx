import { useCallback, useEffect, useState } from "react"
import { Eye, Search } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/constants"
import { JobStatusBadge, Modal, PageLoader, Pagination } from "@/components/ui"
import { cx, formatDate, formatSalary } from "@/lib/format"
import type { Job, JobStatus } from "@/types"

export default function Jobs() {
  const [rows, setRows] = useState<(Job & { applicantCount: number; recruiter?: { name: string; email: string } })[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [status, setStatus] = useState<JobStatus | "">("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewJob, setViewJob] = useState<(Job & { applicantCount: number; recruiter?: { name: string; email: string } }) | null>(null)

  const load = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError("")
      try {
        const res = await adminApi.listJobs({
          page,
          search: debouncedSearch || undefined,
          status: status || undefined,
          limit: 10,
        })
        setRows(res.data)
        setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages })
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load jobs")
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, status],
  )

  useEffect(() => {
    void load()
  }, [load])

  const quickStatus = async (id: string, next: JobStatus) => {
    try {
      await adminApi.updateJobStatus(id, next)
      await load(pagination.page)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update status")
    }
  }

  if (loading && rows.length === 0) return <PageLoader label="Loading jobs…" />

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Jobs</h1>
        <p className="page-subtitle">
          {pagination.totalPages <= 1 ? `${rows.length} job postings` : `Page ${pagination.page} of ${pagination.totalPages}`}
        </p>
      </div>

      <div className="pf-flex-between" style={{ flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div className="pf-gap-6" style={{ flexWrap: "wrap" }}>
          <button className={cx("chip", status === "" && "chip-active")} onClick={() => setStatus("")}>All</button>
          {JOB_STATUSES.map((s) => (
            <button key={s} className={cx("chip", status === s && "chip-active")} onClick={() => setStatus(s)}>
              {JOB_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pf-text-muted)" }} />
          <input className="input" style={{ width: 240, paddingLeft: 32 }} placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted" style={{ marginBottom: 16 }}>{error}</p>
          <button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="pf-muted">No jobs match your filters.</p>
        </div>
      ) : (
        <div className="card-section">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th>Posted</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                        <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{job.location || "—"} · {formatSalary(job.salary)}</div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{job.recruiter?.name || job.companyName}</td>
                      <td style={{ fontSize: 12, color: "var(--pf-text-secondary)" }}>{job.employmentType || "—"}</td>
                      <td><JobStatusBadge status={job.status} /></td>
                      <td style={{ fontSize: 12, color: "var(--pf-text-secondary)", whiteSpace: "nowrap" }}>{formatDate(job.applicationDeadline)}</td>
                      <td style={{ fontSize: 13, fontWeight: 700, textAlign: "center" }}>{job.applicantCount}</td>
                      <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(job.createdAt)}</td>
                      <td>
                        <div className="pf-flex-center" style={{ justifyContent: "flex-end", gap: 8 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setViewJob(job)}>
                            <Eye size={13} /> View
                          </button>
                          <select
                            className="select"
                            style={{ width: 110, fontSize: 12, padding: "5px 8px" }}
                            value=""
                            onChange={(e) => {
                              const next = e.target.value as JobStatus
                              if (next) void quickStatus(job._id, next)
                            }}
                          >
                            <option value="">Status</option>
                            {JOB_STATUSES.filter((s) => s !== job.status).map((s) => (
                              <option key={s} value={s}>{JOB_STATUS_LABELS[s]}</option>
                            ))}
                          </select>
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

      <Modal open={viewJob !== null} onClose={() => setViewJob(null)} title={viewJob?.title || "Job details"} width={560}>
        {viewJob && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="pf-flex-between" style={{ flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{viewJob.companyName}</div>
                <div style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{viewJob.recruiter?.name || "Recruiter"} · {viewJob.recruiter?.email || "—"}</div>
              </div>
              <JobStatusBadge status={viewJob.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Employment", val: viewJob.employmentType || "—" },
                { label: "Work mode", val: viewJob.workMode || "—" },
                { label: "Location", val: viewJob.location || "—" },
                { label: "Package", val: formatSalary(viewJob.salary) },
                { label: "Deadline", val: formatDate(viewJob.applicationDeadline) },
                { label: "Posted", val: formatDate(viewJob.createdAt) },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
            {viewJob.skills?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Skills</div>
                <div className="pf-gap-6" style={{ flexWrap: "wrap" }}>
                  {viewJob.skills.map((sk) => (
                    <span key={sk} className="skill-chip">{sk}</span>
                  ))}
                </div>
              </div>
            )}
            {viewJob.eligibility && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Eligibility</div>
                <div style={{ fontSize: 13, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>
                  Minimum CGPA {viewJob.eligibility.minimumCgpa} · Departments {viewJob.eligibility.eligibleDepartments.length ? viewJob.eligibility.eligibleDepartments.join(", ") : "All"} ·
                  Graduation {viewJob.eligibility.eligibleGraduationYears.length ? viewJob.eligibility.eligibleGraduationYears.join(", ") : "All"} ·{" "}
                  {viewJob.eligibility.backlogAllowed ? "Backlogs allowed" : "No backlogs"}
                </div>
              </div>
            )}
            {viewJob.description && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 13, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>{viewJob.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
