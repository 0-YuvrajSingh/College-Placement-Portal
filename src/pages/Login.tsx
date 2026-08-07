import { useState } from "react"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import Alert from "../components/ui/Alert"
import { Input } from "../components/ui/Field"
import type { Page } from "../App"
import { IconMail, IconLock, IconAlert } from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
}

export default function Login({ nav }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      nav("dashboard")
    }, 1200)
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
              Welcome back
            </h1>
            <p className="small" style={{ color: "#6B7280", marginBottom: 32 }}>
              Sign in to your CollegeConnect account
            </p>
          </div>

          <div className="card-body">
            <div className="flex-col" style={{ gap: 16 }}>
              {error && (
                <Alert variant="error">
                  <IconAlert size={16} />
                  {error}
                </Alert>
              )}

              <Input
                label="Email Address"
                placeholder="arjun.kumar@college.edu"
                type="email"
                icon={<IconMail size={16} />}
                value={email}
                onChange={setEmail}
              />

              <div className="field">
                <div
                  className="flex-between"
                  style={{ justifyContent: "space-between" }}
                >
                  <label className="field-label">Password</label>
                  <button className="btn-link">Forgot password?</button>
                </div>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <IconLock size={16} />
                  </span>
                  <input
                    className="field-control"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin()
                    }}
                  />
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="small" style={{ color: "#4B5563" }}>
                  Remember me for 30 days
                </span>
              </label>

              <Button
                block
                onClick={handleLogin}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              <div style={{ position: "relative", textAlign: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "var(--color-border)",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    background: "#fff",
                    padding: "0 12px",
                    fontSize: 12,
                    color: "var(--color-muted)",
                  }}
                >
                  or
                </span>
              </div>

              <Button variant="secondary" block onClick={() => nav("register")}>
                Create a new account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
