import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText, User, Settings,
  Users, Building2, ClipboardList, ChevronRight,
  GraduationCap,
} from 'lucide-react'
import type { Role } from '../../data/mock'

interface NavItem { label: string; path: string; icon: ReactNode }

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={16} /> },
  { label: 'Opportunities', path: '/student/jobs', icon: <Briefcase size={16} /> },
  { label: 'My Applications', path: '/student/applications', icon: <FileText size={16} /> },
  { label: 'Profile', path: '/student/profile', icon: <User size={16} /> },
]

const RECRUITER_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/recruiter', icon: <LayoutDashboard size={16} /> },
  { label: 'Job Postings', path: '/recruiter/jobs', icon: <Briefcase size={16} /> },
  { label: 'Applicants', path: '/recruiter/applicants', icon: <Users size={16} /> },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'Students', path: '/admin/students', icon: <GraduationCap size={16} /> },
  { label: 'Recruiters', path: '/admin/recruiters', icon: <Building2 size={16} /> },
  { label: 'Jobs', path: '/admin/jobs', icon: <Briefcase size={16} /> },
  { label: 'Applications', path: '/admin/applications', icon: <ClipboardList size={16} /> },
]

const NAV_MAP: Record<Role, NavItem[]> = {
  student: STUDENT_NAV,
  recruiter: RECRUITER_NAV,
  admin: ADMIN_NAV,
}

const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  recruiter: 'Recruiter',
  admin: 'Admin',
}

const ROLE_NAMES: Record<Role, string> = {
  student: 'Aryan Mehta',
  recruiter: 'Anita Desai',
  admin: 'Placement Office',
}

const ROLE_SUB: Record<Role, string> = {
  student: 'CSE — 4th Year',
  recruiter: 'Razorpay',
  admin: 'Coordinator',
}

interface SidebarProps {
  role: Role
  onRoleChange: (r: Role) => void
}

export default function Sidebar({ role, onRoleChange }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const nav = NAV_MAP[role]

  const isActive = (path: string) =>
    path === `/${role}` ? pathname === path : pathname.startsWith(path)

  return (
    <aside style={{
      width: 'var(--pf-sidebar-w)', minHeight: '100vh',
      background: 'var(--pf-navy)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--pf-teal)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 14 }}>P</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>PlaceForge</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{ROLE_LABELS[role]}</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(0,191,179,0.2)', border: '1.5px solid var(--pf-teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--pf-teal)', fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {ROLE_NAMES[role][0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ROLE_NAMES[role]}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>{ROLE_SUB[role]}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {nav.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 10px', borderRadius: 6, marginBottom: 2,
              background: isActive(item.path) ? 'rgba(0,191,179,0.12)' : 'transparent',
              color: isActive(item.path) ? 'var(--pf-teal)' : 'rgba(255,255,255,0.6)',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontSize: 13, fontWeight: isActive(item.path) ? 600 : 400,
              fontFamily: 'Inter, sans-serif', transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { if (!isActive(item.path)) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' } }}
            onMouseLeave={e => { if (!isActive(item.path)) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)' } }}
          >
            {item.icon}
            {item.label}
            {isActive(item.path) && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
          </button>
        ))}
      </nav>

      {/* Role switcher */}
      <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, padding: '0 10px' }}>Switch Role</div>
        {(['student', 'recruiter', 'admin'] as Role[]).map(r => (
          <button
            key={r}
            onClick={() => { onRoleChange(r); navigate(`/${r}`) }}
            style={{
              display: 'flex', alignItems: 'center', width: '100%',
              padding: '6px 10px', borderRadius: 6, marginBottom: 2,
              background: role === r ? 'rgba(0,191,179,0.12)' : 'transparent',
              color: role === r ? 'var(--pf-teal)' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: 'pointer', fontSize: 12,
              fontWeight: role === r ? 600 : 400, fontFamily: 'Inter, sans-serif',
              transition: 'background 0.12s',
            }}
          >
            <Settings size={12} style={{ marginRight: 8 }} />
            {ROLE_LABELS[r]}
          </button>
        ))}
      </div>
    </aside>
  )
}
