import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LoginPage() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const nodesRef = useRef([])
  const navigate = useNavigate()
  const [userId, setUserId] = useState('admin-01')
  const [role, setRole] = useState('admin')
  const [expiry, setExpiry] = useState('3600')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      initNodes()
    }

    const initNodes = () => {
      nodesRef.current = Array.from({ length: Math.floor((W * H) / 20000) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.2 + .4,
        pulse: Math.random() * Math.PI * 2,
        bright: Math.random() > .88
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() / 1000
      const nodes = nodesRef.current

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        a.x += a.vx; a.y += a.vy
        if (a.x < 0 || a.x > W) a.vx *= -1
        if (a.y < 0 || a.y > H) a.vy *= -1

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 120) * 0.1})`
            ctx.lineWidth = .4
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }

        const pulse = Math.sin(t * 1.5 + a.pulse)
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.bright ? a.r * (1.2 + pulse * .3) : a.r, 0, Math.PI * 2)
        ctx.fillStyle = a.bright
          ? `rgba(34,211,238,${0.5 + pulse * .3})`
          : `rgba(56,189,248,${0.12 + pulse * .08})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleLogin = async () => {
    if (!userId.trim()) { setError('Node ID is required'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/token', { userId, role })
      const newToken = res.data.token
      localStorage.setItem('gateway_token', newToken)
      localStorage.setItem('gateway_user', JSON.stringify({ userId, role, expiresIn: res.data.expiresIn }))
      setToken(newToken)
    } catch (err) {
      setError('Failed to connect to agent')
    }
    setLoading(false)
  }

  const handleEnter = () => {
  window.dispatchEvent(new Event('monitorix-auth'))
  navigate('/')
}

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(56,189,248,0.15)',
    color: '#e2e8f0', fontSize: '13px',
    outline: 'none', fontFamily: 'monospace',
    borderRadius: '2px', transition: 'border .2s'
  }

  return (
    <div style={{ background: '#020608', minHeight: '100vh', color: '#e2e8f0', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
          <div onClick={() => navigate('/landing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <polyline points="2,20 8,10 14,16 20,6 26,12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="12" r="2" fill="#22d3ee"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#f8fafc', letterSpacing: '.08em' }}>MONITORIX</span>
          </div>
          <div style={{ fontSize: '11px', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', border: '1px solid rgba(34,211,238,0.12)', borderRadius: '3px', letterSpacing: '.06em' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }}></span>
            Agent online
          </div>
        </nav>

        {/* Main */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 65px)' }}>

          {/* Left */}
          <div style={{ padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(56,189,248,0.06)' }}>
            <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
              Secure access
            </div>
            <h1 style={{ fontSize: '44px', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-.025em', color: '#f8fafc', marginBottom: '20px' }}>
              Connect to<br />the <span style={{ color: '#38bdf8' }}>network</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8, maxWidth: '340px', marginBottom: '40px' }}>
              Authenticate with a signed JWT token to access the infrastructure dashboard. Your session is scoped to your role and expires automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: 'ti-shield-check', title: 'JWT authentication', desc: 'Signed with HS256, validated on every request' },
                { icon: 'ti-chart-line', title: 'Live metrics', desc: 'Prometheus data refreshed every 15 seconds' },
                { icon: 'ti-terminal-2', title: 'Log pipeline', desc: 'ELK stack — 1,000+ events indexed' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: '15px', color: '#38bdf8' }} aria-hidden="true"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#334155' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(56,189,248,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Auth endpoint</div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8', padding: '8px 14px', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: '3px', display: 'inline-block' }}>
                POST /api/auth/token
              </div>
            </div>
          </div>

          {/* Right — Login form */}
          <div style={{ padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: '360px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(56,189,248,0.08)', fontFamily: 'monospace' }}>
                // init_session
              </div>

              {error && (
                <div style={{ fontSize: '12px', color: '#f87171', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '3px', padding: '10px 12px', marginBottom: '16px', fontFamily: 'monospace' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', color: '#334155', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontFamily: 'monospace' }}>Node ID</label>
                <input
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="e.g. admin-01"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(56,189,248,0.15)'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', color: '#334155', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontFamily: 'monospace' }}>Access level</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="admin">admin</option>
                  <option value="developer">developer</option>
                  <option value="viewer">viewer</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '10px', color: '#334155', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontFamily: 'monospace' }}>Token TTL</label>
                <select
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="3600">3600s — 1 hour</option>
                  <option value="86400">86400s — 24 hours</option>
                  <option value="604800">604800s — 7 days</option>
                </select>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: loading ? '#0c4a6e' : '#38bdf8', color: '#020608', border: 'none', borderRadius: '3px', fontSize: '12px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s', fontFamily: 'monospace' }}
              >
                {loading ? 'Authenticating...' : 'Generate token + connect'}
              </button>

              {token && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: '3px' }}>
                  <div style={{ fontSize: '9px', color: '#334155', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Signed JWT</div>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#22d3ee', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: '10px' }}>
                    {token.substring(0, 60)}...
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigator.clipboard?.writeText(token)}
                      style={{ fontSize: '10px', padding: '5px 12px', background: 'transparent', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', cursor: 'pointer', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'monospace', borderRadius: '2px' }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleEnter}
                      style={{ fontSize: '10px', padding: '5px 18px', background: '#38bdf8', color: '#020608', border: 'none', cursor: 'pointer', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 500, fontFamily: 'monospace', borderRadius: '2px' }}
                    >
                      Enter dashboard →
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', fontSize: '11px', color: '#1e3a4a', textAlign: 'center', lineHeight: 1.6, fontFamily: 'monospace' }}>
                No password required — portfolio demo<br />
                Token validated by Spring Boot JwtAuthFilter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}