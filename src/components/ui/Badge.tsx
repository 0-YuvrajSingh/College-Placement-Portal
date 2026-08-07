import type { ReactNode } from "react"

type Variant = "success" | "info" | "warning" | "neutral"

interface BadgeProps {
  variant?: Variant
  dot?: boolean
  children: ReactNode
}

export default function Badge({
  variant = "neutral",
  dot,
  children,
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant}${dot ? " badge-dot" : ""}`}>
      {children}
    </span>
  )
}
