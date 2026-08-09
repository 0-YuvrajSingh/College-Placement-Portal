import type { ReactNode } from "react"
import { Link } from "react-router-dom"

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--pf-navy) 0%, #14294f 55%, #0b1730 100%)",
        padding: 24,
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 440, padding: 36 }}>
        <div className="pf-flex-center" style={{ gap: 10, marginBottom: 24 }}>
          <div className="pf-brand-mark">P</div>
          <span style={{ fontFamily: "'Manrope'", fontWeight: 800, fontSize: 18, color: "var(--pf-navy)" }}>
            PlaceForge
          </span>
        </div>
        <h1 style={{ fontFamily: "'Manrope'", fontWeight: 800, fontSize: 22, color: "var(--pf-text)" }}>{title}</h1>
        <p style={{ color: "var(--pf-text-muted)", fontSize: 13, marginTop: 4, marginBottom: 24 }}>{subtitle}</p>
        {children}
        {footer && <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--pf-text-secondary)" }}>{footer}</div>}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link to="/" className="link-muted" style={{ fontSize: 12.5 }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
