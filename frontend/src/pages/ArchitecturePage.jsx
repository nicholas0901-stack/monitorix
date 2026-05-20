import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const NODES = [
  { id: 'react',  label: 'React UI',           port: ':3000 / :5173', icon: 'ti-brand-react',   color: '#38bdf8', x: 50,  y: 8  },
  { id: 'agent',  label: 'Spring Boot Agent',  port: ':8080',         icon: 'ti-coffee',         color: '#a78bfa', x: 50,  y: 30 },
  { id: 'prom',   label: 'Prometheus',         port: ':9090',         icon: 'ti-activity',       color: '#f59e0b', x: 18,  y: 55 },
  { id: 'graf',   label: 'Grafana',            port: ':3001',         icon: 'ti-brand-grafana',  color: '#f97316', x: 18,  y: 78 },
  { id: 'ls',     label: 'Logstash',           port: ':5000 TCP',     icon: 'ti-filter',         color: '#22d3ee', x: 50,  y: 55 },
  { id: 'es',     label: 'Elasticsearch',      port: ':9200',         icon: 'ti-database',       color: '#22d3ee', x: 50,  y: 78 },
  { id: 'kib',    label: 'Kibana',             port: ':5601',         icon: 'ti-search',         color: '#22d3ee', x: 50,  y: 95 },
  { id: 'mongo',  label: 'MongoDB',            port: ':27017',        icon: 'ti-leaf',           color: '#22c55e', x: 82,  y: 55 },
]

const EDGES = [
  { from: 'react', to: 'agent', color: '#38bdf8', label: 'REST /api' },
  { from: 'agent', to: 'prom',  color: '#f59e0b', label: '/actuator/prometheus' },
  { from: 'prom',  to: 'graf',  color: '#f97316', label: 'PromQL' },
  { from: 'agent', to: 'ls',    color: '#22d3ee', label: 'TCP :5000' },
  { from: 'ls',    to: 'es',    color: '#22d3ee', label: 'index' },
  { from: 'es',    to: 'kib',   color: '#22d3ee', label: 'search' },
  { from: 'react', to: 'graf',  color: '#f97316', label: 'embed' },
  { from: 'react', to: 'kib',   color: '#22d3ee', label: 'embed' },
  { from: 'agent', to: 'mongo', color: '#22c55e', label: 'events' },
]

const DETAILS = [
  { tag: '01 — Frontend',  name: 'React + Nginx',    desc: 'Vite-built SPA served by Nginx Alpine. Proxies /api to Spring Boot and /prometheus to Prometheus.', port: ':3000 · :5173' },
  { tag: '02 — Agent',     name: 'Spring Boot',      desc: 'Core middleware. REST API, /actuator/prometheus endpoint, and structured JSON logs via Logstash TCP.', port: ':8080' },
  { tag: '03 — Metrics',   name: 'Prometheus',       desc: 'Scrapes /actuator/prometheus every 15 seconds. Stores time-series. Grafana queries via PromQL.', port: ':9090' },
  { tag: '04 — Visualise', name: 'Grafana',          desc: 'Auto-provisioned with Prometheus datasource. JVM CPU, heap, GC pause, HTTP rate dashboards.', port: ':3001' },
  { tag: '05 — Logs',      name: 'ELK Stack',        desc: 'Logstash TCP :5000 → Elasticsearch indexing → Kibana full-text search. Structured JSON with server tags.', port: ':5000 · :9200 · :5601' },
  { tag: '06 — Storage',   name: 'MongoDB',          desc: 'Persists gateway events. TTL index auto-expires documents after 7 days at the database level.', port: ':27017' },
]

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function ArchitecturePage() {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const flowRef = useRef(null)
  const wrapRef = useRef(null)
  const bgAnimRef = useRef(null)
  const flowAnimRef = useRef(null)
  const bgNodesRef = useRef([])
  const packetsRef = useRef([])
  const lastPacketRef = useRef(0)
  const nodeRefsMap = useRef({})

  useEffect(() => {
    const bg = bgRef.current
    const bgCtx = bg.getContext('2d')
    let BW, BH

    const bgResize = () => {
      BW = bg.width = window.innerWidth
      BH = bg.height = window.innerHeight
      bgNodesRef.current = Array.from({ length: Math.floor(BW * BH / 20000) }, () => ({
        x: Math.random() * BW, y: Math.random() * BH,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.2 + .4,
        pulse: Math.random() * Math.PI * 2,
        bright: Math.random() > .88
      }))
    }

    const bgDraw = () => {
      bgCtx.clearRect(0, 0, BW, BH)
      const t = Date.now() / 1000
      const nodes = bgNodesRef.current
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        a.x += a.vx; a.y += a.vy
        if (a.x < 0 || a.x > BW) a.vx *= -1
        if (a.y < 0 || a.y > BH) a.vy *= -1
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            bgCtx.strokeStyle = `rgba(56,189,248,${(1 - d / 120) * .08})`
            bgCtx.lineWidth = .4
            bgCtx.beginPath(); bgCtx.moveTo(a.x, a.y); bgCtx.lineTo(b.x, b.y); bgCtx.stroke()
          }
        }
        const p = Math.sin(t * 1.5 + a.pulse)
        bgCtx.beginPath()
        bgCtx.arc(a.x, a.y, a.bright ? a.r * (1.2 + p * .3) : a.r, 0, Math.PI * 2)
        bgCtx.fillStyle = a.bright ? `rgba(34,211,238,${.5 + p * .3})` : `rgba(56,189,248,${.1 + p * .06})`
        bgCtx.fill()
      }
      bgAnimRef.current = requestAnimationFrame(bgDraw)
    }

    bgResize(); bgDraw()
    window.addEventListener('resize', bgResize)
    return () => {
      cancelAnimationFrame(bgAnimRef.current)
      window.removeEventListener('resize', bgResize)
    }
  }, [])

  useEffect(() => {
    const fc = flowRef.current
    const fctx = fc.getContext('2d')
    const wrap = wrapRef.current

    const getPos = (id) => {
      const el = nodeRefsMap.current[id]
      if (!el) return { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      const wr = wrap.getBoundingClientRect()
      return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 }
    }

    const spawnPacket = (edge) => {
      packetsRef.current.push({ edge, t: 0, speed: .004 + Math.random() * .003 })
    }

    const drawFlow = () => {
      fc.width = wrap.offsetWidth
      fc.height = wrap.offsetHeight
      fctx.clearRect(0, 0, fc.width, fc.height)
      const now = Date.now()

      EDGES.forEach(e => {
        const a = getPos(e.from), b = getPos(e.to)
        fctx.strokeStyle = hexToRgba(e.color, 0.18)
        fctx.lineWidth = .8
        fctx.setLineDash([4, 4])
        fctx.beginPath(); fctx.moveTo(a.x, a.y); fctx.lineTo(b.x, b.y); fctx.stroke()
        fctx.setLineDash([])
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 8
        fctx.font = '9px monospace'
        fctx.fillStyle = hexToRgba(e.color, 0.35)
        fctx.textAlign = 'center'
        fctx.fillText(e.label, mx, my)
      })

      if (now - lastPacketRef.current > 500) {
        spawnPacket(EDGES[Math.floor(Math.random() * EDGES.length)])
        lastPacketRef.current = now
      }

      packetsRef.current = packetsRef.current.filter(p => {
        p.t += p.speed
        if (p.t > 1) return false
        const a = getPos(p.edge.from), b = getPos(p.edge.to)
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t
        fctx.beginPath(); fctx.arc(x, y, 3, 0, Math.PI * 2)
        fctx.fillStyle = hexToRgba(p.edge.color, 0.9); fctx.fill()
        fctx.beginPath(); fctx.arc(x, y, 6, 0, Math.PI * 2)
        fctx.fillStyle = hexToRgba(p.edge.color, 0.2); fctx.fill()
        return true
      })

      flowAnimRef.current = requestAnimationFrame(drawFlow)
    }

    setTimeout(() => drawFlow(), 400)
    return () => cancelAnimationFrame(flowAnimRef.current)
  }, [])

  const s = (color) => ({
    position: 'absolute', transform: 'translate(-50%,-50%)', cursor: 'pointer',
    background: 'rgba(2,6,8,0.9)', border: `1px solid ${color}`,
    borderRadius: '4px', padding: '10px 14px', textAlign: 'center',
    transition: 'all .2s', minWidth: '110px'
  })

  return (
    <div style={{ background: '#020608', minHeight: '100vh', color: '#e2e8f0', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflowX: 'hidden' }}>
      <canvas ref={bgRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
          <div onClick={() => navigate('/landing')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <polyline points="2,20 8,10 14,16 20,6 26,12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="12" r="2" fill="#22d3ee"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#f8fafc', letterSpacing: '.08em' }}>MONITORIX</span>
          </div>
          <button onClick={() => navigate('/landing')} style={{ fontSize: '11px', color: '#475569', letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid rgba(56,189,248,0.12)', borderRadius: '3px', background: 'transparent', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.12)' }}>
            ← Back to landing
          </button>
        </nav>

        {/* Hero */}
        <div style={{ padding: '48px 48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
            System architecture
            <span style={{ width: '20px', height: '1px', background: '#38bdf8', display: 'inline-block' }}></span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 500, color: '#f8fafc', letterSpacing: '-.02em', marginBottom: '8px' }}>Stack data flow</h1>
          <p style={{ fontSize: '13px', color: '#475569', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            How metrics, logs, and events move through the Monitorix infrastructure in real time.
          </p>
        </div>

        {/* Flow diagram */}
        <div style={{ padding: '0 48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '520px' }}>
            <canvas ref={flowRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
            {NODES.map(node => (
              <div key={node.id} ref={el => nodeRefsMap.current[node.id] = el}
                style={{ ...s(node.color), left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.06)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)'}>
                <i className={`ti ${node.icon}`} style={{ fontSize: '18px', color: node.color, display: 'block', marginBottom: '4px' }} aria-hidden="true"></i>
                <div style={{ fontSize: '11px', fontWeight: 500, color: node.color, letterSpacing: '.06em', textTransform: 'uppercase' }}>{node.label}</div>
                <div style={{ fontSize: '9px', color: '#334155', fontFamily: 'monospace', marginTop: '2px' }}>{node.port}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ maxWidth: '900px', width: '100%', display: 'flex', gap: '20px', padding: '14px 20px', background: 'rgba(56,189,248,0.02)', border: '1px solid rgba(56,189,248,0.06)', borderRadius: '4px', flexWrap: 'wrap' }}>
            {[
              { color: '#38bdf8', label: 'React + Spring Boot' },
              { color: '#f59e0b', label: 'Metrics pipeline' },
              { color: '#22d3ee', label: 'Log pipeline (ELK)' },
              { color: '#22c55e', label: 'Data storage' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: '#475569' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.color }}></div>
                {l.label}
              </div>
            ))}
          </div>

          {/* Detail cards */}
          <div style={{ maxWidth: '900px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.06)' }}>
            {DETAILS.map((d, i) => (
              <div key={i} style={{ background: '#020608', padding: '20px', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = '#020608'}>
                <div style={{ fontSize: '9px', color: '#38bdf8', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace' }}>{d.tag}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc', marginBottom: '6px' }}>{d.name}</div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.6 }}>{d.desc}</div>
                <div style={{ fontSize: '10px', color: '#1e3a4a', fontFamily: 'monospace', marginTop: '10px', padding: '3px 8px', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.08)', borderRadius: '2px', display: 'inline-block' }}>{d.port}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}