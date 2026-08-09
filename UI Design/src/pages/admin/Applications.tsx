import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { STUDENTS, JOBS } from '../../data/mock'
import Badge from '../../components/ui/Badge'

const ALL_STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

const mockApps = STUDENTS.flatMap((s, si) =>
  JOBS.slice(si % 3, (si % 3) + 2).map((j, ji) => ({
    id: `${s.id}-${j.id}`,
    student: s.name,
    studentEmail: s.email,
    job: j.title,
    company: j.company,
    appliedAt: `2024-01-${10 + si + ji}`,
    status: ALL_STATUSES[(si + ji) % ALL_STATUSES.length],
  }))
)

export default function AdminApplications() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const filtered = mockApps.filter(a => {
    if (search && !a.student.toLowerCase().includes(search.toLowerCase()) && !a.job.toLowerCase().includes(search.toLowerCase()) && !a.company.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'All' && a.status !== status) return false
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Applications</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} applications this season</p>
      </div>

      <div style={{ padding: '14px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications…"
            style={{ padding: '7px 12px 7px 30px', borderRadius: 6, border: '1px solid var(--pf-border)', fontSize: 12, fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', outline: 'none', width: 240 }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
        </div>
        <span style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>Status:</span>
        {['All', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setStatus(s)} style={{
            padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
            border: `1px solid ${status === s ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
            background: status === s ? 'var(--pf-teal-soft)' : 'var(--pf-surface)',
            color: status === s ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
            cursor: 'pointer', fontFamily: 'Inter',
          }}>{s}</button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pf-bg)', borderBottom: '1px solid var(--pf-border)' }}>
                {['Student', 'Job', 'Company', 'Applied', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pf-border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.student}</div>
                    <div style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>{a.studentEmail}</div>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{a.job}</td>
                  <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 500 }}>{a.company}</td>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: 'var(--pf-text-muted)', whiteSpace: 'nowrap' }}>{a.appliedAt}</td>
                  <td style={{ padding: '12px 18px' }}><Badge status={a.status} /></td>
                  <td style={{ padding: '12px 18px' }}>
                    <button style={{ padding: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
