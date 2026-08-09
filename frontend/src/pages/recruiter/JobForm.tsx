import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { recruiterApi, type JobPayload } from "@/api/recruiter"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { Field, SkillInput, Spinner } from "@/components/ui"
import { DEPARTMENTS, EMPLOYMENT_TYPES, GRADUATION_YEARS, WORK_MODES } from "@/lib/constants"
import type { Job } from "@/types"

interface FormState {
  title: string
  description: string
  companyName: string
  location: string
  employmentType: string
  workMode: string
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  skills: string[]
  minimumCgpa: string
  eligibleDepartments: string[]
  eligibleGraduationYears: number[]
  requiredSkills: string[]
  backlogAllowed: boolean
  applicationDeadline: string
  status: "DRAFT" | "OPEN"
}

function toDateInput(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fromJob(job: Job): FormState {
  return {
    title: job.title,
    description: job.description || "",
    companyName: job.companyName,
    location: job.location || "",
    employmentType: job.employmentType,
    workMode: job.workMode,
    salaryMin: job.salary?.min != null ? String(job.salary.min) : "",
    salaryMax: job.salary?.max != null ? String(job.salary.max) : "",
    salaryCurrency: job.salary?.currency || "LPA",
    skills: job.skills || [],
    minimumCgpa: job.eligibility?.minimumCgpa != null ? String(job.eligibility.minimumCgpa) : "0",
    eligibleDepartments: job.eligibility?.eligibleDepartments || [],
    eligibleGraduationYears: job.eligibility?.eligibleGraduationYears || [],
    requiredSkills: job.eligibility?.requiredSkills || [],
    backlogAllowed: job.eligibility?.backlogAllowed ?? true,
    applicationDeadline: toDateInput(job.applicationDeadline),
    status: (job.status === "OPEN" ? "OPEN" : "DRAFT") as "DRAFT" | "OPEN",
  }
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  companyName: "",
  location: "",
  employmentType: "Full-time",
  workMode: "On-site",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "LPA",
  skills: [],
  minimumCgpa: "0",
  eligibleDepartments: [],
  eligibleGraduationYears: [],
  requiredSkills: [],
  backlogAllowed: true,
  applicationDeadline: "",
  status: "DRAFT",
}

export default function JobForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const [form, setForm] = useState<FormState | null>(mode === "edit" ? null : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (mode !== "edit" || !id || form !== null) return
    let active = true
    recruiterApi
      .getJob(id)
      .then(({ job }) => {
        if (active) setForm(fromJob(job))
      })
      .catch(() => {
        if (active) {
          toastError("Could not load this job")
          navigate("/recruiter/jobs")
        }
      })
    return () => {
      active = false
    }
  }, [mode, id, form, navigate, toastError])

  if (!form) return null

  const set = (patch: Partial<FormState>) => setForm((prev) => (prev ? { ...prev, ...patch } : prev))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.companyName.trim() || !form.applicationDeadline) {
      toastError("Title, description, company name and deadline are required")
      return
    }
    const payload: JobPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      companyName: form.companyName.trim(),
      location: form.location.trim() || undefined,
      employmentType: form.employmentType,
      workMode: form.workMode,
      salary: {
        min: form.salaryMin !== "" ? Number(form.salaryMin) : undefined,
        max: form.salaryMax !== "" ? Number(form.salaryMax) : undefined,
        currency: form.salaryCurrency,
      },
      skills: form.skills,
      eligibility: {
        minimumCgpa: form.minimumCgpa !== "" ? Number(form.minimumCgpa) : 0,
        eligibleDepartments: form.eligibleDepartments,
        eligibleGraduationYears: form.eligibleGraduationYears,
        requiredSkills: form.requiredSkills,
        backlogAllowed: form.backlogAllowed,
      },
      applicationDeadline: new Date(form.applicationDeadline).toISOString(),
      status: form.status,
    }
    setSaving(true)
    try {
      if (mode === "create") {
        const { job } = await recruiterApi.createJob(payload)
        success("Job created")
        navigate(`/recruiter/jobs/${job._id}`)
      } else if (id) {
        await recruiterApi.updateJob(id, payload)
        success("Job updated")
        navigate(`/recruiter/jobs/${id}`)
      }
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not save job")
    } finally {
      setSaving(false)
    }
  }

  const toggleInList = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  return (
    <>
      <div style={{ padding: "18px 32px 0" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
      <div className="page-header">
        <h1 className="page-title">{mode === "create" ? "Post a new job" : "Edit job"}</h1>
        <p className="page-subtitle">Jobs stay a draft until you publish them for students.</p>
      </div>
      <div className="page-body">
        <form onSubmit={onSubmit} noValidate>
          <div className="card-section">
            <div className="card-section-header"><h2>Basics</h2></div>
            <div className="card-section-body">
              <div className="grid-2">
                <Field label="Job title *">
                  <input className="input" value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Software Engineer" />
                </Field>
                <Field label="Company name *">
                  <input className="input" value={form.companyName} onChange={(e) => set({ companyName: e.target.value })} />
                </Field>
                <Field label="Location">
                  <input className="input" value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Bengaluru, Remote" />
                </Field>
                <Field label="Application deadline *">
                  <input className="input" type="date" value={form.applicationDeadline} min={toDateInput(new Date().toISOString())} onChange={(e) => set({ applicationDeadline: e.target.value })} />
                </Field>
                <Field label="Employment type">
                  <select className="select" value={form.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Work mode">
                  <select className="select" value={form.workMode} onChange={(e) => set({ workMode: e.target.value })}>
                    {WORK_MODES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid-2" style={{ marginTop: 16 }}>
                <Field label="Salary (min)">
                  <input className="input" type="number" min="0" value={form.salaryMin} onChange={(e) => set({ salaryMin: e.target.value })} placeholder="e.g. 8" />
                </Field>
                <Field label="Salary (max)">
                  <input className="input" type="number" min="0" value={form.salaryMax} onChange={(e) => set({ salaryMax: e.target.value })} placeholder="e.g. 14" />
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <Field label="Salary currency">
                  <select className="select" value={form.salaryCurrency} onChange={(e) => set({ salaryCurrency: e.target.value })}>
                    <option value="LPA">LPA (lakhs per annum)</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <Field label="Job description *">
                  <textarea className="textarea" value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="Describe the role, responsibilities and what you're looking for…" />
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="field-label">Skills</label>
                <SkillInput value={form.skills} onChange={(skills) => set({ skills })} placeholder="Add a skill and press Enter" />
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="card-section-header"><h2>Eligibility criteria</h2></div>
            <div className="card-section-body">
              <div className="grid-2">
                <Field label="Minimum CGPA">
                  <input className="input" type="number" step="0.1" min="0" max="10" value={form.minimumCgpa} onChange={(e) => set({ minimumCgpa: e.target.value })} />
                </Field>
                <Field label="Active backlogs allowed">
                  <select className="select" value={String(form.backlogAllowed)} onChange={(e) => set({ backlogAllowed: e.target.value === "true" })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 18 }}>
                <label className="field-label">Eligible departments (empty = all)</label>
                <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
                  {DEPARTMENTS.map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={form.eligibleDepartments.includes(d) ? "chip chip-active" : "chip"}
                      onClick={() => set({ eligibleDepartments: toggleInList(form.eligibleDepartments, d) })}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <label className="field-label">Eligible graduation years (empty = all)</label>
                <div className="pf-gap-8" style={{ flexWrap: "wrap" }}>
                  {GRADUATION_YEARS.map((y) => (
                    <button
                      type="button"
                      key={y}
                      className={form.eligibleGraduationYears.includes(y) ? "chip chip-active" : "chip"}
                      onClick={() => set({ eligibleGraduationYears: toggleInList(form.eligibleGraduationYears, y) })}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <label className="field-label">Required skills</label>
                <SkillInput value={form.requiredSkills} onChange={(skills) => set({ requiredSkills: skills })} placeholder="Skills students must have" />
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="card-section-header"><h2>Publication</h2></div>
            <div className="card-section-body">
              <Field label="Save as">
                <select className="select" value={form.status} onChange={(e) => set({ status: e.target.value as "DRAFT" | "OPEN" })}>
                  <option value="DRAFT">Draft (hidden from students)</option>
                  <option value="OPEN">Open (visible & applying)</option>
                </select>
              </Field>
              <div className="pf-gap-8" style={{ marginTop: 22 }}>
                <button className="btn btn-primary btn-md" type="submit" disabled={saving}>
                  {saving ? <Spinner size={14} /> : null}
                  {saving ? "Saving…" : mode === "create" ? "Create job" : "Save changes"}
                </button>
                <button className="btn btn-ghost btn-md" type="button" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
