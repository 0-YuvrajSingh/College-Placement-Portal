import type { Page } from "../App"
import { IconBell, IconUser } from "./ui/Icons"

interface Props {
  nav: (p: Page) => void
  variant?: "public" | "app"
  setLogoutOpen?: (v: boolean) => void
}

export default function Navbar({
  nav,
  variant = "public",
  setLogoutOpen,
}: Props) {
  if (variant === "app") {
    return (
      <header className="app-nav">
        <button className="logo-btn" onClick={() => nav("dashboard")}>
          <span className="logo-icon">CC</span>
          <span className="logo-text">CollegeConnect</span>
        </button>
        <div className="app-nav-right">
          <button className="icon-btn" title="Notifications">
            <IconBell />
            <span className="notif-dot" />
          </button>
          <button
            className="avatar avatar-sm"
            onClick={() => nav("view-profile")}
          >
            AK
          </button>
          <button className="logout-link" onClick={() => setLogoutOpen?.(true)}>
            Logout
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="pub-nav">
      <button className="logo-btn" onClick={() => nav("home")}>
        <span className="logo-icon">CC</span>
        <span className="logo-text">CollegeConnect</span>
      </button>
      <nav className="pub-links">
        <button onClick={() => nav("home")}>Home</button>
        <button onClick={() => nav("home")}>About</button>
        <button className="btn btn-secondary" onClick={() => nav("login")}>
          Login
        </button>
        <button className="btn btn-primary" onClick={() => nav("register")}>
          Register
        </button>
      </nav>
    </header>
  )
}
