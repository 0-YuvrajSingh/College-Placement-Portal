import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const VARIANTS = {
  primary:   { bg: 'var(--pf-teal)', color: '#fff', border: 'var(--pf-teal)', hover: 'var(--pf-teal-hover)' },
  secondary: { bg: 'var(--pf-navy)', color: '#fff', border: 'var(--pf-navy)', hover: 'var(--pf-navy-800)' },
  danger:    { bg: 'var(--pf-danger)', color: '#fff', border: 'var(--pf-danger)', hover: '#dc2626' },
  ghost:     { bg: 'transparent', color: 'var(--pf-text-secondary)', border: 'transparent', hover: 'var(--pf-surface-elevated)' },
  outline:   { bg: 'transparent', color: 'var(--pf-navy)', border: 'var(--pf-border-strong)', hover: 'var(--pf-surface-elevated)' },
}

const SIZES = {
  sm: { padding: '6px 12px', fontSize: '12px', height: 30 },
  md: { padding: '8px 16px', fontSize: '13px', height: 36 },
  lg: { padding: '10px 20px', fontSize: '14px', height: 42 },
}

export default function Button({
  variant = 'primary', size = 'md', loading, disabled, children, style, ...rest
}: ButtonProps) {
  const v = VARIANTS[variant]
  const s = SIZES[size]
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        background: v.bg, color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 6, height: s.height,
        padding: s.padding, fontSize: s.fontSize,
        fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer',
        transition: 'background 0.15s, opacity 0.15s',
        opacity: (disabled || loading) ? 0.5 : 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = v.hover }}
      onMouseLeave={e => { if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = v.bg }}
      {...rest}
    >
      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  )
}
