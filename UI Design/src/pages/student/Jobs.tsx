import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { JOBS } from '../../data/mock'
import JobCard from '../../components/cards/JobCard'

const TYPES = ['All', 'Full-time', 'Internship', 'Contract']
const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EEE']
const SORT_OPTIONS = ['Deadline (Soonest)', 'Package (Highest)', 'Applicants (Fewest)']

export default function StudentJobs() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [branch, setBranch] = useState('All')
  const [sort, setSort] = useState('Deadline (Soonest)')
  const [eligibleOnly, setEligibleOnly] = useState(false)

  let filtered = JOBS.filter(j => {
    const q = search.toLowerCase()
    if (q && !j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q) && !j.skills.some(s => s.toLowerCase().includes(q))) return false
    if (type !== 'All' && j.type !== type) return false
    if (branch !== 'All' && !j.branch.includes(branch)) return false
    if (eligibleOnly && !j.eligible) return false
    return true
  })

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Package (Highest)') return b.package.localeCompare(a.package)
    if (sort === 'Applicants (Fewest)') return a.applicants - b.applicants
    return a.deadline.localeCompare(b.deadline)
  })

  const chipsStyle = (active: boolean) => ({
    padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 600,
    border: `1px solid ${active ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
    background: active ? 'var(--pf-teal-soft)' : 'var(--pf-surface)',
    color: active ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.12s',
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--pf-border)', background: 'var(--pf-surface)' }}>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Opportunities</h1>
        <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14 }}>{filtered.length} openings match your profile</p>
      </div>

      <div style={{ padding: '20px 32px', background: 'var(--pf-surface)', borderBottom: '1px solid var(--pf-border)' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14, maxWidth: 480 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, company, or skill…"
            style={{
              width: '100%', padding: '9px 14px 9px 36px', borderRadius: 6,
              border: '1px solid var(--pf-border)', background: '#fff',
              fontSize: 13, color: 'var(--pf-text)', fontFamily: 'Inter', outline: 'none',
            }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-text-muted)', padding: 0 }}><X size={14} /></button>}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-secondary)', fontSize: 12, fontWeight: 600 }}>
            <SlidersHorizontal size={13} /> Type:
          </div>
          {TYPES.map(t => <button key={t} style={chipsStyle(type === t)} onClick={() => setType(t)}>{t}</button>)}
          <div style={{ width: 1, height: 20, background: 'var(--pf-border)', margin: '0 4px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pf-text-secondary)', fontSize: 12, fontWeight: 600 }}>Branch:</div>
          {BRANCHES.map(b => <button key={b} style={chipsStyle(branch === b)} onClick={() => setBranch(b)}>{b}</button>)}
          <div style={{ width: 1, height: 20, background: 'var(--pf-border)', margin: '0 4px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: eligibleOnly ? 'var(--pf-teal)' : 'var(--pf-text-secondary)' }}>
            <input type="checkbox" checked={eligibleOnly} onChange={e => setEligibleOnly(e.target.checked)} style={{ accentColor: 'var(--pf-teal)' }} />
            Eligible only
          </label>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--pf-text-muted)' }}>Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 12, border: '1px solid var(--pf-border)', borderRadius: 5, padding: '4px 8px', fontFamily: 'Inter', background: '#fff', color: 'var(--pf-text)', cursor: 'pointer', outline: 'none' }}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--pf-text-muted)' }}>
            <Search size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No opportunities match your filters</div>
            <div style={{ fontSize: 13 }}>Try adjusting your search or removing some filters.</div>
          </div>
        ) : (
          filtered.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  )
}
