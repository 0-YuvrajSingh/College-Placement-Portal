import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { adminApi } from "@/api/admin"
import { ApiError } from "@/lib/api"
import { EmptyState, PageLoader } from "@/components/ui"
import { formatDate, initials } from "@/lib/format"
import type { AdminStats, AdminUserRow } from "@/types"

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [students, setStudents] = useState<AdminUserRow[]>([])
  const [recruiters, setRecruiters] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [statsRes, studentsRes, recruitersRes] = await Promise.all([
        adminApi.stats(),
        adminApi.listStudents({ page: 1, limit: 5 }),
        adminApi.listRecruiters({ page: 1, limit: 5 }),
      ])
      setStats(statsRes)
      setStudents(studentsRes.data)
      setRecruiters(recruitersRes.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <PageLoader label="Loading admin console…" />
  if (error || !stats) {
    return (
      <EmptyState
        title="Could not load dashboard"
        message={error || "Something went wrong."}
        action={<button className="btn btn-outline btn-md" onClick={() => void load()}>Retry</button>}
      />
    )
  }

  const placementRate = stats.totalStudents ? Math.round((stats.placedStudents / stats.totalStudents) * 100) : 0
  const pulse = [
    { val: stats.totalStudents, label: "Registered Students", color: "#fff" },
    { val: stats.placedStudents, label: "Students Placed", color: "var(--pf-teal)" },
    { val: `${placementRate}%`, label: "Placement Rate", color: "var(--pf-amber)" },
    { val: stats.activeRecruiters, label: "Active Companies", color: "#fff" },
  ]
  const pipeline = [
    { label: "Applied", val: stats.totalApplications, color: "var(--pf-info)" },
    { label: "Shortlisted", val: stats.shortlistedApplications, color: "var(--pf-amber)" },
    { label: "Selected", val: stats.selectedApplications, color: "var(--pf-success)" },
  ]
  const foot = [
    { label: "Total Jobs Posted", val: stats.totalJobs },
    { label: "Open Jobs", val: stats.openJobs },
    { label: "Total Applications", val: stats.totalApplications },
  ]

  const statusBadge = (active: boolean, placed = false) => {
    const label = placed ? "Placed" : active ? "Active" : "Inactive"
    const color = placed ? "var(--pf-success)" : active ? "var(--pf-teal)" : "var(--pf-text-muted)"
    return <span style={{ color, fontSize: 12, fontWeight: 600 }}>{label}</span>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Admin Console</h1>
        <p className="page-subtitle">Placement Season {new Date().getFullYear() - 1}–{String(new Date().getFullYear()).slice(2)}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 20, marginBottom: 20 }}>
        {/* Placement pulse */}
        <div style={{ background: "var(--pf-navy)", borderRadius: 8, padding: "24px 28px", color: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Placement Pulse</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {pulse.map((s) => (
              <div key={s.label} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontFamily: "'Manrope'", fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div className="card" style={{ padding: "24px 28px" }}>
          <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Recruitment Pipeline</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {pipeline.map((s) => {
              const pct = s.val ? Math.round((s.val / stats.totalApplications) * 100) : 0
              return (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Manrope'", fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "var(--pf-text-muted)", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ height: 4, background: "var(--pf-surface-elevated)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 2 }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--pf-border)", paddingTop: 16 }}>
            {foot.map((s, i) => (
              <div key={s.label} style={{ padding: "0 16px", borderLeft: i > 0 ? "1px solid var(--pf-border)" : "none" }}>
                <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 18 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--pf-text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent students */}
        <div className="card-section">
          <div className="card-section-header">
            <h2>Recent Students</h2>
            <Link to="/admin/students" className="link" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              All students <ArrowRight size={11} />
            </Link>
          </div>
          {students.length === 0 ? (
            <div className="card-section-body"><p className="pf-muted" style={{ fontSize: 13 }}>No students registered yet.</p></div>
          ) : (
            <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Branch</th>
                      <th>CGPA</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "var(--pf-text-muted)" }}>{s.email}</div>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--pf-text-secondary)" }}>{s.studentProfile?.department || "—"}</td>
                        <td style={{ fontSize: 13, fontWeight: 600 }}>{s.studentProfile?.cgpa ?? "—"}</td>
                        <td>{statusBadge(s.isActive, s.studentProfile?.isPlaced)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent recruiters */}
        <div className="card-section">
          <div className="card-section-header">
            <h2>Companies</h2>
            <Link to="/admin/recruiters" className="link" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              All companies <ArrowRight size={11} />
            </Link>
          </div>
          {recruiters.length === 0 ? (
            <div className="card-section-body"><p className="pf-muted" style={{ fontSize: 13 }}>No companies registered yet.</p></div>
          ) : (
            <div className="table-wrap" style={{ border: "none", borderTop: "1px solid var(--pf-border)", borderRadius: 0 }}>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruiters.map((r) => {
                      const company = r.recruiterProfile?.companyName || r.name
                      return (
                        <tr key={r._id}>
                          <td>
                            <div className="pf-flex-center" style={{ justifyContent: "flex-start" }}>
                              <div className="pf-avatar" style={{ width: 30, height: 30, fontSize: 11, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none" }}>
                                {initials(company)[0] || "?"}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{company}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: 12, color: "var(--pf-text-secondary)" }}>{r.name}</td>
                          <td style={{ fontSize: 12, color: "var(--pf-text-muted)", whiteSpace: "nowrap" }}>{formatDate(r.createdAt)}</td>
                          <td>{statusBadge(r.isActive)}</td>
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
    </>
  )
}
