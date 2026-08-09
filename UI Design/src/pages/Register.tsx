import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import type { Role } from '../data/mock'

interface RegisterProps { onLogin: (r: Role) => void }

export default function Register({ onLogin }: RegisterProps) {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)

  const handleRegister = () => {
    setLoading(true)
    setTimeout(() => { onLogin(role); navigate(`/${role}`) }, 800)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 6,
    border: '1px solid var(--pf-border)', background: '#fff',
    fontSize: 14, color: 'var(--pf-text)', fontFamily: 'Inter, sans-serif', outline: 'none',
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--pf-teal)')
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--pf-border)')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', minHeight: '100vh' }}>
      {/* Left */}
      <div style={{
        background: 'var(--pf-navy)', padding: '48px 56px', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(var(--pf-teal) 1px, transparent 1px), linear-gradient(90deg, var(--pf-teal) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--pf-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 14 }}>P</span>
            </div>
            <span style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 18 }}>PlaceForge</span>
          </div>
          <h1 style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 32, lineHeight: 1.2, marginBottom: 20 }}>
            Join the platform<br />powering campus<br /><span style={{ color: 'var(--pf-teal)' }}>recruitment.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            Create your account in under two minutes and start accessing or posting opportunities right away.
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Create account</h2>
          <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14, marginBottom: 28 }}>
            Already have one? <button onClick={() => navigate('/login')} style={{ color: 'var(--pf-teal)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0 }}>Sign in</button>
          </p>

          {/* Role */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>I am a</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['student', 'recruiter', 'admin'] as Role[]).map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '8px 4px', borderRadius: 6,
                  border: `1.5px solid ${role === r ? 'var(--pf-teal)' : 'var(--pf-border)'}`,
                  background: role === r ? 'var(--pf-teal-soft)' : '#fff',
                  color: role === r ? 'var(--pf-teal)' : 'var(--pf-text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  textTransform: 'capitalize',
                }}>{r}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>First name</label>
                <input style={inputStyle} placeholder="Aryan" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Last name</label>
                <input style={inputStyle} placeholder="Mehta" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
              <input type="email" style={inputStyle} placeholder={role === 'student' ? 'you@college.edu' : 'you@company.com'} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            {role === 'student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Branch</label>
                    <select style={{ ...inputStyle, appearance: 'none' }} onFocus={focusStyle} onBlur={blurStyle}>
                      <option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option><option>Mech</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>CGPA</label>
                    <input type="number" step="0.1" min="0" max="10" style={inputStyle} placeholder="8.5" onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Roll Number</label>
                  <input style={inputStyle} placeholder="21CS001" onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </>
            )}
            {role === 'recruiter' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Company</label>
                <input style={inputStyle} placeholder="Infosys" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pf-text-secondary)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
              <input type="password" style={inputStyle} placeholder="Min 8 characters" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          <Button variant="primary" size="lg" style={{ width: '100%' }} loading={loading} onClick={handleRegister}>
            Create account <ArrowRight size={14} />
          </Button>
          <p style={{ color: 'var(--pf-text-muted)', fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
