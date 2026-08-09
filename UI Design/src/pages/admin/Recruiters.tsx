import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react'
import { RECRUITERS } from '../../data/mock'
import Badge from '../../components/ui/Badge'

export default function AdminRecruiters() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const filtered = RECRUITERS.filter(r => {
    if (search && !r.company.toLowerCase().includes(search.toLowerCase()) && !r.name.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'All' && r.status !== status) return false
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Recruiters</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} registered companies</p>
      </div>

      <div style={{ padding: '14px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…"
            style={{ padding: '7px 12px 7px 30px', borderRadius: 6, border: '1px solid var(--pf-border)', fontSize: 12, fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', outline: 'none', width: 220 }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
        </div>
        <span style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>Status:</span>
        {['All', 'Active', 'Pending', 'Suspended'].map(s => (
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
                {['Company', 'Recruiter', 'Email', 'Jobs', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pf-border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                >
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{r.company[0]}</div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.company}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{r.name}</td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: 'var(--pf-text-muted)' }}>{r.email}</td>
                  <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{r.jobs}</td>
                  <td style={{ padding: '13px 18px' }}><Badge status={r.status} /></td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: 'var(--pf-text-muted)', whiteSpace: 'nowrap' }}>{r.createdAt}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ padding: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }} title="View"><Eye size={14} /></button>
                      {r.status === 'Pending' && <>
                        <button style={{ padding: 5, color: 'var(--pf-success)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }} title="Approve"><CheckCircle size={14} /></button>
                        <button style={{ padding: 5, color: 'var(--pf-danger)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }} title="Reject"><XCircle size={14} /></button>
                      </>}
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
