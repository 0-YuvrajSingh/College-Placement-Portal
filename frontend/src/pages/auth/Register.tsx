import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GraduationCap, Building2, UserPlus } from "lucide-react"
import AuthLayout from "@/components/AuthLayout"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { cx } from "@/lib/format"

export default function Register() {
  const { register } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const [role, setRole] = useState<"student" | "recruiter">("student")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || password.length < 6) {
      toastError("Please fill in all fields. Password must be at least 6 characters.")
      return
    }
    setSubmitting(true)
    try {
      const registeredRole = await register({ name: name.trim(), email: email.trim(), password, role })
      navigate(registeredRole === "student" ? "/jobs" : "/recruiter", { replace: true })
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join PlaceForge as a student or a recruiter."
      footer={
        <>
          Already have an account? <Link to="/login" className="link">Log in</Link>
        </>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {(
          [
            { value: "student", label: "Student", icon: <GraduationCap size={18} /> },
            { value: "recruiter", label: "Recruiter", icon: <Building2 size={18} /> },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setRole(opt.value)}
            className={cx("btn", "btn-md", role === opt.value ? "btn-primary" : "btn-outline")}
            aria-pressed={role === opt.value}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="name">Full name</label>
          <input
            id="name"
            className="input"
            type="text"
            autoComplete="name"
            placeholder={role === "student" ? "e.g. Aarav Mehta" : "e.g. Priya Sharma"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
          <UserPlus size={16} />
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  )
}
