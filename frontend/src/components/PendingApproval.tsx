import { Link } from "react-router-dom"
import { Building2, Clock, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import type { RecruiterProfile } from "@/types"

export default function PendingApproval() {
  const { profile } = useAuth()
  const company =
    (profile as RecruiterProfile | null)?.companyName || "your company"

  return (
    <div className="page-body">
      <div
        className="card"
        style={{ maxWidth: 640, margin: "48px auto", padding: 32 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--pf-warning-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={22} style={{ color: "var(--pf-warning)" }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Account pending approval
            </div>
            <div style={{ fontSize: 12.5, color: "var(--pf-text-muted)" }}>
              Placement office review
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--pf-text-secondary)",
            lineHeight: 1.7,
            marginBottom: 12,
          }}
        >
          <strong>{company}</strong> is registered, but the placement office
          hasn&apos;t approved it yet. While approval is pending, job posting
          and applicant review are disabled.
        </p>
        <p
          style={{
            fontSize: 14,
            color: "var(--pf-text-secondary)",
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          You can still update your company profile. Once an administrator
          approves your company, all recruitment features become available
          automatically.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/recruiter/profile" className="btn btn-primary btn-md">
            <Building2 size={14} />
            Edit Company Profile
          </Link>
        </div>

        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: "1px solid var(--pf-border)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 12.5,
            color: "var(--pf-text-muted)",
          }}
        >
          <ShieldCheck size={14} />
          Approval status updates after a page refresh
        </div>
      </div>
    </div>
  )
}
