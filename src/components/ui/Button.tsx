import type { ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "ghost" | "reset" | "link"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: Variant
  size?: "sm" | "md" | "lg"
  block?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  block,
  loading,
  disabled,
  className = "",
}: ButtonProps) {
  const classes = [
    "btn",
    variant !== "link" ? `btn-${variant}` : "btn-link",
    size !== "md" ? `btn-${size}` : "",
    block ? "btn-block" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled || loading}
    >
      {loading && (
        <span
          className={
            variant === "secondary" || variant === "ghost"
              ? "spinner spinner-dark"
              : "spinner"
          }
        />
      )}
      {children}
    </button>
  )
}
