import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import { STUDENTS } from '../../data/mock'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

export default function ApplicantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = STUDENTS.find(s => s.id === id) ?? STUDENTS[0]
  const [status, setStatus] = useState<string>('Applied')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', padding: '14px 32px' }}>
        <button onClick={() => navigate('/recruiter/applicants')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pf-text-secondary)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={14} /> Back to Applicants
        </button>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Identity */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{student.name[0]}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{student.name}</h1>
                <div style={{ color: 'var(--pf-text-secondary)', fontSize: 14, marginBottom: 8 }}>{student.email}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Badge status={student.status} size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Academic */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '20px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Academic Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Branch', val: student.branch },
                { label: 'CGPA', val: student.cgpa.toString() },
                { label: 'Graduation Year', val: '2024' },
                { label: 'Institution', val: 'NITK Surathkal' },
                { label: '10th', val: '94.6%' },
                { label: '12th', val: '91.2%' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '20px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {student.skills.map(s => (
                <span key={s} style={{ padding: '5px 12px', borderRadius: 4, background: 'var(--pf-navy)', color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '20px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Resume</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--pf-teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} style={{ color: 'var(--pf-teal)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name.toLowerCase().replace(' ', '_')}_resume.pdf</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-success)', fontSize: 12, fontWeight: 600, marginTop: 3 }}>
                  <CheckCircle size={12} /> Verified
                </div>
              </div>
              <Button size="sm" variant="outline">Download</Button>
            </div>
          </div>
        </div>

        {/* Status panel */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: 'var(--pf-navy)', padding: '18px 20px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Application for</div>
              <div style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>Frontend Dev Intern</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 3 }}>Applied Jan 16, 2024</div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pf-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</div>
                <Badge status={status} size="md" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {STATUSES.filter(s => s !== status).map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={{
                      padding: '8px 14px', borderRadius: 6, border: '1px solid var(--pf-border)',
                      background: 'var(--pf-bg)', color: 'var(--pf-text)',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter',
                      textAlign: 'left', transition: 'background 0.12s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--pf-surface-elevated)'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--pf-bg)'}
                    >
                      Move to {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
