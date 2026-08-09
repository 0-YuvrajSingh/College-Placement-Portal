import { useNavigate } from 'react-router-dom'
import {
  Briefcase, CheckCircle, Clock, AlertTriangle,
  FileText, TrendingUp, ArrowRight, User, Upload,
} from 'lucide-react'
import { JOBS, APPLICATIONS, currentStudent } from '../../data/mock'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--pf-border)', background: 'var(--pf-surface)' }}>
      <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{subtitle}</p>}
    </div>
  )
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const eligible = JOBS.filter(j => j.eligible && !j.applied)
  const closing = JOBS.filter(j => j.closingSoon && j.eligible)

  const profilePct = currentStudent.profileComplete
  const profileSections = [
    { label: 'Personal Info', done: true },
    { label: 'Academic Details', done: true },
    { label: 'Skills', done: true },
    { label: 'Resume Uploaded', done: !!currentStudent.resumeUrl },
    { label: 'Work Experience', done: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <PageHeader
        title={`Good morning, ${currentStudent.name.split(' ')[0]}.`}
        subtitle="Here's your placement overview for today."
      />

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        {[
          { icon: <Briefcase size={16} />, val: eligible.length, label: 'Eligible Openings', color: 'var(--pf-teal)' },
          { icon: <FileText size={16} />, val: currentStudent.applications, label: 'Applications Sent', color: 'var(--pf-navy)' },
          { icon: <TrendingUp size={16} />, val: APPLICATIONS.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length, label: 'In Progress', color: '#8b5cf6' },
          { icon: <AlertTriangle size={16} />, val: closing.length, label: 'Closing Soon', color: 'var(--pf-amber)' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '0 24px', borderLeft: i > 0 ? '1px solid var(--pf-border)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: 'var(--pf-text-secondary)', fontSize: 12, marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Recommended jobs */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>Recommended Opportunities</span>
              <button onClick={() => navigate('/student/jobs')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {eligible.slice(0, 3).map((job, i) => (
                <div key={job.id} onClick={() => navigate(`/student/jobs/${job.id}`)} style={{
                  padding: '14px 20px', borderBottom: i < 2 ? '1px solid var(--pf-border)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'background 0.12s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{job.logo}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                    <div style={{ color: 'var(--pf-text-secondary)', fontSize: 12 }}>{job.company} · {job.location}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--pf-navy)' }}>{job.package}</div>
                    <div style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>Due {job.deadline}</div>
                  </div>
                  {job.closingSoon && <AlertTriangle size={14} style={{ color: 'var(--pf-amber)', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Recent applications */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>Recent Applications</span>
              <button onClick={() => navigate('/student/applications')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-border)' }}>
                  {['Company', 'Role', 'Applied', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {APPLICATIONS.map((app, i) => (
                  <tr key={app.id} style={{ borderBottom: i < APPLICATIONS.length - 1 ? '1px solid var(--pf-border)' : 'none' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 4, background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{app.logo}</div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{app.company}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{app.jobTitle}</td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--pf-text-muted)' }}>{app.appliedAt}</td>
                    <td style={{ padding: '12px 20px' }}><Badge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile completion */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 800, fontSize: 16 }}>
                {currentStudent.name[0]}
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>{currentStudent.name}</div>
                <div style={{ color: 'var(--pf-text-muted)', fontSize: 12 }}>{currentStudent.branch} · CGPA {currentStudent.cgpa}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--pf-text-secondary)', fontWeight: 600 }}>Profile Completeness</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: profilePct >= 80 ? 'var(--pf-success)' : 'var(--pf-amber)' }}>{profilePct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--pf-surface-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profilePct}%`, background: profilePct >= 80 ? 'var(--pf-teal)' : 'var(--pf-amber)', borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
            </div>

            {profileSections.map(sec => (
              <div key={sec.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle size={14} style={{ color: sec.done ? 'var(--pf-teal)' : 'var(--pf-border-strong)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: sec.done ? 'var(--pf-text)' : 'var(--pf-text-muted)' }}>{sec.label}</span>
              </div>
            ))}

            <Button variant="outline" size="sm" style={{ width: '100%', marginTop: 14 }} onClick={() => navigate('/student/profile')}>
              <User size={13} /> Complete Profile
            </Button>
          </div>

          {/* Deadlines */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--pf-border)' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} style={{ color: 'var(--pf-amber)' }} /> Upcoming Deadlines
              </span>
            </div>
            {closing.length === 0 ? (
              <div style={{ padding: '20px 18px', color: 'var(--pf-text-muted)', fontSize: 13 }}>No deadlines in the next 7 days.</div>
            ) : (
              closing.map((job, i) => (
                <div key={job.id} onClick={() => navigate(`/student/jobs/${job.id}`)} style={{
                  padding: '12px 18px', borderBottom: i < closing.length - 1 ? '1px solid var(--pf-border)' : 'none',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>{job.company}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-amber)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    <AlertTriangle size={12} /> {job.deadline}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resume status */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '18px' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Resume</div>
            {currentStudent.resumeUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--pf-success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} style={{ color: 'var(--pf-success)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pf-text)' }}>{currentStudent.resumeUrl}</div>
                  <div style={{ fontSize: 12, color: 'var(--pf-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <CheckCircle size={11} /> Ready for applications
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--pf-text-muted)', fontSize: 13, marginBottom: 12 }}>No resume uploaded yet. Upload to start applying.</p>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  <Upload size={13} /> Upload Resume
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
