import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle, FileText } from "lucide-react"
import { recruiterApi } from "@/api/recruiter"
import { ApiError } from "@/lib/api"
import StatusActions from "@/components/StatusActions"
import { ApplicationStatusBadge, EmptyState, PageLoader } from "@/components/ui"
import { formatDate, initials } from "@/lib/format"
import type { ApplicationStatus, RecruiterApplication } from "@/types"

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState<RecruiterApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError("")
    try {
      const res = await recruiterApi.getApplication(id)
      setApp(res)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load application")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <PageLoader label="Loading application…" />
  if (!app) {
    return (
      <EmptyState
        title="Application not found"
        message={error || "This application may have been removed."}
        action={<button className="btn btn-outline btn-md" onClick={() => navigate("/recruiter/applications")}>Back to applicants</button>}
      />
    )
  }

  const student = app.student
  const job = typeof app.job === "object" && app.job ? app.job : null
  const profile = app.studentProfile
  const resumeName = app.resumeSnapshot?.originalName || `${student.name.replace(/\s+/g, "_")}_resume.pdf`

  const updateStatus = async (next: ApplicationStatus, remarks?: string) => {
    await recruiterApi.updateApplicationStatus(app._id, next, remarks)
    await load()
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate("/recruiter/applications")}>
        <ArrowLeft size={14} /> Back to Applicants
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Identity */}
          <div className="card" style={{ padding: "24px 28px" }}>
            <div className="pf-flex-center" style={{ justifyContent: "flex-start", alignItems: "flex-start", gap: 16 }}>
              <div className="pf-avatar" style={{ width: 56, height: 56, fontSize: 20, background: "var(--pf-navy)", color: "var(--pf-teal)", border: "none", flexShrink: 0 }}>
                {initials(student.name)[0] || "?"}
              </div>
              <div>
                <h1 style={{ fontFamily: "'Manrope'", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{student.name}</h1>
                <div style={{ color: "var(--pf-text-secondary)", fontSize: 14, marginBottom: 8 }}>{student.email}</div>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </div>
          </div>

          {/* Academic summary */}
          <div className="card" style={{ padding: "20px 28px" }}>
            <h2 style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Academic Summary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Branch", val: profile?.department || "—" },
                { label: "CGPA", val: profile?.cgpa != null ? String(profile.cgpa) : "—" },
                { label: "Graduation Year", val: profile?.graduationYear != null ? String(profile.graduationYear) : "—" },
                { label: "Institution", val: profile?.college || "—" },
                { label: "Backlogs", val: profile?.hasActiveBacklogs ? "Yes" : "No" },
                { label: "Placed", val: profile?.isPlaced ? "Yes" : "No" },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: "20px 28px" }}>
            <h2 style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Skills</h2>
            {profile?.skills?.length ? (
              <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
                {profile.skills.map((s) => (
                  <span key={s} style={{ padding: "5px 12px", borderRadius: 4, background: "var(--pf-navy)", color: "var(--pf-teal)", fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            ) : (
              <p className="pf-muted" style={{ fontSize: 13 }}>No skills listed.</p>
            )}
          </div>

          {/* Resume */}
          <div className="card" style={{ padding: "20px 28px" }}>
            <h2 style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Resume</h2>
            <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--pf-teal-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={20} style={{ color: "var(--pf-teal)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{resumeName}</div>
                <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 4, color: "var(--pf-success)", fontSize: 12, fontWeight: 600, marginTop: 3 }}>
                  <CheckCircle size={12} /> Attached with application
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => void recruiterApi.applicationResume(app._id, resumeName)}>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Status panel */}
        <div className="card" style={{ position: "sticky", top: 24, overflow: "hidden", padding: 0 }}>
          <div style={{ background: "var(--pf-navy)", padding: "18px 20px" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Application for</div>
            <div style={{ color: "#fff", fontFamily: "'Manrope'", fontWeight: 700, fontSize: 15 }}>{job?.title || "Job"}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>
              {job?.companyName} · Applied {formatDate(app.appliedAt)}
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pf-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Status</div>
              <ApplicationStatusBadge status={app.status} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Update Status</div>
              <StatusActions compact status={app.status} onStatusChange={updateStatus} />
              {app.status === "WITHDRAWN" && (
                <p className="pf-muted" style={{ fontSize: 12, marginTop: 12 }}>This student withdrew their application.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
