import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Banknote, Users, AlertTriangle, CheckCircle, Lock } from 'lucide-react'
import type { Job } from '../../data/mock'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface JobCardProps {
  job: Job
  variant?: 'default' | 'featured' | 'compact'
}

function LogoMark({ abbr }: { abbr: string }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 8,
      background: 'var(--pf-navy)', color: 'var(--pf-teal)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Manrope', fontWeight: 800, fontSize: 12, flexShrink: 0,
    }}>{abbr}</div>
  )
}

export default function JobCard({ job, variant = 'default' }: JobCardProps) {
  const navigate = useNavigate()

  const borderLeft = job.featured ? '3px solid var(--pf-teal)' :
    job.closingSoon ? '3px solid var(--pf-amber)' :
    job.applied ? '3px solid #8b5cf6' :
    !job.eligible ? '3px solid var(--pf-border)' :
    '3px solid transparent'

  const opacity = !job.eligible ? 0.65 : 1

  return (
    <div
      onClick={() => navigate(`/student/jobs/${job.id}`)}
      style={{
        background: 'var(--pf-surface)', border: '1px solid var(--pf-border)',
        borderLeft, borderRadius: 8, padding: variant === 'compact' ? '14px 16px' : '18px 20px',
        cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s',
        opacity, position: 'relative',
      }}
      onMouseEnter={e => { if (job.eligible) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(15,31,61,0.08)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Banners */}
      {job.featured && (
        <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-teal)', fontSize: 11, fontWeight: 600 }}>
          <CheckCircle size={12} /> Featured
        </div>
      )}
      {job.closingSoon && !job.featured && (
        <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-amber)', fontSize: 11, fontWeight: 600 }}>
          <AlertTriangle size={12} /> Closing Soon
        </div>
      )}
      {!job.eligible && (
        <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-muted)', fontSize: 11, fontWeight: 600 }}>
          <Lock size={12} /> Ineligible
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <LogoMark abbr={job.logo} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: 'var(--pf-text)', lineHeight: 1.3 }}>{job.title}</div>
              <div style={{ color: 'var(--pf-text-secondary)', fontSize: 13, marginTop: 2 }}>{job.company}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10, color: 'var(--pf-text-secondary)', fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{job.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Banknote size={12} />{job.package}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />Deadline: {job.deadline}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} />{job.applicants} applicants</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {job.skills.map(s => (
              <span key={s} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--pf-surface-elevated)', border: '1px solid var(--pf-border)', fontSize: 11, color: 'var(--pf-text-secondary)', fontWeight: 500 }}>{s}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge status={job.status} />
              <Badge status={job.type} size="sm" />
              {job.applied && <Badge status="Applied" />}
            </div>
            {job.eligible && !job.applied && (
              <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); navigate(`/student/jobs/${job.id}`) }}>
                View & Apply
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
