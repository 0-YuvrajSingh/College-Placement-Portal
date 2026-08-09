interface BadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const CONFIG: Record<string, { bg: string; color: string; dot: string }> = {
  Applied:     { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  Shortlisted: { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  Interview:   { bg: '#ede9fe', color: '#5b21b6', dot: '#8b5cf6' },
  Selected:    { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  Rejected:    { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  Withdrawn:   { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  Open:        { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  Closed:      { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  Expired:     { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  Pending:     { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  Placed:      { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  Active:      { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  Inactive:    { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  Suspended:   { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
}

export default function Badge({ status, size = 'sm' }: BadgeProps) {
  const cfg = CONFIG[status] ?? { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' }
  const pad = size === 'sm' ? '2px 8px' : '4px 12px'
  const fs = size === 'sm' ? '11px' : '12px'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      padding: pad, borderRadius: 4, fontSize: fs, fontWeight: 600,
      letterSpacing: '0.02em', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}
