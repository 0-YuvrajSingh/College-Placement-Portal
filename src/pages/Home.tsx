import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import type { Page } from "../App"
import { IconUser, IconDocument, IconShield } from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
}

const features = [
  {
    Icon: IconUser,
    title: "Student Profile",
    desc: "Create and manage your academic profile with personal details, skills, and CGPA — all in one place.",
  },
  {
    Icon: IconDocument,
    title: "Resume Upload",
    desc: "Upload your resume and keep it updated, so your latest CV is always attached to your profile.",
  },
  {
    Icon: IconShield,
    title: "Secure Authentication",
    desc: "Your data is protected with secure login, encrypted credentials, and session management you control.",
  },
]

export default function Home({ nav }: Props) {
  return (
    <div className="page">
      <Navbar nav={nav} variant="public" />

      {/* Hero */}
      <section
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "80px 32px 64px",
          textAlign: "center",
        }}
      >
        <div className="badge badge-info" style={{ marginBottom: 24 }}>
          Campus Placement 2025–26
        </div>
        <h1
          className="h1"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", marginBottom: 20 }}
        >
          CollegeConnect
        </h1>
        <p
          className="body"
          style={{ color: "#4B5563", lineHeight: 1.7, margin: "0 0 36px" }}
        >
          Manage your student profile and resume in one simple, secure place.
          <br />
          Keep your academic details and CV always up to date.
        </p>
        <div
          className="flex-center"
          style={{ gap: 12, flexWrap: "wrap", marginBottom: 48 }}
        >
          <Button size="lg" onClick={() => nav("register")}>
            Get Started
          </Button>
          <Button size="lg" variant="secondary" onClick={() => nav("login")}>
            Login
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container" style={{ paddingBottom: 80 }}>
        <h2 className="h3" style={{ textAlign: "center", marginBottom: 8 }}>
          Everything you need
        </h2>
        <p
          className="small"
          style={{ color: "#6B7280", textAlign: "center", margin: "0 0 40px" }}
        >
          A complete profile and resume management experience, built for
          students.
        </p>
        <div
          className="stats-grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="card card-body"
              style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(37,99,235,0.08)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.transform = "none"
              }}
            >
              <div
                className="avatar-sm"
                style={{ borderRadius: 12, marginBottom: 16 }}
              >
                <Icon size={22} />
              </div>
              <h3
                className="card-title"
                style={{ fontSize: 18, margin: "0 0 10px" }}
              >
                {title}
              </h3>
              <p
                className="small"
                style={{ color: "#6B7280", lineHeight: 1.6, margin: 0 }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "24px clamp(24px, 5vw, 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 13,
          color: "var(--color-muted)",
          background: "#fff",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© 2025 CollegeConnect · Student Profile Management</span>
        <div style={{ display: "flex", gap: 24 }}>
          <button
            className="btn-link"
            style={{ color: "var(--color-muted)", fontWeight: 400 }}
          >
            Privacy Policy
          </button>
          <button
            className="btn-link"
            style={{ color: "var(--color-muted)", fontWeight: 400 }}
          >
            Terms of Use
          </button>
          <button
            className="btn-link"
            style={{ color: "var(--color-muted)", fontWeight: 400 }}
          >
            Support
          </button>
        </div>
      </footer>
    </div>
  )
}
