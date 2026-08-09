import { NavLink, useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"
import {
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  Users,
  X,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"
import { cx, initials } from "@/lib/format"
import { ROLE_LABELS } from "@/lib/constants"

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  exact?: boolean
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  student: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} />, exact: true },
    { to: "/jobs", label: "Browse Jobs", icon: <Briefcase size={17} /> },
    { to: "/applications", label: "My Applications", icon: <FileText size={17} /> },
    { to: "/profile", label: "My Profile", icon: <UserIcon size={17} /> },
  ],
  recruiter: [
    { to: "/recruiter", label: "Dashboard", icon: <LayoutDashboard size={17} />, exact: true },
    { to: "/recruiter/jobs", label: "My Job Postings", icon: <Briefcase size={17} /> },
    { to: "/recruiter/applications", label: "Applicants", icon: <Users size={17} /> },
    { to: "/recruiter/profile", label: "Company Profile", icon: <Building2 size={17} /> },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} />, exact: true },
    { to: "/admin/students", label: "Students", icon: <GraduationCap size={17} /> },
    { to: "/admin/recruiters", label: "Recruiters", icon: <Building2 size={17} /> },
    { to: "/admin/jobs", label: "Jobs", icon: <Briefcase size={17} /> },
    { to: "/admin/applications", label: "Applications", icon: <FileText size={17} /> },
  ],
}

function Brand() {
  const { user } = useAuth()
  return (
    <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="pf-brand" style={{ padding: 0 }}>
        <div className="pf-brand-mark">P</div>
        <div>
          <div className="pf-brand-name">PlaceForge</div>
          <div style={{ fontSize: 10.5, color: "#8ea0bf", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {user ? ROLE_LABELS[user.role] : "Campus Recruitment"}
          </div>
        </div>
      </div>
    </div>
  )
}

function NavLinks({ role }: { role: string }) {
  const items = NAV_BY_ROLE[role] || []
  return (
    <nav className="pf-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) => cx("pf-nav-link", isActive && "pf-nav-link-active")}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="pf-user-card">
        <div className="pf-avatar" style={{ background: "rgba(0,191,179,0.2)", border: "1.5px solid var(--pf-teal)", color: "var(--pf-teal)" }}>{initials(user.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pf-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name}
          </div>
          <div className="pf-user-role">{ROLE_LABELS[user.role]}</div>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <aside className="pf-sidebar">
      <Brand />
      <SidebarFooter />
      <NavLinks role={user.role} />
      <div className="pf-sidebar-footer">
        <button className="btn btn-translucent btn-sm" style={{ width: "100%" }} onClick={() => void logout()}>
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  )
}

function Topbar() {
  const { user, logout } = useAuth()
  return (
    <header className="pf-topbar">
      <div className="pf-topbar-title">PlaceForge</div>
      {user && (
        <button className="btn btn-outline btn-sm" onClick={() => void logout()}>
          <LogOut size={14} /> Log out
        </button>
      )}
    </header>
  )
}

function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const label = NAV_BY_ROLE[user?.role || ""]?.find((i) =>
    i.exact ? location.pathname === i.to : location.pathname.startsWith(i.to),
  )?.label

  return (
    <>
      <header className="pf-mobile-header">
        <button
          className="btn btn-translucent"
          style={{ padding: 6, height: "auto" }}
          aria-label="Toggle navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={18} />
        </button>
        <div style={{ flex: 1, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>{label || "PlaceForge"}</div>
        <div className="pf-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
          {user ? initials(user.name) : "P"}
        </div>
      </header>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,31,61,0.5)",
            zIndex: 60,
          }}
          onClick={() => setOpen(false)}
        >
          <aside
            className="pf-sidebar"
            style={{ display: "flex", width: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-flex-between" style={{ padding: "14px 16px 0" }}>
              <div className="pf-brand" style={{ padding: 0 }}>
                <div className="pf-brand-mark">P</div>
                <div className="pf-brand-name">PlaceForge</div>
              </div>
              <button
                className="btn btn-translucent"
                style={{ padding: 6, height: "auto" }}
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks role={user?.role || ""} />
            <div className="pf-sidebar-footer">
              {user && (
                <button
                  className="btn btn-translucent btn-sm"
                  onClick={() => {
                    setOpen(false)
                    void logout()
                  }}
                  style={{ width: "100%" }}
                >
                  <LogOut size={14} /> Log out
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default function Layout() {
  return (
    <div className="pf-shell">
      <MobileHeader />
      <Sidebar />
      <div className="pf-main">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { Topbar }
