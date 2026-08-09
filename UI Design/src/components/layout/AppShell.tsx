import { type ReactNode } from 'react'
import Sidebar from './Sidebar'
import type { Role } from '../../data/mock'

interface AppShellProps {
  role: Role
  onRoleChange: (r: Role) => void
  children: ReactNode
}

export default function AppShell({ role, onRoleChange, children }: AppShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} onRoleChange={onRoleChange} />
      <main style={{
        marginLeft: 'var(--pf-sidebar-w)',
        flex: 1, minWidth: 0,
        background: 'var(--pf-bg)',
      }}>
        {children}
      </main>
    </div>
  )
}
