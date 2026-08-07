import { useState } from "react"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import Alert from "../components/ui/Alert"
import { Input } from "../components/ui/Field"
import type { Page } from "../App"
import { IconUser, IconMail, IconLock, IconCheck } from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
}

export default function Register({ nav }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Full name is required"
    if (!form.email.includes("@")) e.email = "Enter a valid email address"
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters"
    if (form.password !== form.confirm) e.confirm = "Passwords do not match"
    if (!form.terms) e.terms = "You must accept the terms"
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length === 0) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 1500)
    }
  }

  return (
    <div className="page">
      <Navbar nav={nav} variant="public" />
      <div
        className="flex-center"
        style={{ padding: "48px 24px", minHeight: "calc(100vh - 72px)" }}
      >
        <div
          className="card"
          style={{
            width: 440,
            maxWidth: "100%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-header" style={{ textAlign: "center" }}>
            <div
              className="logo-icon"
              style={{
                width: 40,
                height: 40,
                fontSize: 15,
                margin: "0 auto 16px",
              }}
            >
              CC
            </div>
            <h1 className="h4" style={{ marginBottom: 6 }}>
              Create Account
            </h1>
            <p className="small" style={{ color: "#6B7280", marginBottom: 32 }}>
              Join CollegeConnect to manage your student profile
            </p>
          </div>

          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div
                  className="modal-icon modal-icon-success"
                  style={{ margin: "0 auto 16px" }}
                >
                  <IconCheck size={28} />
                </div>
                <h3
                  className="card-title"
                  style={{ fontSize: 18, textAlign: "center" }}
                >
                  Account Created!
                </h3>
                <p
                  className="small"
                  style={{ color: "#6B7280", margin: "0 0 24px" }}
                >
                  Welcome to CollegeConnect. You can now login to your account.
                </p>
                <Button block onClick={() => nav("login")}>
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="flex-col" style={{ gap: 16 }}>
                <Input
                  label="Full Name"
                  placeholder="Arjun Kumar"
                  icon={<IconUser size={16} />}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                />
                <Input
                  label="Email Address"
                  placeholder="arjun.kumar@college.edu"
                  type="email"
                  icon={<IconMail size={16} />}
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  placeholder="Min. 8 characters"
                  type="password"
                  icon={<IconLock size={16} />}
                  value={form.password}
                  onChange={(v) => setForm({ ...form, password: v })}
                  error={errors.password}
                />
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  icon={<IconLock size={16} />}
                  value={form.confirm}
                  onChange={(v) => setForm({ ...form, confirm: v })}
                  error={errors.confirm}
                />

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) =>
                      setForm({ ...form, terms: e.target.checked })
                    }
                  />
                  <span className="small" style={{ color: "#4B5563" }}>
                    I accept the{" "}
                    <button className="btn-link">Terms of Service</button> and{" "}
                    <button className="btn-link">Privacy Policy</button>
                  </span>
                </label>
                {errors.terms && <p className="field-error">{errors.terms}</p>}

                <Button
                  block
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register"}
                </Button>

                <p
                  className="small"
                  style={{
                    textAlign: "center",
                    color: "#6B7280",
                    margin: "8px 0 0",
                  }}
                >
                  Already have an account?{" "}
                  <button className="btn-link" onClick={() => nav("login")}>
                    Login
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
