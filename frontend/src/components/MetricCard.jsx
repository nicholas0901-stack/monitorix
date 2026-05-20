export default function MetricCard({ label, value, sub, accent = '#0ea5e9' }) {
  return (
    <div className="relative overflow-hidden p-4 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accent }} />
      <div className="text-xs mb-2 uppercase tracking-wider" style={{ color: '#4d6680', letterSpacing: '.06em' }}>{label}</div>
      <div className="text-2xl font-medium" style={{ color: accent, fontFamily: 'monospace' }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#4d6680' }}>{sub}</div>}
    </div>
  )
}