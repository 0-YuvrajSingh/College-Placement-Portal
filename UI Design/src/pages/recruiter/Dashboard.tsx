import { useNavigate } from 'react-router-dom'
import { JOBS, APPLICATIONS, STUDENTS } from '../../data/mock'
import { Briefcase, Users, Clock, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const myJobs = JOBS.slice(0, 3)
  const urgentJobs = myJobs.filter(j => j.closingSoon)
  const totalApplicants = myJobs.reduce((s, j) => s + j.applicants, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Recruiter Dashboard</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>Razorpay — Campus Hiring 2024</p>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        {[
          { icon: <Briefcase size={15} />, val: myJobs.length, label: 'Active Jobs', color: 'var(--pf-teal)' },
          { icon: <Users size={15} />, val: totalApplicants, label: 'Total Applicants', color: 'var(--pf-navy)' },
          { icon: <TrendingUp size={15} />, val: APPLICATIONS.filter(a => a.status === 'Shortlisted').length, label: 'Shortlisted', color: '#8b5cf6' },
          { icon: <AlertTriangle size={15} />, val: urgentJobs.length, label: 'Closing Soon', color: 'var(--pf-amber)' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '20px 28px', borderLeft: i > 0 ? '1px solid var(--pf-border)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--pf-text-secondary)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Active jobs */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>Active Job Postings</span>
              <Button size="sm" variant="primary" onClick={() => navigate('/recruiter/jobs')}>Manage Jobs</Button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-border)' }}>
                  {['Job Title', 'Status', 'Deadline', 'Applicants', ''].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job, i) => (
                  <tr key={job.id} style={{ borderBottom: i < myJobs.length - 1 ? '1px solid var(--pf-border)' : 'none' }}>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>{job.location}</div>
                    </td>
                    <td style={{ padding: '13px 20px' }}><Badge status={job.status} /></td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: job.closingSoon ? 'var(--pf-amber)' : 'var(--pf-text-secondary)' }}>
                      {job.closingSoon && <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                      {job.deadline}
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13, fontWeight: 700 }}>{job.applicants}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <button onClick={() => navigate('/recruiter/applicants')} style={{ color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                        Review <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent applicants */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>Recent Applicants</span>
              <button onClick={() => navigate('/recruiter/applicants')} style={{ color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                View all <ArrowRight size={11} />
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-border)' }}>
                  {['Student', 'Branch', 'CGPA', 'Applied For', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDENTS.slice(0, 4).map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < 3 ? '1px solid var(--pf-border)' : 'none' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{s.branch}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600 }}>{s.cgpa}</td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--pf-text-secondary)' }}>Frontend Dev Intern</td>
                    <td style={{ padding: '12px 20px' }}><Badge status="Applied" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick actions */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="primary" size="md" style={{ width: '100%' }}>Post a New Job</Button>
              <Button variant="outline" size="md" style={{ width: '100%' }} onClick={() => navigate('/recruiter/applicants')}>Review Applicants</Button>
            </div>
          </div>

          {/* Pipeline */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Applicant Pipeline</div>
            {[
              { label: 'Applied', count: 142, color: 'var(--pf-info)' },
              { label: 'Shortlisted', count: 28, color: 'var(--pf-amber)' },
              { label: 'Interview', count: 12, color: '#8b5cf6' },
              { label: 'Selected', count: 3, color: 'var(--pf-success)' },
            ].map(stage => (
              <div key={stage.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: 'var(--pf-text-secondary)' }}>{stage.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{stage.count}</span>
                </div>
                <div style={{ height: 5, background: 'var(--pf-surface-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(stage.count / 142) * 100}%`, background: stage.color, borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming deadlines */}
          {urgentJobs.length > 0 && (
            <div style={{ background: 'var(--pf-warning-soft)', border: '1px solid var(--pf-amber)', borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 10 }}>
                <AlertTriangle size={14} /> Closing Soon
              </div>
              {urgentJobs.map(j => (
                <div key={j.id} style={{ fontSize: 13, color: '#78350f', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{j.title}</span> · {j.deadline}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
