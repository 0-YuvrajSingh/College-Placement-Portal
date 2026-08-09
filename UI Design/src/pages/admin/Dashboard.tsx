import { useNavigate } from 'react-router-dom'
import { STUDENTS, RECRUITERS, JOBS, APPLICATIONS } from '../../data/mock'
import { ArrowRight } from 'lucide-react'
import Badge from '../../components/ui/Badge'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const placed = STUDENTS.filter(s => s.status === 'Placed').length
  const totalApps = APPLICATIONS.length + 256
  const selected = 47
  const shortlisted = 89

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Admin Console</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>Placement Season 2023–24 · NITK Surathkal</p>
      </div>

      {/* Primary overview — asymmetric split */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 20, marginBottom: 20 }}>
          {/* Left — placement pulse */}
          <div style={{ background: 'var(--pf-navy)', borderRadius: 8, padding: '24px 28px', color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Placement Pulse</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { val: STUDENTS.length, label: 'Registered Students', color: '#fff' },
                { val: placed, label: 'Students Placed', color: 'var(--pf-teal)' },
                { val: `${Math.round((placed / STUDENTS.length) * 100)}%`, label: 'Placement Rate', color: 'var(--pf-amber)' },
                { val: RECRUITERS.length, label: 'Active Companies', color: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — pipeline */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, padding: '24px 28px' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Recruitment Pipeline</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Applied', val: totalApps, pct: 100, color: 'var(--pf-info)' },
                { label: 'Shortlisted', val: shortlisted, pct: Math.round((shortlisted / totalApps) * 100), color: 'var(--pf-amber)' },
                { label: 'Interview', val: 34, pct: Math.round((34 / totalApps) * 100), color: '#8b5cf6' },
                { label: 'Selected', val: selected, pct: Math.round((selected / totalApps) * 100), color: 'var(--pf-success)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--pf-text-muted)', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ height: 4, background: 'var(--pf-surface-elevated)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderTop: '1px solid var(--pf-border)', paddingTop: 16 }}>
              {[
                { label: 'Total Jobs Posted', val: JOBS.length },
                { label: 'Open Jobs', val: JOBS.filter(j => j.status === 'Open').length },
                { label: 'Total Applications', val: totalApps },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: '0 16px', borderLeft: i > 0 ? '1px solid var(--pf-border)' : 'none' }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--pf-text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent students */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>Recent Students</span>
              <button onClick={() => navigate('/admin/students')} style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>All students <ArrowRight size={11} /></button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-border)' }}>
                  {['Student', 'Branch', 'CGPA', 'Status'].map(h => (
                    <th key={h} style={{ padding: '9px 18px', fontSize: 10, fontWeight: 600, color: 'var(--pf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDENTS.slice(0, 5).map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < 4 ? '1px solid var(--pf-border)' : 'none' }}>
                    <td style={{ padding: '11px 18px', fontWeight: 500, fontSize: 13 }}>{s.name}</td>
                    <td style={{ padding: '11px 18px', fontSize: 12, color: 'var(--pf-text-secondary)' }}>{s.branch}</td>
                    <td style={{ padding: '11px 18px', fontSize: 13, fontWeight: 600 }}>{s.cgpa}</td>
                    <td style={{ padding: '11px 18px' }}><Badge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent recruiters */}
          <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>Companies</span>
              <button onClick={() => navigate('/admin/recruiters')} style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>All companies <ArrowRight size={11} /></button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-border)' }}>
                  {['Company', 'Contact', 'Jobs', 'Status'].map(h => (
                    <th key={h} style={{ padding: '9px 18px', fontSize: 10, fontWeight: 600, color: 'var(--pf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECRUITERS.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < RECRUITERS.length - 1 ? '1px solid var(--pf-border)' : 'none' }}>
                    <td style={{ padding: '11px 18px', fontWeight: 600, fontSize: 13 }}>{r.company}</td>
                    <td style={{ padding: '11px 18px', fontSize: 12, color: 'var(--pf-text-secondary)' }}>{r.name}</td>
                    <td style={{ padding: '11px 18px', fontSize: 13, fontWeight: 600 }}>{r.jobs}</td>
                    <td style={{ padding: '11px 18px' }}><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
