import { useState } from 'react'
import { Upload, CheckCircle, Edit2, FileText, Plus } from 'lucide-react'
import { currentStudent } from '../../data/mock'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const inputStyle = {
  width: '100%', padding: '9px 13px', borderRadius: 6,
  border: '1px solid var(--pf-border)', background: '#fff',
  fontSize: 13, color: 'var(--pf-text)', fontFamily: 'Inter, sans-serif', outline: 'none',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, marginBottom: 20 }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-muted)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Edit2 size={12} /> Edit
        </button>
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
      <div style={{ fontSize: 14, color: 'var(--pf-text)', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

export default function Profile() {
  const [skills, setSkills] = useState(currentStudent.skills)
  const [newSkill, setNewSkill] = useState('')
  const pct = currentStudent.profileComplete

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--pf-border)', background: 'var(--pf-surface)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Career Profile</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>Keep your profile up to date to improve visibility with recruiters.</p>
      </div>

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div>
          {/* Identity */}
          <Section title="Personal Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Field label="Full Name" value={currentStudent.name} />
              <Field label="Email" value={currentStudent.email} />
              <Field label="Roll Number" value="21CS001" />
              <Field label="Phone" value="+91 98765 43210" />
            </div>
          </Section>

          {/* Academic */}
          <Section title="Academic Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <Field label="Branch" value={currentStudent.branch} />
              <Field label="CGPA" value={`${currentStudent.cgpa} / 10`} />
              <Field label="Graduation Year" value="2024" />
              <Field label="Institution" value="NITK Surathkal" />
              <Field label="10th (%) " value="94.6" />
              <Field label="12th (%)" value="91.2" />
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {skills.map(s => (
                <span key={s} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 4,
                  background: 'var(--pf-navy)', color: 'var(--pf-teal)',
                  fontSize: 12, fontWeight: 600,
                }}>
                  {s}
                  <button onClick={() => setSkills(skills.filter(x => x !== s))} style={{ color: 'rgba(0,191,179,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newSkill} onChange={e => setNewSkill(e.target.value)}
                placeholder="Add a skill…" style={{ ...inputStyle, flex: 1 }}
                onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill('') } }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
              />
              <Button size="sm" variant="outline" onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill('') } }}>
                <Plus size={13} /> Add
              </Button>
            </div>
          </Section>

          {/* Resume */}
          <Section title="Resume">
            {currentStudent.resumeUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--pf-teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={22} style={{ color: 'var(--pf-teal)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{currentStudent.resumeUrl}</div>
                  <div style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>PDF · Uploaded Jan 2024</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-success)', fontSize: 12, fontWeight: 600, marginTop: 3 }}>
                    <CheckCircle size={12} /> Profile ready for applications
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="ghost">Replace</Button>
                </div>
              </div>
            ) : (
              <div style={{ border: '2px dashed var(--pf-border)', borderRadius: 8, padding: '32px', textAlign: 'center' }}>
                <Upload size={24} style={{ color: 'var(--pf-text-muted)', marginBottom: 12 }} />
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Upload your resume</div>
                <div style={{ fontSize: 13, color: 'var(--pf-text-muted)', marginBottom: 16 }}>PDF, max 5MB</div>
                <Button size="sm" variant="primary">Choose file</Button>
              </div>
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          {/* Completeness */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '20px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Profile Completeness</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 32, color: pct >= 80 ? 'var(--pf-teal)' : 'var(--pf-amber)' }}>{pct}%</span>
              <span style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>complete</span>
            </div>
            <div style={{ height: 6, background: 'var(--pf-surface-elevated)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--pf-teal)' : 'var(--pf-amber)', borderRadius: 3 }} />
            </div>
            {[
              { label: 'Personal Info', done: true },
              { label: 'Academic Details', done: true },
              { label: 'Skills Added', done: true },
              { label: 'Resume Uploaded', done: !!currentStudent.resumeUrl },
              { label: 'Work Experience', done: false },
            ].map(sec => (
              <div key={sec.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle size={14} style={{ color: sec.done ? 'var(--pf-teal)' : 'var(--pf-border-strong)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: sec.done ? 'var(--pf-text)' : 'var(--pf-text-muted)' }}>{sec.label}</span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Placement Status</div>
            <div style={{ marginBottom: 8 }}><Badge status={currentStudent.status} size="md" /></div>
            <div style={{ fontSize: 13, color: 'var(--pf-text-secondary)', lineHeight: 1.6 }}>
              You are currently active in the 2023–24 placement season.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
