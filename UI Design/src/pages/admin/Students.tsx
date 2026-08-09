import { useState } from 'react'
import { Search, Eye, MoreHorizontal } from 'lucide-react'
import { STUDENTS } from '../../data/mock'
import Badge from '../../components/ui/Badge'

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('All')
  const [status, setStatus] = useState('All')

  const filtered = STUDENTS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (branch !== 'All' && s.branch !== branch) return false
    if (status !== 'All' && s.status !== status) return false
    return true
  })

  const chips = (val: string, active: string, setFn: (v: string) => void, opts: string[]) =>
    opts.map(o => (
      <button key={o} onClick={() => setFn(o)} style={{
        padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
        border: `1px solid ${active === o ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
        background: active === o ? 'var(--pf-teal-soft)' : 'var(--pf-surface)',
        color: active === o ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
        cursor: 'pointer', fontFamily: 'Inter',
      }}>{o}</button>
    ))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Students</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} registered students</p>
      </div>

      <div style={{ padding: '14px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
            style={{ padding: '7px 12px 7px 30px', borderRadius: 6, border: '1px solid var(--pf-border)', fontSize: 12, fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', outline: 'none', width: 220 }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
        </div>
        <span style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>Branch:</span>
        {chips(branch, branch, setBranch, ['All', 'CSE', 'IT', 'ECE', 'EEE'])}
        <span style={{ fontSize: 12, color: 'var(--pf-text-muted)', marginLeft: 8 }}>Status:</span>
        {chips(status, status, setStatus, ['All', 'Active', 'Placed', 'Inactive'])}
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pf-bg)', borderBottom: '1px solid var(--pf-border)' }}>
                {['Student', 'Branch', 'CGPA', 'Grad Year', 'Profile', 'Applications', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pf-border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{s.branch}</td>
                  <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 700, color: s.cgpa >= 8.5 ? 'var(--pf-teal)' : 'var(--pf-text)' }}>{s.cgpa}</td>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: 'var(--pf-text-secondary)' }}>2024</td>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, maxWidth: 60, height: 4, background: 'var(--pf-surface-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.profileComplete}%`, background: s.profileComplete >= 80 ? 'var(--pf-teal)' : 'var(--pf-amber)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>{s.profileComplete}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{s.applications}</td>
                  <td style={{ padding: '12px 18px' }}><Badge status={s.status} /></td>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ padding: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}><Eye size={14} /></button>
                      <button style={{ padding: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}><MoreHorizontal size={14} /></button>
                    </div>
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
