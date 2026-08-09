import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'var(--pf-navy)', borderBottom: '1px solid rgba(255,255,255,0.08)',
      height: 56,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: 30, height: 30, borderRadius: 7, background: 'var(--pf-teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 13 }}>P</span>
          </div>
          <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>PlaceForge</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['How it works', 'For Recruiters', 'For Students'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'}
            >{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/login')}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get started</Button>
        </div>
      </div>
    </header>
  )
}
