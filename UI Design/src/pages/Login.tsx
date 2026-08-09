import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import type { Role } from '../data/mock'

interface LoginProps { onLogin: (r: Role) => void }

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      onLogin(role)
      navigate(`/${role}`)
    }, 800)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 6,
    border: '1px solid var(--pf-border)', background: '#fff',
    fontSize: 14, color: 'var(--pf-text)', fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'border-color 0.15s',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', minHeight: '100vh' }}>
      {/* Left — brand panel */}
      <div style={{
        background: 'var(--pf-navy)', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(var(--pf-teal) 1px, transparent 1px), linear-gradient(90deg, var(--pf-teal) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 14 }}>P</span>
            </div>
            <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 18 }}>PlaceForge</span>
          </div>
          <h1 style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 36, lineHeight: 1.15, marginBottom: 20 }}>
            One platform.<br />
            <span style={{ color: 'var(--pf-teal)' }}>Every placement step.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
            From the first job post to the final offer letter — PlaceForge keeps students, recruiters, and placement coordinators aligned throughout campus recruitment.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          {[
            { val: '847', label: 'Registered Students' },
            { val: '124', label: 'Partner Companies' },
            { val: '91%', label: 'Placement Rate' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{s.label}</span>
              <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 22 }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 360, width: '100%' }}>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Sign in</h2>
          <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14, marginBottom: 32 }}>
            New to PlaceForge? <button onClick={() => navigate('/register')} style={{ color: 'var(--pf-teal)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0 }}>Create an account</button>
          </p>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Sign in as</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['student', 'recruiter', 'admin'] as Role[]).map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '8px 4px', borderRadius: 6,
                  border: `1.5px solid ${role === r ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
                  background: role === r ? 'var(--pf-teal-soft)' : '#fff',
                  color: role === r ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  textTransform: 'capitalize', transition: 'all 0.12s',
                }}>{r}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu" style={inputStyle}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-teal)'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--pf-border)'}
                />
                <button onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-text-muted)', padding: 0,
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" style={{ width: '100%' }} loading={loading} onClick={handleLogin}>
            Sign in <ArrowRight size={14} />
          </Button>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button style={{ color: 'var(--pf-text-muted)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
