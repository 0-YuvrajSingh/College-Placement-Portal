interface SpinnerProps {
  size?: "sm" | "lg"
  dark?: boolean
}

export default function Spinner({ size = "sm", dark = true }: SpinnerProps) {
  if (size === "lg") {
    return (
      <span className="spinner spinner-lg" role="status" aria-label="Loading" />
    )
  }
  return (
    <span
      className={`spinner ${dark ? "spinner-dark" : ""}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function LoadingDots() {
  return (
    <div className="loading-dots">
      <span />
      <span />
      <span />
    </div>
  )
}
