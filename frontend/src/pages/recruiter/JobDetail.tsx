import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, Trash2, Users } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { PageHeader, PageLoader, EmptyState, Pagination, JobStatusBadge, ApplicationStatusBadge, Modal, Badge } from "@/components/ui"
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { cx, formatDate, formatSalary } from "@/lib/format"
import type { Job, RecruiterApplication } from "@/types"

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<RecruiterApplication[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchJob = useCallback(async () => {
    if (!id) return
    try {
      const { job: loaded } = await recruiterApi.getJob(id)
      setJob(loaded)
    } catch {
      setNotFound(true)
    }
  }, [id])

  const fetchApplications = useCallback(async () => {
    if (!id) return
    try {
      const { data, pagination } = await recruiterApi.jobApplications(id, { status: status || undefined, page })
      setApplications(data)
      setTotalPages(pagination.totalPages)
    } catch {
      setApplications([])
    }
  }, [id, status, page])

  useEffect(() => {
    fetchJob().finally(() => setLoading(false))
  }, [fetchJob])

  useEffect(() => {
    if (job) fetchApplications()
  }, [fetchApplications, job])

  const changeStatus = async (next: "OPEN" | "CLOSED") => {
    if (!job) return
    try {
      const { job: updated } = await recruiterApi.changeJobStatus(job._id, next)
      setJob(updated)
      success(next === "OPEN" ? "Job published" : "Job closed")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not update status")
    }
  }

  const onDelete = async () => {
    if (!job) return
    setDeleting(true)
    try {
      await recruiterApi.deleteJob(job._id)
      success("Job deleted")
      navigate("/recruiter/jobs")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not delete job")
      setDeleteOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <PageLoader label="Loading job…" />
  if (notFound || !job) {
    return (
      <EmptyState
        title="Job not found"
        message="This posting may have been removed."
        action={<Link to="/recruiter/jobs" className="btn btn-outline btn-md">Back to jobs</Link>}
      />
    )
  }

  return (
    <>
      <div style={{ padding: "18px 32px 0" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
      <PageHeader
        title={job.title}
        subtitle={`${job.companyName} · ${job.location || "Location not specified"}`}
        actions={
          <div className="pf-gap-8">
            {job.status === "DRAFT" && <button className="btn btn-primary btn-md" onClick={() => changeStatus("OPEN")}>Publish</button>}
            {job.status === "OPEN" && <button className="btn btn-outline btn-md" onClick={() => changeStatus("CLOSED")}>Close</button>}
            <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-outline btn-md"><Pencil size={15} /> Edit</Link>
            {applications.length === 0 && (
              <button className="btn btn-ghost btn-md" style={{ color: "var(--pf-danger)" }} onClick={() => setDeleteOpen(true)}>
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        }
      />

      <div className="page-body">
        <div className="pf-grid-7-5">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: "20px 24px" }}>
              <div className="pf-flex-between" style={{ marginBottom: 14 }}>
                <h2 className="section-title">About the role</h2>
                <JobStatusBadge status={job.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 18 }}>
                <div><div className="pf-muted" style={{ fontSize: 11.5, marginBottom: 2 }}>Salary</div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatSalary(job.salary)}</div></div>
                <div><div className="pf-muted" style={{ fontSize: 11.5, marginBottom: 2 }}>Type</div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{job.employmentType}</div></div>
                <div><div className="pf-muted" style={{ fontSize: 11.5, marginBottom: 2 }}>Mode</div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{job.workMode}</div></div>
                <div><div className="pf-muted" style={{ fontSize: 11.5, marginBottom: 2 }}>Deadline</div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatDate(job.applicationDeadline)}</div></div>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--pf-text-secondary)", whiteSpace: "pre-wrap" }}>{job.description}</p>
              {job.skills.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="pf-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Skills</div>
                  <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
                    {job.skills.map((s) => <Badge key={s} tone="muted">{s}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sticky-panel">
            <div className="card" style={{ padding: 20 }}>
              <h2 className="section-title" style={{ marginBottom: 12 }}>Eligibility criteria</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="pf-flex-between"><span className="pf-muted" style={{ fontSize: 13 }}>Minimum CGPA</span><span style={{ fontWeight: 700, fontSize: 13 }}>{job.eligibility.minimumCgpa || 0}</span></div>
                <div className="pf-flex-between"><span className="pf-muted" style={{ fontSize: 13 }}>Backlogs allowed</span><span style={{ fontWeight: 700, fontSize: 13 }}>{job.eligibility.backlogAllowed ? "Yes" : "No"}</span></div>
                <div className="pf-flex-between"><span className="pf-muted" style={{ fontSize: 13 }}>Departments</span><span style={{ fontWeight: 600, fontSize: 12.5, textAlign: "right" }}>{job.eligibility.eligibleDepartments.length ? job.eligibility.eligibleDepartments.join(", ") : "All"}</span></div>
                <div className="pf-flex-between"><span className="pf-muted" style={{ fontSize: 13 }}>Graduation years</span><span style={{ fontWeight: 600, fontSize: 12.5 }}>{job.eligibility.eligibleGraduationYears.length ? job.eligibility.eligibleGraduationYears.join(", ") : "All"}</span></div>
                {job.eligibility.requiredSkills.length > 0 && (
                  <div className="pf-flex-between"><span className="pf-muted" style={{ fontSize: 13 }}>Required skills</span><span style={{ fontWeight: 600, fontSize: 12.5, textAlign: "right" }}>{job.eligibility.requiredSkills.join(", ")}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Applicants */}
        <div className="card-section" style={{ marginTop: 8 }}>
          <div className="card-section-header">
            <h2 className="pf-flex-center" style={{ gap: 8 }}><Users size={16} /> Applicants ({applications.length})</h2>
            <select className="select" style={{ width: 170 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          {applications.length === 0 ? (
            <EmptyState title="No applications yet" message="When students apply, their applications will appear here." />
          ) : (
            <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>CGPA</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const student = typeof app.student === "object" && app.student ? app.student : { name: "—", email: "" }
                      return (
                        <tr key={app._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{student.name}</div>
                            <div className="pf-muted" style={{ fontSize: 12 }}>{student.email}</div>
                          </td>
                          <td>{app.studentProfile?.department || "—"}</td>
                          <td>{app.studentProfile?.cgpa ?? "—"}</td>
                          <td>{formatDate(app.appliedAt)}</td>
                          <td><ApplicationStatusBadge status={app.status} /></td>
                          <td>
                            <Link to={`/recruiter/applications/${app._id}`} className="btn btn-outline btn-sm">View</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete job" width={420}>
        <p style={{ fontSize: 13.5, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>“{job.title}”</strong>?
        </p>
        <div className="pf-gap-8" style={{ marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-md" onClick={() => setDeleteOpen(false)}>Cancel</button>
          <button className="btn btn-danger btn-md" onClick={onDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
        </div>
      </Modal>
    </>
  )
}
