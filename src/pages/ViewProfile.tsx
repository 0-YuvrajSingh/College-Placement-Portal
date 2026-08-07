import { useState } from "react"
import AppLayout from "../components/AppLayout"
import Breadcrumb from "../components/ui/Breadcrumb"
import Avatar from "../components/ui/Avatar"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import ProgressBar from "../components/ui/ProgressBar"
import Alert from "../components/ui/Alert"
import { LogoutModal, ResumeModal } from "../components/Modals"
import type { Page } from "../App"
import {
  IconMail,
  IconPhone,
  IconBuilding,
  IconCalendar,
  IconDocument,
  IconDownload,
  IconTrash,
  IconPencil,
} from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
  logoutOpen: boolean
  resumeOpen: boolean
  setLogoutOpen: (v: boolean) => void
  setResumeOpen: (v: boolean) => void
}

const PROFILE = {
  name: "Arjun Kumar",
  email: "arjun.kumar@college.edu",
  phone: "+91 98765 43210",
  dept: "Computer Science Engineering",
  year: "4th Year",
  semester: "Sem VII",
  cgpa: "8.74",
  skills: [
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
    "SQL",
    "Git",
    "TypeScript",
    "Docker",
  ],
  bio: "Final year CSE student passionate about full-stack development and building products that matter. Seeking placement opportunities in software engineering roles.",
  resume: {
    name: "Arjun_Kumar_Resume.pdf",
    size: "245 KB",
    uploaded: "May 3, 2025",
  },
}

const info = [
  { label: "Email", value: PROFILE.email, Icon: IconMail },
  { label: "Phone", value: PROFILE.phone, Icon: IconPhone },
  { label: "Department", value: PROFILE.dept, Icon: IconBuilding },
  {
    label: "Year · Semester",
    value: `${PROFILE.year} · ${PROFILE.semester}`,
    Icon: IconCalendar,
  },
]

export default function ViewProfile({
  nav,
  logoutOpen,
  resumeOpen,
  setLogoutOpen,
  setResumeOpen,
}: Props) {
  const [deleted, setDeleted] = useState(false)

  return (
    <div className="page">
      <AppLayout nav={nav} active="view-profile" setLogoutOpen={setLogoutOpen}>
        <Breadcrumb
          items={[
            { label: "Dashboard", page: "dashboard" },
            { label: "My Profile" },
          ]}
          nav={nav}
        />

        {/* Header card */}
        <div className="card card-body section-gap">
          <div className="flex-between" style={{ alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <Avatar initials="AK" size={72} />
              <div>
                <h2 className="h3" style={{ margin: "0 0 4px" }}>
                  {PROFILE.name}
                </h2>
                <p
                  className="small"
                  style={{ color: "var(--color-muted)", margin: "0 0 10px" }}
                >
                  {PROFILE.dept} · {PROFILE.year}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                  <Badge variant="info">CGPA {PROFILE.cgpa}</Badge>
                </div>
              </div>
            </div>
            <div style={{ minWidth: 220 }}>
              <ProgressBar
                value={78}
                label="Profile Completion"
                valueLabel="78%"
              />
            </div>
          </div>

          <div className="divider" />

          <div className="stats-grid">
            {info.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex-center"
                style={{ justifyContent: "flex-start", gap: 10 }}
              >
                <span className="avatar-sm" style={{ color: "#2563EB" }}>
                  <Icon size={16} />
                </span>
                <div>
                  <p
                    className="xsmall"
                    style={{ fontWeight: 500, margin: "0 0 2px" }}
                  >
                    {label}
                  </p>
                  <p
                    className="small"
                    style={{ fontWeight: 600, color: "#1A2033", margin: 0 }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-two section-gap">
          <div className="card card-body">
            <h3 className="card-title">About</h3>
            <p
              className="small"
              style={{ lineHeight: 1.6, color: "#4B5563", margin: 0 }}
            >
              {PROFILE.bio}
            </p>
          </div>

          <div className="card card-body">
            <h3 className="card-title">Skills</h3>
            <div
              className="flex-wrap"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              {PROFILE.skills.map((s) => (
                <Badge key={s} variant="info">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Resume card */}
        <div className="card card-body section-gap">
          <div className="flex-between">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="avatar-sm" style={{ color: "#2563EB" }}>
                <IconDocument size={16} />
              </span>
              <div>
                <h3 className="card-title" style={{ marginBottom: 2 }}>
                  Resume
                </h3>
                <p className="xsmall mono" style={{ margin: 0 }}>
                  {PROFILE.resume.name} · {PROFILE.resume.size} ·{" "}
                  {PROFILE.resume.uploaded}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm">
                <IconDownload size={14} />
                Download
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setDeleted(true)
                  setTimeout(() => setDeleted(false), 2500)
                }}
              >
                <IconTrash size={14} />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {deleted && (
          <div className="section-gap">
            <Alert variant="error">
              Resume deleted. You can re-upload one from your profile.
            </Alert>
          </div>
        )}

        <div
          className="section-gap"
          style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
        >
          <Button onClick={() => nav("update-profile")}>
            <IconPencil size={15} />
            Update Profile
          </Button>
        </div>
      </AppLayout>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        nav={nav}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}
