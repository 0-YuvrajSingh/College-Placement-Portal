import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { CheckCircle, Download, FileText, GraduationCap, Plus, Trash2, Upload } from "lucide-react"
import { studentApi, type StudentProfilePayload } from "@/api/student"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError, downloadWithAuth } from "@/lib/api"
import { EmptyState, Field, Modal, SkillInput, Spinner } from "@/components/ui"
import { DEPARTMENTS, GRADUATION_YEARS, SEMESTERS, STUDENT_YEARS } from "@/lib/constants"
import type { EducationEntry, Resume, StudentProfile } from "@/types"

interface FormState {
  name: string
  email: string
  phone: string
  rollNumber: string
  registrationNumber: string
  college: string
  course: string
  department: string
  year: string
  semester: string
  cgpa: string
  graduationYear: string
  hasActiveBacklogs: boolean
  skills: string[]
  education: EducationEntry[]
}

function fromProfile(p: StudentProfile): FormState {
  return {
    name: p.name || "",
    email: p.email || "",
    phone: p.phone || "",
    rollNumber: p.rollNumber || "",
    registrationNumber: p.registrationNumber || "",
    college: p.college || "",
    course: p.course || "",
    department: p.department || "",
    year: p.year ? String(p.year) : "4",
    semester: p.semester ? String(p.semester) : "8",
    cgpa: p.cgpa != null ? String(p.cgpa) : "",
    graduationYear: p.graduationYear ? String(p.graduationYear) : String(new Date().getFullYear()),
    hasActiveBacklogs: p.hasActiveBacklogs ?? false,
    skills: p.skills || [],
    education: p.education || [],
  }
}

function emptyForm(): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    rollNumber: "",
    registrationNumber: "",
    college: "",
    course: "",
    department: "",
    year: "4",
    semester: "8",
    cgpa: "",
    graduationYear: String(new Date().getFullYear()),
    hasActiveBacklogs: false,
    skills: [],
    education: [],
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-section">
      <div className="card-section-header">
        <h2>{title}</h2>
      </div>
      <div className="card-section-body">{children}</div>
    </div>
  )
}

export default function Profile() {
  const { refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const [form, setForm] = useState<FormState | null>(null)
  const [hasProfile, setHasProfile] = useState(true)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmDeleteResume, setConfirmDeleteResume] = useState(false)
  const [deletingResume, setDeletingResume] = useState(false)

  useEffect(() => {
    let active = true
    studentApi
      .getProfile()
      .then(({ profile }) => {
        if (!active) return
        setHasProfile(true)
        setResume(profile.resume)
        setForm(fromProfile(profile))
      })
      .catch((err) => {
        if (!active) return
        if (err instanceof ApiError && (err.code === "PROFILE_NOT_FOUND" || err.status === 404)) {
          setHasProfile(false)
          setForm(emptyForm())
        } else {
          setLoadError(err instanceof ApiError ? err.message : "Could not load profile")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const set = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const setEducation = useCallback(
    (idx: number, patch: Partial<EducationEntry>) => {
      setForm((prev) => {
        if (!prev) return prev
        const education = prev.education.map((e, i) => (i === idx ? { ...e, ...patch } : e))
        return { ...prev, education }
      })
    },
    [],
  )

  const addEducation = useCallback(() => {
    setForm((prev) =>
      prev
        ? { ...prev, education: [...prev.education, { degree: "", institution: "", startYear: undefined, endYear: undefined, percentage: undefined }] }
        : prev,
    )
  }, [])

  const removeEducation = useCallback((idx: number) => {
    setForm((prev) => (prev ? { ...prev, education: prev.education.filter((_, i) => i !== idx) } : prev))
  }, [])

  const profilePct = useMemo(() => {
    if (!form) return 0
    const sections = [
      !!(form.name.trim() && form.phone.trim()),
      !!(form.department && form.cgpa !== "" && form.graduationYear),
      form.skills.length > 0,
      !!resume,
    ]
    return Math.round((sections.filter(Boolean).length / sections.length) * 100)
  }, [form, resume])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    if (!form.name.trim() || !form.phone.trim() || !form.department || !form.cgpa) {
      toastError("Name, phone, department and CGPA are required")
      return
    }
    const payload: StudentProfilePayload = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim(),
      rollNumber: form.rollNumber.trim() || undefined,
      registrationNumber: form.registrationNumber.trim() || undefined,
      college: form.college.trim() || undefined,
      course: form.course.trim() || undefined,
      department: form.department,
      year: Number(form.year),
      semester: Number(form.semester),
      cgpa: Number(form.cgpa),
      graduationYear: Number(form.graduationYear),
      hasActiveBacklogs: form.hasActiveBacklogs,
      skills: form.skills,
      education: form.education.filter((ed) => ed.degree || ed.institution),
    }
    setSaving(true)
    try {
      const { profile } = hasProfile
        ? await studentApi.updateProfile(payload)
        : await studentApi.createProfile(payload)
      setHasProfile(true)
      setResume(profile.resume)
      setForm(fromProfile(profile))
      await refreshProfile()
      success("Profile saved")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  const onUpload = async (file: File) => {
    setUploading(true)
    try {
      const { resume: uploaded } = await studentApi.uploadResume(file)
      setResume(uploaded)
      success("Resume uploaded")
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Resume upload failed")
    } finally {
      setUploading(false)
    }
  }

  const onDeleteResume = async () => {
    setDeletingResume(true)
    try {
      await studentApi.deleteResume()
      setResume(null)
      setConfirmDeleteResume(false)
      success("Resume removed")
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not delete resume")
    } finally {
      setDeletingResume(false)
    }
  }

  if (loading) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <Spinner size={26} />
          <span className="pf-muted">Loading profile…</span>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <EmptyState
        title="Could not load profile"
        message={loadError}
        action={<button className="btn btn-outline btn-md" onClick={() => window.location.reload()}>Retry</button>}
      />
    )
  }

  if (!form) return null

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Career Profile</h1>
        <p className="page-subtitle">Keep your profile up to date to improve visibility with recruiters.</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          <div>
            <Section title="Personal Information">
              <div className="grid-2">
                <Field label="Full name *">
                  <input className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input className="input" type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} />
                </Field>
                <Field label="Phone *">
                  <input className="input" value={form.phone} onChange={(e) => set({ phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 15) })} placeholder="10-15 digits" />
                </Field>
                <Field label="Roll number">
                  <input className="input" value={form.rollNumber} onChange={(e) => set({ rollNumber: e.target.value })} placeholder="e.g. 21CS001" />
                </Field>
                <Field label="Registration number">
                  <input className="input" value={form.registrationNumber} onChange={(e) => set({ registrationNumber: e.target.value })} />
                </Field>
                <Field label="College / Institution">
                  <input className="input" value={form.college} onChange={(e) => set({ college: e.target.value })} placeholder="e.g. NITK Surathkal" />
                </Field>
              </div>
            </Section>

            <Section title="Academic Information">
              <div className="grid-3">
                <Field label="Department *">
                  <select className="select" value={form.department} onChange={(e) => set({ department: e.target.value })}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Course">
                  <input className="input" value={form.course} onChange={(e) => set({ course: e.target.value })} placeholder="e.g. B.Tech" />
                </Field>
                <Field label="Year *">
                  <select className="select" value={form.year} onChange={(e) => set({ year: e.target.value })}>
                    {STUDENT_YEARS.map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Semester *">
                  <select className="select" value={form.semester} onChange={(e) => set({ semester: e.target.value })}>
                    {SEMESTERS.map((s) => (
                      <option key={s} value={String(s)}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="CGPA *">
                  <input className="input" type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={(e) => set({ cgpa: e.target.value })} />
                </Field>
                <Field label="Graduation year *">
                  <select className="select" value={form.graduationYear} onChange={(e) => set({ graduationYear: e.target.value })}>
                    {GRADUATION_YEARS.map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Active backlogs">
                  <select className="select" value={String(form.hasActiveBacklogs)} onChange={(e) => set({ hasActiveBacklogs: e.target.value === "true" })}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
            </Section>

            <Section title="Education">
              {form.education.length === 0 ? (
                <p className="pf-muted" style={{ fontSize: 13, marginBottom: 16 }}>No education entries added yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
                  {form.education.map((ed, i) => (
                    <div key={i} style={{ border: "1px solid var(--pf-border)", borderRadius: 8, padding: 16, position: "relative" }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ position: "absolute", top: 10, right: 10, color: "var(--pf-danger)" }}
                        onClick={() => removeEducation(i)}
                        aria-label="Remove education entry"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div className="grid-2">
                        <Field label="Degree">
                          <input className="input" value={ed.degree || ""} onChange={(e) => setEducation(i, { degree: e.target.value })} placeholder="e.g. B.Tech CSE" />
                        </Field>
                        <Field label="Institution">
                          <input className="input" value={ed.institution || ""} onChange={(e) => setEducation(i, { institution: e.target.value })} />
                        </Field>
                        <Field label="Start year">
                          <input className="input" type="number" value={ed.startYear ?? ""} onChange={(e) => setEducation(i, { startYear: e.target.value ? Number(e.target.value) : undefined })} />
                        </Field>
                        <Field label="End year">
                          <input className="input" type="number" value={ed.endYear ?? ""} onChange={(e) => setEducation(i, { endYear: e.target.value ? Number(e.target.value) : undefined })} />
                        </Field>
                        <Field label="Percentage / CGPA">
                          <input className="input" type="number" step="0.1" value={ed.percentage ?? ""} onChange={(e) => setEducation(i, { percentage: e.target.value ? Number(e.target.value) : undefined })} />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" className="btn btn-outline btn-md" onClick={addEducation}>
                <Plus size={14} /> Add education
              </button>
            </Section>

            <Section title="Skills">
              <SkillInput value={form.skills} onChange={(skills) => set({ skills })} />
            </Section>

            <Section title="Resume">
              {resume ? (
                <div className="pf-flex-center" style={{ justifyContent: "flex-start", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--pf-teal-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={22} style={{ color: "var(--pf-teal)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume.originalname}</div>
                    <div style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>
                      {resume.mimetype.replace(/^application\//, "").toUpperCase()} · {Math.round(resume.size / 1024)} KB
                    </div>
                    <div className="pf-flex-center" style={{ justifyContent: "flex-start", color: "var(--pf-success)", fontSize: 12, fontWeight: 600, marginTop: 3 }}>
                      <CheckCircle size={12} /> Profile ready for applications
                    </div>
                  </div>
                  <div className="pf-gap-8">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => void downloadWithAuth(resume.path, resume.originalname)}>
                      <Download size={13} /> Download
                    </button>
                    <label className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                      {uploading ? "Uploading…" : "Replace"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        style={{ display: "none" }}
                        disabled={uploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) void onUpload(f)
                          e.target.value = ""
                        }}
                      />
                    </label>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--pf-danger)" }} onClick={() => setConfirmDeleteResume(true)}>
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  style={{
                    border: "2px dashed var(--pf-border)",
                    borderRadius: 8,
                    padding: "28px",
                    textAlign: "center",
                    display: "block",
                    cursor: "pointer",
                    transition: "border-color 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--pf-teal)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--pf-border)"}
                >
                  <Upload size={24} style={{ color: "var(--pf-text-muted)", marginBottom: 12 }} />
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{uploading ? "Uploading…" : "Upload your resume"}</div>
                  <div style={{ fontSize: 13, color: "var(--pf-text-muted)", marginBottom: 14 }}>PDF, DOC or DOCX · max 5MB</div>
                  <span className="btn btn-primary btn-sm">{uploading ? "Uploading…" : "Choose file"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf"
                    style={{ display: "none" }}
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) void onUpload(f)
                      e.target.value = ""
                    }}
                  />
                </label>
              )}
            </Section>

            <div className="pf-gap-8" style={{ marginTop: 4 }}>
              <button className="btn btn-primary btn-md" type="submit" disabled={saving}>
                {saving ? <Spinner size={14} /> : null}
                {saving ? "Saving…" : hasProfile ? "Save changes" : "Create profile"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sticky-panel">
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Profile Completeness</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 32, color: profilePct >= 80 ? "var(--pf-teal)" : "var(--pf-amber)" }}>
                  {profilePct}%
                </span>
                <span style={{ fontSize: 12, color: "var(--pf-text-muted)" }}>complete</span>
              </div>
              <div style={{ height: 6, background: "var(--pf-surface-elevated)", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${profilePct}%`, background: profilePct >= 80 ? "var(--pf-teal)" : "var(--pf-amber)", borderRadius: 3, transition: "width 0.4s" }} />
              </div>
              {[
                { label: "Personal Info", done: !!(form.name.trim() && form.phone.trim()) },
                { label: "Academic Details", done: !!(form.department && form.cgpa !== "" && form.graduationYear) },
                { label: "Skills Added", done: form.skills.length > 0 },
                { label: "Resume Uploaded", done: !!resume },
              ].map((sec) => (
                <div key={sec.label} className="pf-flex-center" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
                  <CheckCircle size={14} style={{ color: sec.done ? "var(--pf-teal)" : "var(--pf-border-strong)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: sec.done ? "var(--pf-text)" : "var(--pf-text-muted)" }}>{sec.label}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div className="pf-flex-center" style={{ justifyContent: "flex-start", fontFamily: "Manrope", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                <GraduationCap size={15} style={{ color: "var(--pf-teal)" }} /> Placement Status
              </div>
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 5,
                    background: hasProfile ? "var(--pf-teal-soft)" : "var(--pf-surface-elevated)",
                    color: hasProfile ? "#0d9488" : "var(--pf-text-secondary)",
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {hasProfile ? "Active" : "Profile pending"}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>
                {hasProfile
                  ? "You are active in the current placement season. Keep your details accurate."
                  : "Complete your profile to start applying to opportunities."}
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal open={confirmDeleteResume} onClose={() => setConfirmDeleteResume(false)} title="Remove resume" width={420}>
        <p style={{ fontSize: 13.5, color: "var(--pf-text-secondary)", lineHeight: 1.6 }}>
          Are you sure you want to remove your resume? You can upload a new one anytime.
        </p>
        <div className="pf-gap-8" style={{ marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-md" onClick={() => setConfirmDeleteResume(false)}>Cancel</button>
          <button className="btn btn-danger btn-md" onClick={() => void onDeleteResume()} disabled={deletingResume}>
            {deletingResume ? "Removing…" : "Remove resume"}
          </button>
        </div>
      </Modal>
    </>
  )
}
