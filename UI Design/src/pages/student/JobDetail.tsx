import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Banknote, Clock, Users, Briefcase,
  CheckCircle, AlertTriangle, Lock,
} from 'lucide-react'
import { JOBS } from '../../data/mock'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = JOBS.find(j => j.id === id)

  if (!job) return (
    <div style={{ padding: 64, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Job not found</div>
      <Button variant="outline" onClick={() => navigate('/student/jobs')}>Back to opportunities</Button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      {/* Back bar */}
      <div style={{ background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', padding: '14px 32px' }}>
        <button onClick={() => navigate('/student/jobs')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pf-text-secondary)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={14} /> Back to Opportunities
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
        {/* Main content */}
        <div>
          {/* Job header */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{job.logo}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>{job.title}</h1>
                <div style={{ color: 'var(--pf-text-secondary)', fontSize: 15, fontWeight: 500, marginBottom: 14 }}>{job.company}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} />{job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Briefcase size={13} />{job.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Banknote size={13} />{job.package}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} />Deadline: {job.deadline}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} />{job.applicants} applicants</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
              <Badge status={job.status} size="md" />
              {job.featured && <Badge status="Featured" size="md" />}
              {job.closingSoon && <Badge status="Closing Soon" size="md" />}
            </div>
          </div>

          {/* Description */}
          {[
            { title: 'About the Role', content: job.description },
          ].map(sec => (
            <div key={sec.title} style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{sec.title}</h2>
              <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14, lineHeight: 1.8 }}>{sec.content}</p>
            </div>
          ))}

          {/* Responsibilities */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Responsibilities</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {job.responsibilities.map(r => (
                <li key={r} style={{ display: 'flex', gap: 10, color: 'var(--pf-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                  <CheckCircle size={15} style={{ color: 'var(--pf-teal)', flexShrink: 0, marginTop: 2 }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Requirements</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {job.requirements.map(r => (
                <li key={r} style={{ display: 'flex', gap: 10, color: 'var(--pf-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pf-navy)', marginTop: 8, flexShrink: 0 }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Required Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {job.skills.map(s => (
                <span key={s} style={{ padding: '6px 14px', borderRadius: 4, background: 'var(--pf-navy)', color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky side panel */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: 'var(--pf-navy)', padding: '20px 22px' }}>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Package</div>
              <div style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 26, marginBottom: 4 }}>{job.package}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{job.type}</div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Deadline', val: job.deadline, icon: <Clock size={13} /> },
                  { label: 'Location', val: job.location, icon: <MapPin size={13} /> },
                  { label: 'Applicants', val: `${job.applicants} applied`, icon: <Users size={13} /> },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pf-text-muted)', fontSize: 12 }}>{row.icon} {row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pf-text)' }}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--pf-border)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 8 }}>Eligibility</div>
                {[
                  { label: `Branch: ${job.branch.join(', ')}`, ok: true },
                  { label: `Min CGPA: ${job.cgpa}`, ok: true },
                  { label: 'No active backlogs', ok: job.eligible },
                ].map(e => (
                  <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, color: e.ok ? 'var(--pf-text-secondary)' : 'var(--pf-danger)' }}>
                    {e.ok ? <CheckCircle size={13} style={{ color: 'var(--pf-teal)' }} /> : <AlertTriangle size={13} style={{ color: 'var(--pf-danger)' }} />}
                    {e.label}
                  </div>
                ))}
              </div>

              {job.applied ? (
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--pf-teal-soft)', borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--pf-teal)', fontWeight: 700, fontSize: 14 }}>
                    <CheckCircle size={15} /> Application Submitted
                  </div>
                  <div style={{ color: 'var(--pf-text-secondary)', fontSize: 12, marginTop: 4 }}>Track status in My Applications</div>
                </div>
              ) : job.eligible ? (
                <Button variant="primary" size="lg" style={{ width: '100%' }}>Apply Now</Button>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--pf-surface-elevated)', borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--pf-text-muted)', fontWeight: 600, fontSize: 13 }}>
                    <Lock size={14} /> Not Eligible
                  </div>
                  <div style={{ color: 'var(--pf-text-muted)', fontSize: 12, marginTop: 4 }}>You don't meet the eligibility criteria for this role.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
