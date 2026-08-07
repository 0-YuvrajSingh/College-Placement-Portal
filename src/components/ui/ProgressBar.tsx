interface ProgressBarProps {
  value: number
  label?: string
  valueLabel?: string
  hint?: string
}

export default function ProgressBar({
  value,
  label,
  valueLabel,
  hint,
}: ProgressBarProps) {
  return (
    <div>
      {(label || valueLabel) && (
        <div className="progress-row">
          {label && (
            <span style={{ color: "#4B5563", fontWeight: 500 }}>{label}</span>
          )}
          {valueLabel && (
            <span
              style={{
                color: "#2563EB",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {valueLabel}
            </span>
          )}
        </div>
      )}
      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {hint && (
        <p className="xsmall" style={{ marginTop: 8 }}>
          {hint}
        </p>
      )}
    </div>
  )
}
