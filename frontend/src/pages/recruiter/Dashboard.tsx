import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowRight, Briefcase, Plus, TrendingUp, Users } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/lib/api"
import { ApplicationStatusBadge, EmptyState, JobStatusBadge, MetricStrip, PageLoader } from "@/components/ui"
import PendingApproval from "@/components/PendingApproval"
import { useRecruiterApproval } from "@/hooks/useRecruiterApproval"
import { formatDate, formatSalary, initials, isClosingSoon } from "@/lib/format"
import type { Job, RecruiterApplication, RecruiterProfile, RecruiterStats } from "@/types"

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { pending } = useRecruiterApproval()
  const [stats, setStats] = useState<RecruiterStats | null>(null)
  const [jobs, setJobs] = useState<(Job & { applicantCount: number })[]>([])
  const [apps, setApps] = useState<RecruiterApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    if (pending) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        recruiterApi.stats(),
        recruiterApi.listJobs({ page: 1, limit: 10 }),
        recruiterApi.listApplications({ page: 1, limit: 5 }),
      ])
      setStats(statsRes)
      setJobs(jobsRes.data)
      setApps(appsRes.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load dashboard")
    } finally {
      setLoading(false)
    }
  }, [pending])

  useEffect(() => {
    void load()
  }, [load])

  if (pending) return <PendingApproval />

  if (loading) return <PageLoader label="Loading your dashboard…" />
  if (error) {
    return (
      <EmptyState
        title="Could not load dashboard"
        message={error}
        action={<button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>}
      />
    )
  }

  const company = (profile as RecruiterProfile | null)?.companyName || "Your company"
  const closingSoon = jobs.filter((j) => j.status === "OPEN" && isClosingSoon(j.applicationDeadline))
  const totalApplicants = stats?.totalApplicants ?? 0
  const pipeline = [
    { label: "Applied", count: stats?.applied ?? 0, color: "var(--pf-info)" },
    { label: "Shortlisted", count: stats?.shortlisted ?? 0, color: "var(--pf-amber)" },
    { label: "Selected", count: stats?.selected ?? 0, color: "var(--pf-success)" },
  ]

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Recruiter Dashboard</h1>
        <p className="page-subtitle">{company} — Campus Hiring {new Date().getFullYear()}</p>
      </div>

      <MetricStrip
        items={[
          { label: "Active Jobs", value: stats?.activeJobs ?? 0, icon: <Briefcase size={16} />, color: "var(--pf-teal)" },
          { label: "Total Applicants", value: stats?.totalApplicants ?? 0, icon: <Users size={16} />, color: "var(--pf-navy)" },
          { label: "Shortlisted", value: stats?.shortlisted ?? 0, icon: <TrendingUp size={16} />, color: "#8b5cf6" },
          { label: "Closing Soon", value: stats?.closingSoon ?? 0, icon: <AlertTriangle size={16} />, color: "var(--pf-amber)" },
        ]}
      />

      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Active jobs */}
          <div className="card-section">
            <div className="card-section-header">
              <h2>Active Job Postings</h2>
              <Link to="/recruiter/jobs" className="btn btn-primary btn-sm">Manage Jobs</Link>
            </div>
            {jobs.length === 0 ? (
              <div className="card-section-body">
                <EmptyState
                  title="No job postings yet"
                  message="Create your first posting to start receiving applications."
                  action={<Link to="/recruiter/jobs/new" className="btn btn-primary btn-md"><Plus size={14} /> Post a new job</Link>}
                />
              </div>
            ) : (
              <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Applicants</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id} onClick={() => navigate(`/recruiter/jobs/${job._id}`)} style={{ cursor: "pointer" }}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                            <div style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{formatSalary(job.salary)} · {job.location || "—"}</div>
                          </td>
                          <td><JobStatusBadge status={job.status} /></td>
                          <td style={{ fontSize: 13, color: isClosingSoon(job.applicationDeadline) ? "var(--pf-amber)" : "var(--pf-text-secondary)", whiteSpace: "nowrap" }}>
                            {isClosingSoon(job.applicationDeadline) && <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                            {formatDate(job.applicationDeadline)}
                          </td>
                          <td style={{ fontSize: 13, fontWeight: 700 }}>{job.applicantCount}</td>
                          <td>
                            <button
                              className="link"
                              style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/recruiter/jobs/${job._id}`)
                              }}
                            >
                              Review <ArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Recent applicants */}
          <div className="card-section">
            <div className="card-section-header">
              <h2>Recent Applicants</h2>
              <Link to="/recruiter/applications" className="link" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {apps.length === 0 ? (
              <div className="card-section-body">
                <EmptyState title="No applicants yet" message="Applications will appear here as students apply to your postings." />
              </div>
            ) : (
              <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Applied For</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map((app) => {
                        const student = typeof app.student === "object" && app.student ? app.student : { name: "—", email: "" }
                        const job = typeof app.job === "object" && app.job ? app.job : null
                        return (
                          <tr key={app._id} onClick={() => navigate(`/recruiter/applications/${app._id}`)} style={{ cursor: "pointer" }}>
                            <td>
                              <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                                <div className="pf-avatar" style={{ width: 30, height: 30, fontSize: 11, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                                  {initials(student.name)[0] || "?"}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</div>
                                  <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{student.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{app.studentProfile?.department || "—"}</td>
                            <td style={{ fontSize: 13, fontWeight: 600 }}>{app.studentProfile?.cgpa ?? "—"}</td>
                            <td style={{ fontSize: 12, color: "var(--pf-text-secondary)" }}>{job?.title || "—"}</td>
                            <td><ApplicationStatusBadge status={app.status} /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick actions */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/recruiter/jobs/new" className="btn btn-primary btn-md" style={{ width: "100%" }}><Plus size={14} /> Post a New Job</Link>
              <Link to="/recruiter/applications" className="btn btn-outline btn-md" style={{ width: "100%" }}>Review Applicants</Link>
            </div>
          </div>

          {/* Pipeline */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Applicant Pipeline</div>
            {totalApplicants === 0 ? (
              <p className="pf-muted" style={{ fontSize: 13 }}>No applications yet.</p>
            ) : (
              pipeline.map((stage) => (
                <div key={stage.label} style={{ marginBottom: 12 }}>
                  <div className="pf-flex-between" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{stage.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{stage.count}</span>
                  </div>
                  <div style={{ height: 5, background: "var(--pf-surface-elevated)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((stage.count / totalApplicants) * 100)}%`,
                        background: stage.color,
                        borderRadius: 3,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Closing soon */}
          {closingSoon.length > 0 && (
            <div style={{ background: "var(--pf-warning-soft)", border: "1px solid var(--pf-amber)", borderRadius: 8, padding: "16px 18px" }}>
              <div className="pf-flex-center" style={{ justifyContent: "flex-start", fontFamily: "Manrope", fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 10 }}>
                <AlertTriangle size={14} /> Closing Soon
              </div>
              {closingSoon.map((j) => (
                <div key={j._id} style={{ fontSize: 13, color: "#78350f", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{j.title}</span> · {formatDate(j.applicationDeadline)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
