import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, ArrowLeft, Banknote, Briefcase, CheckCircle, Clock, Lock, MapPin } from "lucide-react"
import { jobsApi } from "@/api/jobs"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { EmptyState, JobStatusBadge, PageLoader } from "@/components/ui"
import { formatDate, formatSalary, initials } from "@/lib/format"
import type { Job } from "@/types"

function InfoMeta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {icon}
      {children}
    </span>
  )
}

function PanelRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={{ color: "var(--pf-text-muted)", fontSize: 12, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--pf-text)", textAlign: "right" }}>{value}</span>
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: toastError } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const [eligibilityReasons, setEligibilityReasons] = useState<string[] | null>(null)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    jobsApi
      .get(id)
      .then((data) => {
        if (!active) return
        setJob(data.job)
        setIsEligible(data.isEligible)
        setEligibilityReasons(data.eligibilityReasons)
        if (data.applied) setApplied(true)
      })
      .catch(() => {
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const onApply = useCallback(async () => {
    if (!job) return
    setApplying(true)
    try {
      await jobsApi.apply(job._id)
      setApplied(true)
      success("Application submitted")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not submit application")
    } finally {
      setApplying(false)
    }
  }, [job, success, toastError])

  if (loading) return <PageLoader label="Loading opportunity…" />
  if (notFound || !job) {
    return (
      <EmptyState
        title="Opportunity not found"
        message="This posting may have closed or been removed."
        action={<Link to="/jobs" className="btn btn-outline btn-md">Back to opportunities</Link>}
      />
    )
  }

  return (
    <>
      <div style={{ padding: "18px 32px 0" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/jobs")}>
          <ArrowLeft size={14} /> Back to Opportunities
        </button>
      </div>

      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: "var(--pf-navy)",
                  color: "var(--pf-teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Manrope",
                  fontWeight: 800,
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {initials(job.companyName)}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, marginBottom: 6 }}>{job.title}</h1>
                <div style={{ color: "var(--pf-text-secondary)", fontSize: 15, fontWeight: 500, marginBottom: 14 }}>{job.companyName}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 13, color: "var(--pf-text-secondary)" }}>
                  <InfoMeta icon={<MapPin size={13} />}>{job.location || "Location not specified"}</InfoMeta>
                  <InfoMeta icon={<Briefcase size={13} />}>{job.employmentType}</InfoMeta>
                  <InfoMeta icon={<Banknote size={13} />}>{formatSalary(job.salary)}</InfoMeta>
                  <InfoMeta icon={<Clock size={13} />}>Deadline: {formatDate(job.applicationDeadline)}</InfoMeta>
                  <InfoMeta icon={<Briefcase size={13} />}>{job.workMode}</InfoMeta>
                </div>
              </div>
            </div>
            <div className="pf-gap-8" style={{ marginTop: 18, flexWrap: "wrap" }}>
              <JobStatusBadge status={job.status} />
            </div>
          </div>

          <div className="card" style={{ padding: "24px 28px" }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>About the Role</h2>
            <p style={{ color: "var(--pf-text-secondary)", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {job.description || "No description provided."}
            </p>
          </div>

          <div className="card" style={{ padding: "24px 28px" }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>Required Skills</h2>
            {job.skills.length > 0 ? (
              <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
                {job.skills.map((s) => (
                  <span key={s} className="skill-chip-navy">{s}</span>
                ))}
              </div>
            ) : (
              <span className="pf-muted" style={{ fontSize: 13 }}>No specific skills listed.</span>
            )}
          </div>
        </div>

        {/* Sticky side panel */}
        <div className="sticky-panel">
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ background: "var(--pf-navy)", padding: "20px 22px" }}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Package
              </div>
              <div style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>
                {formatSalary(job.salary)}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                {job.employmentType} · {job.workMode}
              </div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <PanelRow label={<><Clock size={13} /> Deadline</>} value={formatDate(job.applicationDeadline)} />
                <PanelRow label={<><MapPin size={13} /> Location</>} value={job.location || "—"} />
              </div>

              <div style={{ borderTop: "1px solid var(--pf-border)", paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)", marginBottom: 8 }}>Eligibility</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <PanelRow label="Minimum CGPA" value={job.eligibility.minimumCgpa || 0} />
                  <PanelRow label="Backlogs allowed" value={job.eligibility.backlogAllowed ? "Yes" : "No"} />
                  <PanelRow
                    label="Departments"
                    value={job.eligibility.eligibleDepartments.length ? job.eligibility.eligibleDepartments.join(", ") : "All"}
                  />
                  <PanelRow
                    label="Grad years"
                    value={job.eligibility.eligibleGraduationYears.length ? job.eligibility.eligibleGraduationYears.join(", ") : "All"}
                  />
                  {job.eligibility.requiredSkills.length > 0 && (
                    <PanelRow label="Required skills" value={job.eligibility.requiredSkills.join(", ")} />
                  )}
                </div>
              </div>

              {isEligible === false && eligibilityReasons && eligibilityReasons.length > 0 && (
                <div style={{ borderTop: "1px solid var(--pf-border)", paddingTop: 16, marginBottom: 16 }}>
                  {eligibilityReasons.map((r) => (
                    <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6, fontSize: 12, color: "var(--pf-danger)", lineHeight: 1.4 }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                      {r}
                    </div>
                  ))}
                </div>
              )}

              {applied ? (
                <div style={{ textAlign: "center", padding: "12px", background: "var(--pf-teal-soft)", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--pf-teal)", fontWeight: 700, fontSize: 14 }}>
                    <CheckCircle size={15} /> Application Submitted
                  </div>
                  <div style={{ color: "var(--pf-text-secondary)", fontSize: 12, marginTop: 4 }}>Track status in My Applications</div>
                </div>
              ) : isEligible === false ? (
                <div style={{ textAlign: "center", padding: "12px", background: "var(--pf-surface-elevated)", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--pf-text-muted)", fontWeight: 600, fontSize: 13 }}>
                    <Lock size={14} /> Not Eligible
                  </div>
                  <div style={{ color: "var(--pf-text-muted)", fontSize: 12, marginTop: 4 }}>
                    You don't meet the eligibility criteria for this role.
                  </div>
                </div>
              ) : user?.role !== "student" ? (
                <div style={{ textAlign: "center", padding: "12px", background: "var(--pf-surface-elevated)", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--pf-text-muted)", fontWeight: 600, fontSize: 13 }}>
                    <Lock size={14} /> Sign in as a student to apply
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => void onApply()} disabled={applying}>
                  {applying ? "Applying…" : "Apply Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
