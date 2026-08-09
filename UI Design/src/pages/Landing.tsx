import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Zap, Shield, BarChart2, Users, GraduationCap, Building2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: 'var(--pf-teal)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Manrope', fontWeight: 800, fontSize: 14, flexShrink: 0,
      }}>{n}</div>
      <div>
        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
        <div style={{ color: 'var(--pf-text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}

function Benefit({ icon, title, points }: { icon: React.ReactNode; title: string; points: string[] }) {
  return (
    <div style={{ borderTop: '2px solid var(--pf-border)', paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ color: 'var(--pf-teal)' }}>{icon}</div>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16 }}>{title}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {points.map(p => (
          <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--pf-text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
            <CheckCircle size={14} style={{ color: 'var(--pf-teal)', marginTop: 2, flexShrink: 0 }} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pf-bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'var(--pf-navy)', paddingTop: 56,
        minHeight: '76vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--pf-teal) 1px, transparent 1px), linear-gradient(90deg, var(--pf-teal) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,191,179,0.12)', border: '1px solid rgba(0,191,179,0.2)',
                borderRadius: 6, padding: '5px 12px', marginBottom: 24,
                color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              }}>
                <Zap size={12} /> Campus Recruitment Platform
              </div>
              <h1 style={{
                color: '#fff', fontFamily: 'Manrope', fontWeight: 800,
                fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.1,
                letterSpacing: '-1px', marginBottom: 24,
              }}>
                From campus<br />
                <span style={{ color: 'var(--pf-teal)' }}>opportunity</span> to<br />
                career.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
                PlaceForge connects students, recruiters, and placement coordinators on one platform — streamlining every step from job discovery to final selection.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button size="lg" variant="primary" onClick={() => navigate('/student')} style={{ gap: 8 }}>
                  Explore Opportunities <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}>
                  Recruiter Login
                </Button>
              </div>
            </div>

            {/* Stats panel */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: 28,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>2023–24 Placement Season</div>
              {[
                { val: '847', label: 'Students Registered', color: '#fff' },
                { val: '124', label: 'Companies Recruited', color: 'var(--pf-teal)' },
                { val: '₹18.4L', label: 'Highest Package', color: 'var(--pf-amber)' },
                { val: '91%', label: 'Placement Rate', color: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{s.label}</span>
                  <span style={{ color: s.color, fontFamily: 'Manrope', fontWeight: 800, fontSize: 20 }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ color: 'var(--pf-teal)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Process</div>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, lineHeight: 1.2, marginBottom: 16 }}>How recruitment works on PlaceForge</h2>
            <p style={{ color: 'var(--pf-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>A structured workflow that removes friction from every stage of campus hiring.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Step n="01" title="Discover Opportunities" desc="Students browse verified job postings filtered by branch, CGPA, and employment type. Eligibility is shown upfront — no wasted effort." />
            <Step n="02" title="Apply with One Click" desc="Complete your profile once. Apply to any open position instantly with your stored academic record and resume." />
            <Step n="03" title="Recruiters Review" desc="Companies shortlist, schedule interviews, and update application status directly through the platform." />
            <Step n="04" title="Track to Selection" desc="Every status change is visible in real time — from applied through shortlisted, interviewed, and selected." />
          </div>
        </div>
      </section>

      {/* Role overview */}
      <section style={{ background: 'var(--pf-surface)', borderTop: '1px solid var(--pf-border)', borderBottom: '1px solid var(--pf-border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ color: 'var(--pf-teal)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Platform</div>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28 }}>Built for everyone involved in placement</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--pf-border)', borderRadius: 8, overflow: 'hidden' }}>
            {[
              {
                icon: <GraduationCap size={20} />, label: 'Students',
                heading: 'Your career journey starts here',
                desc: 'Discover relevant opportunities, track every application, and keep your career profile recruiter-ready — all in one place.',
                action: 'View Student Dashboard', path: '/student',
              },
              {
                icon: <Building2 size={20} />, label: 'Recruiters',
                heading: 'Hire from top engineering colleges',
                desc: 'Post openings, manage applications, shortlist candidates, and close hires through an efficient structured workflow.',
                action: 'View Recruiter Portal', path: '/recruiter',
              },
              {
                icon: <Users size={20} />, label: 'Placement Teams',
                heading: 'Centralize your placement operations',
                desc: 'Monitor all recruitment activity, manage student and company accounts, and report placement outcomes from one admin console.',
                action: 'View Admin Console', path: '/admin',
              },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '32px 28px',
                  borderLeft: i > 0 ? '1px solid var(--pf-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ color: 'var(--pf-teal)' }}>{item.icon}</div>
                  <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: 'var(--pf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
                </div>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, marginBottom: 12, lineHeight: 1.3 }}>{item.heading}</h3>
                <p style={{ color: 'var(--pf-text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>{item.desc}</p>
                <button onClick={() => navigate(item.path)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--pf-teal)', fontSize: 13, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.action} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
          <Benefit icon={<GraduationCap size={18} />} title="For Students" points={[
            'Discover opportunities filtered to your eligibility',
            'Real-time application status tracking',
            'Centralised career profile and resume management',
          ]} />
          <Benefit icon={<Building2 size={18} />} title="For Recruiters" points={[
            'Post and manage job openings easily',
            'Review applicants with structured data',
            'Streamline shortlisting and interview scheduling',
          ]} />
          <Benefit icon={<BarChart2 size={18} />} title="For Placement Teams" points={[
            'Centralise all placement activity on one platform',
            'Approve and manage company accounts',
            'Monitor pipeline and generate placement reports',
          ]} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--pf-navy)', padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <Shield size={14} style={{ color: 'var(--pf-teal)' }} />
            <span style={{ color: 'var(--pf-teal)', fontSize: 12, fontWeight: 600 }}>Trusted by leading engineering colleges</span>
          </div>
          <h2 style={{ color: '#fff', fontFamily: 'Manrope', fontWeight: 800, fontSize: 30, marginBottom: 16 }}>Ready to streamline your placement?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 28 }}>Join PlaceForge and bring your entire campus recruitment workflow under one roof.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button size="lg" variant="primary" onClick={() => navigate('/register')}>Create your account</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/student')} style={{ color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>Explore demo</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--pf-border)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, color: 'var(--pf-navy)', fontSize: 14 }}>PlaceForge</span>
        <span style={{ color: 'var(--pf-text-muted)', fontSize: 12 }}>© 2024 PlaceForge. Campus Recruitment Platform.</span>
      </footer>
    </div>
  )
}
