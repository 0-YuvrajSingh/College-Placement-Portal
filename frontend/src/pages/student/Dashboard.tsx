import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Upload,
  User,
} from "lucide-react"
import { jobsApi } from "@/api/jobs"
import { studentApi } from "@/api/student"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/lib/api"
import { ApplicationStatusBadge, EmptyState, MetricStrip, PageLoader } from "@/components/ui"
import { deadlineStatus, formatDate, formatSalary, initials } from "@/lib/format"
import type { Application, JobListItem, StudentProfile } from "@/types"

function isClosingSoon(deadline?: string): boolean {
  if (!deadline) return false
  const ms = new Date(deadline).getTime() - Date.now()
  return ms > 0 && ms <= 7 * 24 * 60 * 60 * 1000
}

function CompanyMark({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        background: "var(--pf-navy)",
        color: "var(--pf-teal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Manrope",
        fontWeight: 800,
        fontSize: 11,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const student = profile as StudentProfile | null

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [jobRes, appRes] = await Promise.all([
        jobsApi.list({ eligible: true, limit: 50 }),
        studentApi.myApplications({ page: 1, limit: 50 }),
      ])
      setJobs(jobRes.data)
      setApps(appRes.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const openings = useMemo(() => jobs.filter((j) => !j.applied), [jobs])
  const closing = useMemo(() => jobs.filter((j) => isClosingSoon(j.applicationDeadline)), [jobs])
  const recommended = useMemo(() => openings.slice(0, 3), [openings])
  const recentApps = useMemo(() => apps.slice(0, 5), [apps])
  const inProgress = useMemo(() => apps.filter((a) => a.status === "SHORTLISTED").length, [apps])

  const sections = useMemo(
    () => [
      { label: "Personal Info", done: !!(student?.name && student?.phone) },
      { label: "Academic Details", done: !!(student?.department && student?.cgpa && student?.graduationYear) },
      { label: "Skills", done: !!student && student.skills.length > 0 },
      { label: "Resume Uploaded", done: !!student?.resume },
    ],
    [student],
  )
  const profilePct = sections.length
    ? Math.round((sections.filter((s) => s.done).length / sections.length) * 100)
    : 0

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

  const displayName = student?.name || user?.name || "there"

  return (
    <>
      <div className="page-header">
        <div className="pf-flex-between">
          <div>
            <h1 className="page-title">Good morning, {displayName.split(" ")[0]}.</h1>
            <p className="page-subtitle">Here's your placement overview for today.</p>
          </div>
        </div>
      </div>

      <MetricStrip
        items={[
          { label: "Eligible Openings", value: openings.length, icon: <Briefcase size={16} />, color: "var(--pf-teal)" },
          { label: "Applications Sent", value: apps.length, icon: <FileText size={16} />, color: "var(--pf-navy)" },
          { label: "In Progress", value: inProgress, icon: <TrendingUp size={16} />, color: "#8b5cf6" },
          { label: "Closing Soon", value: closing.length, icon: <AlertTriangle size={16} />, color: "var(--pf-amber)" },
        ]}
      />

      <div className="page-body">
        <div className="pf-grid-7-5">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card-section">
              <div className="card-section-header">
                <h2>Recommended Opportunities</h2>
                <Link
                  to="/jobs"
                  className="pf-flex-center"
                  style={{ color: "var(--pf-teal)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recommended.length === 0 ? (
                <div className="card-section-body">
                  <EmptyState
                    title="No openings for you right now"
                    message="Check back soon — new opportunities are added regularly."
                  />
                </div>
              ) : (
                recommended.map((job, i) => (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < recommended.length - 1 ? "1px solid var(--pf-border)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "var(--pf-bg)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = ""}
                  >
                    <CompanyMark name={job.companyName} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {job.title}
                      </div>
                      <div style={{ color: "var(--pf-text-secondary)", fontSize: 12 }}>
                        {job.companyName} · {job.location || "Location not specified"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--pf-navy)" }}>{formatSalary(job.salary)}</div>
                      <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>Due {formatDate(job.applicationDeadline)}</div>
                    </div>
                    {isClosingSoon(job.applicationDeadline) && (
                      <AlertTriangle size={14} style={{ color: "var(--pf-amber)", flexShrink: 0 }} />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="card-section">
              <div className="card-section-header">
                <h2>Recent Applications</h2>
                <Link
                  to="/applications"
                  className="pf-flex-center"
                  style={{ color: "var(--pf-teal)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recentApps.length === 0 ? (
                <div className="card-section-body">
                  <EmptyState
                    title="No applications yet"
                    message="Browse jobs and submit your first application."
                    action={<Link to="/jobs" className="btn btn-primary btn-md">Browse jobs</Link>}
                  />
                </div>
              ) : (
                <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
                  <div className="table-scroll">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Role</th>
                          <th>Applied</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentApps.map((app) => {
                          const job = typeof app.job === "object" && app.job ? app.job : null
                          return (
                            <tr key={app._id}>
                              <td>
                                <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                                  <CompanyMark name={job?.companyName || "?"} />
                                  <span style={{ fontSize: 13, fontWeight: 500 }}>{job?.companyName || "—"}</span>
                                </div>
                              </td>
                              <td style={{ fontSize: 13, color: "var(--pf-text-secondary)" }}>{job?.title || "—"}</td>
                              <td style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{formatDate(app.appliedAt)}</td>
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

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="pf-flex-center" style={{ justifyContent: "flex-start", marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--pf-navy)",
                    color: "var(--pf-teal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Manrope",
                    fontWeight: 800,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {initials(displayName)[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14 }}>{displayName}</div>
                  <div style={{ color: "var(--pf-text-muted)", fontSize: 12 }}>
                    {student?.department || "—"} · CGPA {student?.cgpa ?? "—"}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div className="pf-flex-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--pf-text-secondary)", fontWeight: 600 }}>Profile Completeness</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: profilePct >= 80 ? "var(--pf-success)" : "var(--pf-amber)" }}>
                    {profilePct}%
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--pf-surface-elevated)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${profilePct}%`,
                      background: profilePct >= 80 ? "var(--pf-teal)" : "var(--pf-amber)",
                      borderRadius: 3,
                      transition: "width 0.4s",
                    }}
                  />
                </div>
              </div>

              {sections.map((sec) => (
                <div key={sec.label} className="pf-flex-center" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
                  <CheckCircle size={14} style={{ color: sec.done ? "var(--pf-teal)" : "var(--pf-border-strong)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: sec.done ? "var(--pf-text)" : "var(--pf-text-muted)" }}>{sec.label}</span>
                </div>
              ))}

              <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>
                <User size={13} /> Complete Profile
              </Link>
            </div>

            <div className="card-section">
              <div className="card-section-header">
                <h2 className="pf-flex-center" style={{ gap: 6 }}>
                  <Clock size={14} style={{ color: "var(--pf-amber)" }} /> Upcoming Deadlines
                </h2>
              </div>
              {closing.length === 0 ? (
                <div className="card-section-body" style={{ color: "var(--pf-text-muted)", fontSize: 13 }}>
                  No deadlines in the next 7 days.
                </div>
              ) : (
                closing.slice(0, 4).map((job, i) => (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    style={{
                      padding: "12px 18px",
                      borderBottom: i < Math.min(closing.length, 4) - 1 ? "1px solid var(--pf-border)" : "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "var(--pf-bg)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = ""}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>{job.companyName}</div>
                    </div>
                    <div
                      className="pf-flex-center"
                      style={{ color: "var(--pf-amber)", fontSize: 12, fontWeight: 600, flexShrink: 0 }}
                    >
                      <AlertTriangle size={12} /> {deadlineStatus(job.applicationDeadline).label}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Resume</div>
              {student?.resume ? (
                <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: "var(--pf-success-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} style={{ color: "var(--pf-success)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--pf-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {student.resume.originalname}
                    </div>
                    <div
                      className="pf-flex-center"
                      style={{ justifyContent: "flex-start", fontSize: 12, color: "var(--pf-success)", fontWeight: 600, marginTop: 2 }}
                    >
                      <CheckCircle size={11} /> Ready for applications
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: "var(--pf-text-muted)", fontSize: 13, marginBottom: 12 }}>
                    No resume uploaded yet. Upload to start applying.
                  </p>
                  <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                    <Upload size={13} /> Upload Resume
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
