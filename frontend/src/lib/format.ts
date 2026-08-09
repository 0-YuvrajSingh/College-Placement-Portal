export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function formatSalary(salary: { min?: number; max?: number; currency?: string } | null | undefined): string {
  if (!salary) return "Not disclosed"
  if (salary.min == null && salary.max == null) return "Not disclosed"
  const currency = salary.currency || "INR"
  const unit = currency === "LPA" ? " LPA" : currency === "USD" ? " USD" : ` ${currency}`
  if (salary.min != null && salary.max != null) {
    return `${salary.min} – ${salary.max}${unit}`
  }
  return `${salary.min ?? salary.max}${unit}`
}

export function formatSalaryRange(min?: number, max?: number, currency?: string): string {
  return formatSalary({ min, max, currency })
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN")
}

export function formatDate(value?: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function timeAgo(value?: string | null): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(value)
}

export function deadlineStatus(deadline?: string): {
  label: string
  tone: "danger" | "warning" | "success" | "muted"
} {
  if (!deadline) return { label: "No deadline", tone: "muted" }
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms < 0) return { label: "Closed", tone: "danger" }
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000))
  if (days <= 3) return { label: `${days}d left`, tone: "danger" }
  if (days <= 7) return { label: `${days}d left`, tone: "warning" }
  return { label: `${days}d left`, tone: "success" }
}

export function isClosingSoon(deadline?: string, windowMs = 7 * 24 * 60 * 60 * 1000): boolean {
  if (!deadline) return false
  const ms = new Date(deadline).getTime() - Date.now()
  return ms > 0 && ms <= windowMs
}

export function initials(name?: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function compactNumber(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(value)
}
