import type { ReactNode } from "react"

type Variant = "success" | "error" | "info" | "warning"

interface AlertProps {
  variant?: Variant
  children: ReactNode
}

export default function Alert({ variant = "error", children }: AlertProps) {
  return <div className={`alert alert-${variant}`}>{children}</div>
}
