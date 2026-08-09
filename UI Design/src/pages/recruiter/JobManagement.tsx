import { useState } from 'react'
import { Search, Eye, Edit2, XCircle, Trash2, Plus, AlertTriangle } from 'lucide-react'
import { JOBS } from '../../data/mock'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function JobManagement() {
  const [search, setSearch] = useState('')
  const [confirmClose, setConfirmClose] = useState<string | null>(null)

  const filtered = JOBS.filter(j =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Job Postings</h1>
          <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} postings</p>
        </div>
        <Button variant="primary" size="md"><Plus size={14} /> Post New Job</Button>
      </div>

      <div style={{ padding: '16px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…"
            style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 6, border: '1px solid var(--pf-border)', fontSize: 13, fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', outline: 'none' }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: 'var(--pf-surface)', border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pf-bg)', borderBottom: '1px solid var(--pf-border)' }}>
                {['Job Title', 'Status', 'Deadline', 'Applicants', 'Type', 'Posted', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--pf-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr key={job.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pf-border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--pf-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>{job.location}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}><Badge status={job.status} /></td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: job.closingSoon ? 'var(--pf-amber)' : 'var(--pf-text-secondary)', whiteSpace: 'nowrap' }}>
                    {job.closingSoon && <AlertTriangle size={12} style={{ marginRight: 3 }} />}
                    {job.deadline}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700 }}>{job.applicants}</td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--pf-text-secondary)' }}>{job.type}</td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--pf-text-muted)', whiteSpace: 'nowrap' }}>{job.createdAt}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button title="View" style={{ padding: '5px', borderRadius: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Eye size={14} /></button>
                      <button title="Edit" style={{ padding: '5px', borderRadius: 5, color: 'var(--pf-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                      <button title="Close" onClick={() => setConfirmClose(job.id)} style={{ padding: '5px', borderRadius: 5, color: 'var(--pf-amber)', background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={14} /></button>
                      <button title="Delete" style={{ padding: '5px', borderRadius: 5, color: 'var(--pf-danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmClose && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '28px', maxWidth: 400, width: '90%' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>Close this job posting?</h3>
            <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Students will no longer be able to apply. You can reopen it later if needed.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setConfirmClose(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => setConfirmClose(null)}>Close Posting</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
