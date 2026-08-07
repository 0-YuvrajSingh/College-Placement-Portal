import type { ReactNode } from "react"
import Button from "./ui/Button"
import { Input, Select, Textarea } from "./ui/Field"
import { IconUser, IconBuilding, IconSkills, IconUpload } from "./ui/Icons"

export interface ProfileData {
  name: string
  email: string
  phone: string
  dept: string
  year: string
  semester: string
  cgpa: string
  skills: string
  bio: string
}

interface ProfileFormProps {
  data: ProfileData
  errors?: Record<string, string>
  onChange: (field: keyof ProfileData, value: string) => void
  onSubmit: () => void
  onCancel: () => void
  onReset?: () => void
  submitLabel: string
  saving?: boolean
  showResumeSection?: boolean
  onOpenResume?: () => void
}

const DEPTS = [
  "Computer Science Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
]
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
const SEMESTERS = [
  "Sem I",
  "Sem II",
  "Sem III",
  "Sem IV",
  "Sem V",
  "Sem VI",
  "Sem VII",
  "Sem VIII",
]

export default function ProfileForm({
  data,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  onReset,
  submitLabel,
  saving,
  showResumeSection,
  onOpenResume,
}: ProfileFormProps) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-header">
        <h2 className="h4" style={{ marginBottom: 4 }}>
          Profile Details
        </h2>
        <p
          className="small"
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          Fill in your details to keep your student profile complete.
        </p>
      </div>

      <div className="card-section">
        <SectionTitle
          icon={<IconUser size={16} />}
          title="Personal Information"
        />
        <div className="grid-two">
          <Input
            label="Full Name"
            placeholder="Arjun Kumar"
            value={data.name}
            onChange={(v) => onChange("name", v)}
            error={errors.name}
          />
          <Input
            label="Email Address"
            placeholder="arjun@college.edu"
            type="email"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            error={errors.email}
          />
        </div>
        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          error={errors.phone}
          help="10-15 digits"
        />
      </div>

      <div className="card-divider" />

      <div className="card-section">
        <SectionTitle
          icon={<IconBuilding size={16} />}
          title="Academic Information"
        />
        <Select
          label="Department"
          placeholder="Select department"
          value={data.dept}
          onChange={(v) => onChange("dept", v)}
          options={DEPTS}
          error={errors.dept}
        />
        <div className="grid-three" style={{ marginTop: 14 }}>
          <Select
            label="Year"
            placeholder="Select year"
            value={data.year}
            onChange={(v) => onChange("year", v)}
            options={YEARS}
            error={errors.year}
          />
          <Select
            label="Semester"
            placeholder="Select semester"
            value={data.semester}
            onChange={(v) => onChange("semester", v)}
            options={SEMESTERS}
            error={errors.semester}
          />
          <Input
            label="CGPA"
            placeholder="8.74"
            value={data.cgpa}
            onChange={(v) => onChange("cgpa", v)}
            error={errors.cgpa}
            help="0.0 – 10.0"
          />
        </div>
      </div>

      <div className="card-divider" />

      <div className="card-section">
        <SectionTitle icon={<IconSkills size={16} />} title="Skills & Bio" />
        <Textarea
          label="Skills (comma separated)"
          placeholder="React, Node.js, Python, Machine Learning, SQL, Git…"
          value={data.skills}
          onChange={(v) => onChange("skills", v)}
          rows={3}
          error={errors.skills}
        />
        <Textarea
          label="Bio / About Me"
          placeholder="A brief introduction about your interests and goals..."
          value={data.bio}
          onChange={(v) => onChange("bio", v)}
          rows={4}
          error={errors.bio}
        />
      </div>

      {showResumeSection && (
        <>
          <div className="card-divider" />
          <div className="card-section">
            <SectionTitle icon={<IconUpload size={16} />} title="Resume" />
            <div className="drop-zone" onClick={onOpenResume}>
              <IconUpload size={28} strokeWidth={1.5} />
              <p
                className="small"
                style={{
                  fontWeight: 500,
                  color: "#4B5563",
                  margin: "8px 0 4px",
                }}
              >
                Click to upload resume
              </p>
              <p className="xsmall" style={{ margin: 0 }}>
                PDF, DOC up to 5MB
              </p>
            </div>
          </div>
        </>
      )}

      <div
        className="flex-between"
        style={{
          padding: "24px 32px",
          borderTop: "1px solid var(--color-border)",
          background: "#F9FAFB",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          {onReset && (
            <Button variant="reset" onClick={onReset}>
              Reset
            </Button>
          )}
        </div>
        <Button onClick={onSubmit} loading={saving} disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  )
}

interface SectionTitleProps {
  icon: ReactNode
  title: string
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div
      className="flex-center"
      style={{ justifyContent: "flex-start", gap: 10, marginBottom: 20 }}
    >
      <div className="avatar-sm" style={{ borderRadius: 8, color: "#2563EB" }}>
        {icon}
      </div>
      <h3
        className="small"
        style={{ fontWeight: 700, color: "#1A2033", margin: 0 }}
      >
        {title}
      </h3>
    </div>
  )
}
