import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { ApiError } from "@/lib/api"
import { DEPARTMENTS } from "@/lib/constants"

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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--pf-text-secondary)",
  marginBottom: 6,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
}

export default function Register() {
  const { register } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const [role, setRole] = useState<"student" | "recruiter">("student")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [branch, setBranch] = useState(DEPARTMENTS[0])
  const [cgpa, setCgpa] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const name = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (!firstName.trim() || !lastName.trim() || !email.trim() || password.length < 6) {
      toastError("Please fill in your name, email, and a password of at least 6 characters.")
      return
    }
    if (role === "student" && (!branch || !cgpa)) {
      toastError("Please fill in your branch and CGPA.")
      return
    }
    if (role === "recruiter" && !companyName.trim()) {
      toastError("Please provide your company name.")
      return
    }
    setSubmitting(true)
    try {
      const registeredRole = await register({
        name,
        email: email.trim(),
        password,
        role,
        ...(role === "student"
          ? { department: branch, cgpa: Number(cgpa), rollNumber: rollNumber.trim() || undefined }
          : { companyName: companyName.trim() }),
      })
      navigate(registeredRole === "student" ? "/jobs" : "/recruiter", { replace: true })
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-split auth-split-wider">
      {/* Left — brand panel */}
      <div className="auth-panel auth-panel-center">
        <div className="auth-panel-grid" />
        <div className="auth-panel-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--pf-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 14 }}>P</span>
            </div>
            <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 18 }}>PlaceForge</span>
          </div>
          <h1 style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 32, lineHeight: 1.2, marginBottom: 20 }}>
            Join the platform
            <br />
            powering campus
            <br />
            <span style={{ color: "var(--pf-teal)" }}>recruitment.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            Create your account in under two minutes and start accessing or posting opportunities right away.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-panel auth-form-scroll">
        <div style={{ maxWidth: 400, width: "100%" }}>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Create account</h2>
          <p style={{ color: "var(--pf-text-secondary)", fontSize: 14, marginBottom: 28 }}>
            Already have one?{" "}
            <button onClick={() => navigate("/login")} style={{ color: "var(--pf-teal)", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}>
              Sign in
            </button>
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>I am a</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
              {(["student", "recruiter"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle} htmlFor="first-name">First name</label>
                  <input id="first-name" autoComplete="given-name" placeholder="Aryan" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="last-name">Last name</label>
                  <input id="last-name" autoComplete="family-name" placeholder="Mehta" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" placeholder={role === "student" ? "you@college.edu" : "you@company.com"} value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              </div>
              {role === "student" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle} htmlFor="branch">Branch</label>
                      <select
                        id="branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="cgpa">CGPA</label>
                      <input id="cgpa" type="number" step="0.1" min="0" max="10" placeholder="8.5" value={cgpa} onChange={(e) => setCgpa(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="roll">Roll Number</label>
                    <input id="roll" placeholder="21CS001" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} style={inputStyle} />
                  </div>
                </>
              )}
              {role === "recruiter" && (
                <div>
                  <label style={labelStyle} htmlFor="company">Company</label>
                  <input id="company" placeholder="Infosys" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
                </div>
              )}
              <div>
                <label style={labelStyle} htmlFor="password">Password</label>
                <input id="password" type="password" autoComplete="new-password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
              {!submitting && <ArrowRight size={14} />}
            </button>
            <p style={{ color: "var(--pf-text-muted)", fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
