import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const nodesRef = useRef([])
  const navigate = useNavigate()

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
      const count = Math.floor((W * H) / 18000)
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.5 + .5,
        pulse: Math.random() * Math.PI * 2,
        bright: Math.random() > .85
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
          if (dist < 140) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 140) * 0.12})`
            ctx.lineWidth = .5
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }

        const pulse = Math.sin(t * 1.5 + a.pulse)
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.bright ? a.r * (1.2 + pulse * .3) : a.r, 0, Math.PI * 2)
        ctx.fillStyle = a.bright
          ? `rgba(34,211,238,${0.6 + pulse * .3})`
          : `rgba(56,189,248,${0.15 + pulse * .1})`
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

  return (
    <div style={{ background: '#020608', minHeight: '100vh', color: '#e2e8f0', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polyline points="2,20 8,10 14,16 20,6 26,12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="12" r="2" fill="#22d3ee"/>
              <circle cx="8" cy="10" r="1.5" fill="#38bdf8" opacity=".5"/>
              <circle cx="14" cy="16" r="1.5" fill="#38bdf8" opacity=".5"/>
              <circle cx="20" cy="6" r="1.5" fill="#38bdf8" opacity=".5"/>
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#f8fafc', letterSpacing: '.08em' }}>
              MONITORIX<sup style={{ fontSize: '10px', color: '#38bdf8' }}>v1</sup>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '28px' }}>
            {['Overview', 'Stack', 'Docs', 'GitHub'].map(l => (
              <span key={l} style={{ fontSize: '12px', color: '#475569', letterSpacing: '.06em', cursor: 'pointer', textTransform: 'uppercase' }}>{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '3px', letterSpacing: '.06em' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22d3ee', animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }}></span>
              Network online
            </div>
            <button onClick={() => navigate('/login')} style={{ fontSize: '12px', padding: '8px 20px', background: 'transparent', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8', borderRadius: '3px', cursor: 'pointer', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Connect
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '100px 48px 60px', maxWidth: '700px' }}>
          <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '24px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
            Infrastructure observability protocol
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.025em', marginBottom: '20px', color: '#f8fafc' }}>
            Every node.<br />Every signal.<br /><span style={{ color: '#38bdf8' }}>Real-time.</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8, maxWidth: '420px', marginBottom: '36px' }}>
            Monitorix maps your entire infrastructure — metrics, logs, and traces — into a unified live mesh. Built on Prometheus, ELK, and Grafana.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button onClick={() => navigate('/login')} style={{ fontSize: '12px', padding: '12px 28px', background: '#38bdf8', color: '#020608', border: 'none', borderRadius: '3px', cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Launch dashboard
            </button>
            <button onClick={() => navigate('/architecture')} style={{ fontSize: '12px', padding: '12px 24px', background: 'transparent', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', cursor: 'pointer', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              View architecture
            </button>
          </div>
        </section>

        {/* Metrics strip */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(56,189,248,0.08)', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
          {[
            { val: '3', lbl: 'Nodes monitored' },
            { val: '1,247', lbl: 'Log events indexed' },
            { val: '15s', lbl: 'Scrape interval' },
            { val: '7', lbl: 'Containers running' },
            { val: '99.9%', lbl: 'Uptime' },
          ].map((m, i) => (
            <div key={i} style={{ flex: 1, padding: '20px 32px', borderRight: i < 4 ? '1px solid rgba(56,189,248,0.08)' : 'none' }}>
              <div style={{ fontSize: '28px', fontWeight: 500, color: '#38bdf8', fontFamily: 'monospace', marginBottom: '3px' }}>{m.val}</div>
              <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '.1em', textTransform: 'uppercase' }}>{m.lbl}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section style={{ padding: '64px 48px' }}>
          <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
            Capabilities
          </div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '8px', color: '#f8fafc', letterSpacing: '-.01em' }}>Signal intelligence, end to end</div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '36px', maxWidth: '400px', lineHeight: 1.7 }}>Purpose-built for DevOps and infrastructure teams who need full-stack visibility without the noise.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.06)' }}>
            {[
              { num: '01 — METRICS', icon: 'ti-chart-line', title: 'Prometheus scraping', desc: 'JVM heap, CPU, GC pause, HTTP request rates — scraped every 15 seconds from your Spring Boot agent.' },
              { num: '02 — LOGS', icon: 'ti-terminal-2', title: 'ELK log pipeline', desc: 'Logstash TCP input → Elasticsearch indexing → Kibana search. Structured JSON logs with server tags.' },
              { num: '03 — ALERTS', icon: 'ti-bell-ringing', title: 'Threshold detection', desc: 'CPU spikes trigger instant alerts with severity, server name, and timestamp. Live feed, no polling.' },
              { num: '04 — VISUALISE', icon: 'ti-brand-grafana', title: 'Grafana dashboards', desc: 'PromQL time-series graphs. Datasource auto-provisioned on container startup. Deep-dive ready.' },
              { num: '05 — DISCOVER', icon: 'ti-search', title: 'Kibana discovery', desc: 'Full-text log search across all nodes. Filter by server, level, or keyword. KQL syntax supported.' },
              { num: '06 — DEPLOY', icon: 'ti-container', title: 'One-command stack', desc: 'docker compose up starts all 7 containers. Multi-stage Alpine builds. Production-ready from day one.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#020608', padding: '24px', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = '#020608'}>
                <div style={{ fontSize: '10px', color: '#1e3a4a', letterSpacing: '.1em', fontFamily: 'monospace', marginBottom: '14px' }}>{f.num}</div>
                <i className={`ti ${f.icon}`} style={{ fontSize: '20px', color: '#38bdf8', display: 'block', marginBottom: '12px' }} aria-hidden="true"></i>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <div style={{ padding: '40px 48px', borderTop: '1px solid rgba(56,189,248,0.06)' }}>
          <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
            Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {['Spring Boot 4', 'Prometheus', 'Grafana', 'Elasticsearch', 'Logstash', 'Kibana', 'React 18', 'Docker', 'Alpine Linux'].map((s, i, arr) => (
              <div key={s} style={{ padding: '10px 20px', fontSize: '11px', color: '#334155', letterSpacing: '.08em', textTransform: 'uppercase', borderRight: i < arr.length - 1 ? '1px solid rgba(56,189,248,0.08)' : 'none', fontFamily: 'monospace', cursor: 'default', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section style={{ padding: '80px 48px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '20px' }}>Ready to connect</div>
          <h2 style={{ fontSize: '36px', fontWeight: 500, color: '#f8fafc', marginBottom: '12px', letterSpacing: '-.02em' }}>Join the network</h2>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '28px' }}>Sign in to access the infrastructure dashboard</p>
          <button onClick={() => navigate('/login')} style={{ fontSize: '12px', padding: '14px 36px', background: '#38bdf8', color: '#020608', border: 'none', borderRadius: '3px', cursor: 'pointer', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 500 }}>
            Connect now →
          </button>
        </section>

        {/* Footer */}
        <footer style={{ padding: '20px 48px', borderTop: '1px solid rgba(56,189,248,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '11px', color: '#1e3a4a', fontFamily: 'monospace' }}>MONITORIX v1.0.0 — Infrastructure Monitor</div>
          <div style={{ fontSize: '11px', color: '#1e3a4a', fontFamily: 'monospace' }}>Spring Boot · Prometheus · ELK · React · Docker</div>
        </footer>

      </div>
    </div>
  )
}