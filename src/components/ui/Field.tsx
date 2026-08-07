import type { ReactNode } from "react"

interface FieldWrapperProps {
  label?: string
  error?: string
  help?: string
  children: ReactNode
}

export function FieldWrapper({
  label,
  error,
  help,
  children,
}: FieldWrapperProps) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {error && <p className="field-error">{error}</p>}
      {!error && help && <p className="field-help">{help}</p>}
    </div>
  )
}

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  error?: string
  success?: boolean
  help?: string
  icon?: ReactNode
  onEnter?: () => void
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  success,
  help,
  icon,
  onEnter,
}: InputProps) {
  const controlClass = [
    "field-control",
    error ? "is-error" : "",
    success ? "is-success" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <FieldWrapper label={label} error={error} help={help}>
      <div className={icon ? "field-input-wrap" : undefined}>
        {icon && <span className="field-icon">{icon}</span>}
        <input
          type={type}
          className={controlClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) onEnter()
          }}
        />
      </div>
    </FieldWrapper>
  )
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  error?: string
  help?: string
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  help,
}: SelectProps) {
  const empty = !value
  const controlClass = [
    "field-control",
    empty ? "is-empty" : "",
    error ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <FieldWrapper label={label} error={error} help={help}>
      <select
        className={controlClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder ?? `Select ${label ?? "option"}`}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}

interface TextareaProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  error?: string
  help?: string
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  help,
}: TextareaProps) {
  return (
    <FieldWrapper label={label} error={error} help={help}>
      <textarea
        className={`field-control ${error ? "is-error" : ""}`}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  )
}
