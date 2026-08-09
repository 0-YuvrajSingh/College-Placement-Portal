import { useEffect, useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { publicApi } from "@/api/admin"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import type { PublicStats } from "@/types"

function homeForRole(role: string): string {
  if (role === "admin") return "/admin"
  if (role === "recruiter") return "/recruiter"
  return "/dashboard"
}

const DEMO_EMAILS: Record<string, string> = {
  student: "aarav@college.edu",
  recruiter: "priya@acme.com",
  admin: "admin@placeforge.edu",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 6,
  border: "1px solid var(--pf-border)",
  background: "#fff",
  fontSize: 14,
  color: "var(--pf-text)",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "border-color 0.15s",
}

export default function Login() {
  const { login, user } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState<PublicStats | null>(null)

  useEffect(() => {
    let active = true
    publicApi
      .stats()
      .then((s) => {
        if (active) setStats(s)
      })
      .catch(() => {
        if (active) setStats(null)
      })
    return () => {
      active = false
    }
  }, [])

  if (user) {
    return null
  }

  const onRoleSelect = (r: string) => {
    setRole(r)
    if (!email) setEmail(DEMO_EMAILS[r] || "")
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toastError("Please enter your email and password")
      return
    }
    setSubmitting(true)
    try {
      const loggedInRole = (await login(email, password))
      const from = (location.state as { from?: string } | null)?.from
      if (from) navigate(from, { replace: true })
      else if (loggedInRole) navigate(homeForRole(loggedInRole), { replace: true })
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  const statRows = [
    { val: stats?.totalStudents != null ? stats.totalStudents.toLocaleString("en-IN") : "—", label: "Registered Students" },
    { val: stats?.activeRecruiters != null ? stats.activeRecruiters.toLocaleString("en-IN") : "—", label: "Partner Companies" },
    { val: stats?.placementRate != null ? `${stats.placementRate}%` : "—", label: "Placement Rate" },
  ]

  return (
    <div className="auth-split">
      {/* Left — brand panel */}
      <div className="auth-panel auth-panel-between">
        <div className="auth-panel-grid" />
        <div className="auth-panel-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 56 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--pf-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 14 }}>P</span>
            </div>
            <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 18 }}>PlaceForge</span>
          </div>
          <h1 style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 36, lineHeight: 1.15, marginBottom: 20 }}>
            One platform.
            <br />
            <span style={{ color: "var(--pf-teal)" }}>Every placement step.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
            From the first job post to the final offer letter — PlaceForge keeps students, recruiters, and placement coordinators aligned throughout campus recruitment.
          </p>
        </div>
        <div className="auth-panel-content">
          {statRows.map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{s.label}</span>
              <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 22 }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-panel">
        <div style={{ maxWidth: 360, width: "100%" }}>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Sign in</h2>
          <p style={{ color: "var(--pf-text-secondary)", fontSize: 14, marginBottom: 32 }}>
            New to PlaceForge?{" "}
            <button onClick={() => navigate("/register")} style={{ color: "var(--pf-teal)", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}>
              Create an account
            </button>
          </p>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Sign in as
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {["student", "recruiter", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRoleSelect(r)}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 6,
                    border: `1.5px solid ${role === r ? "var(--pf-teal)" : "var(--pf-border)"}`,
                    background: role === r ? "var(--pf-teal-soft)" : "#fff",
                    color: role === r ? "var(--pf-teal)" : "var(--pf-text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    textTransform: "capitalize",
                    transition: "all 0.12s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--pf-teal)" }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--pf-border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pf-text-secondary)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--pf-teal)" }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--pf-border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--pf-text-muted)", padding: 0 }}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "var(--pf-text-muted)", fontSize: 13, cursor: "default" }}>Forgot your password?</span>
          </div>
        </div>
      </div>
    </div>
  )
}
