import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, FileText, ArrowUpDown } from 'lucide-react'
import { STUDENTS } from '../../data/mock'
import Badge from '../../components/ui/Badge'

const STATUS_OPTIONS = ['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']
const BRANCH_OPTIONS = ['All', 'CSE', 'IT', 'ECE', 'EEE']

export default function Applicants() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [branch, setBranch] = useState('All')
  const [sortCgpa, setSortCgpa] = useState<'asc' | 'desc' | null>(null)

  const chipStyle = (active: boolean) => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
    border: `1px solid ${active ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
    background: active ? 'var(--pf-teal-soft)' : 'var(--pf-surface)',
    color: active ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
    cursor: 'pointer', fontFamily: 'Inter',
  })

  let filtered = STUDENTS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.includes(search.toLowerCase())) return false
    if (branch !== 'All' && s.branch !== branch) return false
    return true
  })

  if (sortCgpa) filtered = [...filtered].sort((a, b) => sortCgpa === 'desc' ? b.cgpa - a.cgpa : a.cgpa - b.cgpa)

  // Mock statuses
  const mockStatuses = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Applied', 'Shortlisted', 'Applied']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Applicants</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} students across all your postings</p>
      </div>

      {/* Filters */}
      <div style={{ padding: '14px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicants…"
            style={{ padding: '7px 12px 7px 30px', borderRadius: 6, border: '1px solid var(--pf-border)', fontSize: 12, fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', outline: 'none', width: 220 }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-muted)', fontSize: 12 }}><Filter size={12} /> Branch:</div>
        {BRANCH_OPTIONS.map(b => <button key={b} style={chipStyle(branch === b)} onClick={() => setBranch(b)}>{b}</button>)}
        <div style={{ width: 1, height: 18, background: 'var(--pf-border)', margin: '0 4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-muted)', fontSize: 12 }}>Status:</div>
        {STATUS_OPTIONS.map(s => <button key={s} style={chipStyle(status === s)} onClick={() => setStatus(s)}>{s}</button>)}
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pf-bg)', borderBottom: '1px solid var(--pf-border)' }}>
                {['Student', 'Branch', '', 'CGPA', 'Skills', 'Applied', 'Status', 'Resume', 'Action'].map((h, idx) => (
                  <th key={h + idx} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h === 'CGPA' ? (
                      <button onClick={() => setSortCgpa(c => c === 'desc' ? 'asc' : 'desc')} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        CGPA <ArrowUpDown size={11} />
                      </button>
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pf-border)' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => navigate(`/recruiter/applicants/${s.id}`)}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                >
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--pf-navy)', color: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{s.branch}</td>
                  <td />
                  <td style={{ padding: '13px 18px', fontSize: 14, fontWeight: 700, color: s.cgpa >= 8.5 ? 'var(--pf-teal)' : 'var(--pf-text)' }}>{s.cgpa}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {s.skills.slice(0, 2).map(sk => (
                        <span key={sk} style={{ padding: '2px 7px', background: 'var(--pf-surface-elevated)', border: '1px solid var(--pf-border)', borderRadius: 3, fontSize: 11, color: 'var(--pf-text-secondary)' }}>{sk}</span>
                      ))}
                      {s.skills.length > 2 && <span style={{ fontSize: 11, color: 'var(--pf-text-muted)' }}>+{s.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: 'var(--pf-text-muted)', whiteSpace: 'nowrap' }}>Jan 2024</td>
                  <td style={{ padding: '13px 18px' }}><Badge status={mockStatuses[i % mockStatuses.length]} /></td>
                  <td style={{ padding: '13px 18px' }}>
                    <button style={{ color: 'var(--pf-teal)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600 }}>
                      <FileText size={13} /> View
                    </button>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <select style={{ fontSize: 12, border: '1px solid var(--pf-border)', borderRadius: 4, padding: '4px 6px', fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', cursor: 'pointer', outline: 'none' }}
                      onClick={e => e.stopPropagation()}>
                      <option>Update Status</option>
                      <option>Shortlist</option>
                      <option>Schedule Interview</option>
                      <option>Select</option>
                      <option>Reject</option>
                    </select>
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
