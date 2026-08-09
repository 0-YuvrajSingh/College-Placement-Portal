import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import AuthLayout from "@/components/AuthLayout"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"

function homeForRole(role: string): string {
  if (role === "admin") return "/admin"
  if (role === "recruiter") return "/recruiter"
  return "/dashboard"
}

export default function Login() {
  const { login, user } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return null
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toastError("Please enter your email and password")
      return
    }
    setSubmitting(true)
    try {
      const role = (await login(email, password))
      const from = (location.state as { from?: string } | null)?.from
      if (from) navigate(from, { replace: true })
      else if (role) navigate(homeForRole(role), { replace: true })
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to your placement dashboard."
      footer={
        <>
          New here? <Link to="/register" className="link">Create an account</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
          <LogIn size={16} />
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div
        className="card"
        style={{ marginTop: 24, padding: "14px 16px", background: "var(--pf-surface-elevated)", border: "1px dashed var(--pf-border-strong)" }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pf-text-muted)", marginBottom: 8 }}>
          Demo accounts
        </div>
        <div style={{ fontSize: 12, color: "var(--pf-text-secondary)", lineHeight: 1.7, fontFamily: "monospace" }}>
          Student · aarav@college.edu / Student@123
          <br />
          Recruiter · priya@acme.com / Recruiter@123
          <br />
          Admin · admin@placeforge.edu / Admin@1234
        </div>
      </div>
    </AuthLayout>
  )
}
