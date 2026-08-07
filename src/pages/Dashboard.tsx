import type { ComponentType } from "react"
import AppLayout from "../components/AppLayout"
import { LogoutModal, ResumeModal } from "../components/Modals"
import Button from "../components/ui/Button"
import ProgressBar from "../components/ui/ProgressBar"
import type { Page } from "../App"
import {
  IconCheck,
  IconDocument,
  IconChart,
  IconBuilding,
  IconPencil,
  IconUpload,
  IconPlus,
} from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
  logoutOpen: boolean
  resumeOpen: boolean
  setLogoutOpen: (v: boolean) => void
  setResumeOpen: (v: boolean) => void
}

interface IconProps {
  size?: number
  strokeWidth?: number
}

const stats = [
  {
    label: "Profile Created",
    value: "Apr 12, 2025",
    Icon: IconCheck,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    label: "Resume Uploaded",
    value: "May 3, 2025",
    Icon: IconDocument,
    color: "#2563EB",
    bg: "#EEF4FF",
  },
  {
    label: "CGPA",
    value: "8.74",
    Icon: IconChart,
    color: "#D97706",
    bg: "#FEF3C7",
  },
  {
    label: "Department",
    value: "CSE",
    Icon: IconBuilding,
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
]

const activity = [
  { text: "Resume uploaded successfully", time: "2h ago", success: true },
  { text: "Profile updated — Skills section", time: "1d ago", success: false },
  { text: "Profile created", time: "Apr 12", success: false },
]

export default function Dashboard({
  nav,
  logoutOpen,
  resumeOpen,
  setLogoutOpen,
  setResumeOpen,
}: Props) {
  return (
    <div className="page">
      <AppLayout nav={nav} active="dashboard" setLogoutOpen={setLogoutOpen}>
        {/* Welcome */}
        <div
          className="card card-body flex-between section-gap"
          style={{ alignItems: "flex-start" }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              Welcome back
            </div>
            <h2 className="h3" style={{ margin: "0 0 8px" }}>
              Arjun Kumar
            </h2>
            <p className="small" style={{ color: "#6B7280", margin: 0 }}>
              B.Tech · Computer Science Engineering · 4th Year
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ProgressBar
              value={78}
              label="Profile Completion"
              valueLabel="78%"
              hint="Add skills to reach 100%"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid section-gap">
          {stats.map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="card card-body">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: bg,
                  color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <p
                className="xsmall"
                style={{ fontWeight: 500, margin: "0 0 4px" }}
              >
                {label}
              </p>
              <p
                className="small"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "#1A2033",
                  margin: 0,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        <div
          className="grid-two section-gap"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Recent Activity */}
          <div className="card card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="flex-col" style={{ gap: 16 }}>
              {activity.map((a, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: a.success ? "#16A34A" : "#2563EB",
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p className="small" style={{ margin: "0 0 2px" }}>
                      {a.text}
                    </p>
                    <p className="xsmall mono" style={{ margin: 0 }}>
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="flex-col" style={{ gap: 10 }}>
              <ActionBtn
                label="Create Profile"
                Icon={IconPlus}
                color="#2563EB"
                onClick={() => nav("create-profile")}
              />
              <ActionBtn
                label="Update Profile"
                Icon={IconPencil}
                color="#7C3AED"
                onClick={() => nav("update-profile")}
              />
              <ActionBtn
                label="Upload Resume"
                Icon={IconUpload}
                color="#16A34A"
                onClick={() => setResumeOpen(true)}
              />
            </div>
          </div>
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

function ActionBtn({
  label,
  Icon,
  color,
  onClick,
}: {
  label: string
  Icon: ComponentType<IconProps>
  color: string
  onClick: () => void
}) {
  return (
    <button
      className="btn btn-ghost"
      style={{
        justifyContent: "flex-start",
        padding: "12px 16px",
        background: "#F9FAFB",
        color: "#1A2033",
      }}
      onClick={onClick}
    >
      <span style={{ display: "flex", color }}>
        <Icon size={16} strokeWidth={2} />
      </span>
      {label}
    </button>
  )
}
