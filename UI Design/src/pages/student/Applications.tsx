import { useNavigate } from 'react-router-dom'
import { APPLICATIONS } from '../../data/mock'
import Badge from '../../components/ui/Badge'

const ALL_STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected']
const REJECTED_STAGES = ['Applied', 'Rejected']

function Timeline({ app }: { app: typeof APPLICATIONS[0] }) {
  const isRejected = app.status === 'Rejected' || app.status === 'Withdrawn'
  const stages = isRejected ? REJECTED_STAGES : ALL_STAGES
  const currentIdx = stages.indexOf(app.status as string)

  const stageColor = (idx: number) => {
    if (isRejected && idx === stages.length - 1) return 'var(--pf-danger)'
    if (idx <= currentIdx) return 'var(--pf-teal)'
    return 'var(--pf-border-strong)'
  }

  const stageBg = (idx: number) => {
    if (isRejected && idx === stages.length - 1) return 'var(--pf-danger-soft)'
    if (idx <= currentIdx) return 'var(--pf-teal-soft)'
    return 'var(--pf-surface-elevated)'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative', paddingTop: 8 }}>
      {stages.map((stage, i) => (
        <div key={stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Connector line */}
          {i < stages.length - 1 && (
            <div style={{
              position: 'absolute', top: 13, left: '50%', right: '-50%', height: 2,
              background: i < currentIdx ? 'var(--pf-teal)' : 'var(--pf-border)',
            }} />
          )}
          {/* Dot */}
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: stageBg(i), border: `2px solid ${stageColor(i)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1, flexShrink: 0,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageColor(i) }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: i <= currentIdx ? 'var(--pf-text)' : 'var(--pf-text-muted)', textAlign: 'center' }}>{stage}</div>
          {app.timeline.find(t => t.stage === stage)?.date && (
            <div style={{ fontSize: 10, color: 'var(--pf-text-muted)', marginTop: 2, textAlign: 'center' }}>{app.timeline.find(t => t.stage === stage)?.date}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Applications() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--pf-border)', background: 'var(--pf-surface)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>My Applications</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{APPLICATIONS.length} applications submitted this season</p>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {APPLICATIONS.map(app => (
          <div key={app.id} style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--pf-border)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{app.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>{app.jobTitle}</div>
                <div style={{ color: 'var(--pf-text-secondary)', fontSize: 13 }}>{app.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge status={app.status} size="md" />
                <div style={{ color: 'var(--pf-text-muted)', fontSize: 11, marginTop: 4 }}>Applied {app.appliedAt}</div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: '20px 28px' }}>
              <Timeline app={app} />
              {/* Latest note */}
              {app.timeline[app.timeline.length - 1]?.note && (
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 6, background: 'var(--pf-bg)', border: '1px solid var(--pf-border)', fontSize: 13, color: 'var(--pf-text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--pf-text)' }}>Latest: </span>
                  {app.timeline[app.timeline.length - 1].note}
                </div>
              )}
            </div>
          </div>
        ))}

        {APPLICATIONS.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--pf-text-muted)' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No applications yet</div>
            <div style={{ fontSize: 14, marginBottom: 24 }}>You haven't applied to any opportunities yet.</div>
            <button onClick={() => navigate('/student/jobs')} style={{ color: 'var(--pf-teal)', background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Browse opportunities →</button>
          </div>
        )}
      </div>
    </div>
  )
}
