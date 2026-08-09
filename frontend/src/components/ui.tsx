import { useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Inbox, X } from "lucide-react"
import type { ApplicationStatus, JobStatus } from "@/types"
import {
  APPLICATION_STATUS_LABELS,
  JOB_STATUS_LABELS,
} from "@/lib/constants"

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        border: "2px solid var(--pf-border-strong)",
        borderTopColor: "var(--pf-teal)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  )
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="empty-state" style={{ minHeight: 320 }}>
      <Spinner size={28} />
      <div className="pf-muted">{label || "Loading…"}</div>
    </div>
  )
}

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string
  message?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="empty-state">
      <div style={{ opacity: 0.4 }}>{icon || <Inbox size={36} />}</div>
      <div className="empty-title">{title}</div>
      {message && <div className="pf-muted" style={{ maxWidth: 380 }}>{message}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function Badge({
  tone = "muted",
  children,
}: {
  tone?: "success" | "warning" | "danger" | "info" | "muted" | "teal"
  children: ReactNode
}) {
  const colors: Record<string, { bg: string; fg: string }> = {
    success: { bg: "var(--pf-success-soft)", fg: "#065f46" },
    warning: { bg: "var(--pf-warning-soft)", fg: "#92400e" },
    danger: { bg: "var(--pf-danger-soft)", fg: "#991b1b" },
    info: { bg: "var(--pf-info-soft)", fg: "#1e40af" },
    muted: { bg: "var(--pf-surface-elevated)", fg: "var(--pf-text-secondary)" },
    teal: { bg: "var(--pf-teal-soft)", fg: "#0d9488" },
  }
  const { bg, fg } = colors[tone] || colors.muted
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 5,
        background: bg,
        color: fg,
        fontSize: 11.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const toneMap: Record<JobStatus, "success" | "warning" | "danger" | "muted"> = {
    OPEN: "success",
    DRAFT: "muted",
    CLOSED: "danger",
    EXPIRED: "warning",
  }
  return <Badge tone={toneMap[status] || "muted"}>{JOB_STATUS_LABELS[status]}</Badge>
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const toneMap: Record<ApplicationStatus, "success" | "warning" | "danger" | "info" | "muted"> = {
    APPLIED: "info",
    SHORTLISTED: "warning",
    REJECTED: "danger",
    SELECTED: "success",
    WITHDRAWN: "muted",
  }
  return <Badge tone={toneMap[status] || "muted"}>{APPLICATION_STATUS_LABELS[status]}</Badge>
}

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="pf-flex-between" style={{ padding: "14px 18px" }}>
      <span className="pf-muted" style={{ fontSize: 12 }}>
        Page {page} of {totalPages}
      </span>
      <div className="pf-gap-8">
        <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={14} /> Prev
        </button>
        <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export function SkillChip({ skill, onRemove }: { skill: string; onRemove?: () => void }) {
  return (
    <span className="skill-chip">
      {skill}
      {onRemove && (
        <button
          aria-label={`Remove ${skill}`}
          onClick={onRemove}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--pf-text-muted)" }}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

export function SkillInput({
  value,
  onChange,
  placeholder = "Add a skill and press Enter",
}: {
  value: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
}) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {value.map((skill) => (
          <SkillChip key={skill} skill={skill} onRemove={() => onChange(value.filter((s) => s !== skill))} />
        ))}
      </div>
      <input
        className="input"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            const next = (e.target as HTMLInputElement).value.trim()
            if (next && !value.includes(next)) {
              onChange([...value, next])
            }
            ;(e.target as HTMLInputElement).value = ""
          } else if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "" && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
      />
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 520,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: number
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,31,61,0.45)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "88vh",
          overflowY: "auto",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="pf-flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--pf-border)" }}>
          <h2 style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 700 }}>{title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  )
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error ? <div className="field-error">{error}</div> : hint ? <div className="field-hint">{hint}</div> : null}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="page-header">
      <div className="pf-flex-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="pf-gap-8" style={{ flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  )
}

export function Skeleton({
  width,
  height,
  style,
  className = "",
}: {
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
    />
  )
}

export function MetricStrip({
  items,
  cellPadding = "20px 28px",
  valueSize = 22,
  iconAlpha = 18,
  containerStyle,
}: {
  items: {
    label: string
    value: ReactNode
    icon?: ReactNode
    color?: string
  }[]
  cellPadding?: string
  valueSize?: number
  iconAlpha?: number
  containerStyle?: React.CSSProperties
}) {
  return (
    <div className="stats-strip" style={containerStyle}>
      {items.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: cellPadding,
            borderLeft: i > 0 ? "1px solid var(--pf-border)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {s.icon && (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `color-mix(in srgb, ${s.color || "var(--pf-navy)"} ${iconAlpha}%, white)`,
                color: s.color || "var(--pf-navy)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
          )}
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: valueSize,
                color: s.color || "var(--pf-navy)",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--pf-text-secondary)", marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
