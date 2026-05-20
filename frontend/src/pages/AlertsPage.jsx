import { useMetrics } from '../hooks/useMetrics'

export default function AlertsPage() {
  const { alerts, servers, loading } = useMetrics(5000)

  if (loading) return <div className="p-4 text-sm" style={{ color: '#4d6680' }}>Loading...</div>

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {['CRITICAL', 'WARNING', 'ALL'].map(sev => {
          const count = sev === 'ALL' ? alerts.length : alerts.filter(a => a.severity === sev).length
          return (
            <div key={sev} className="p-4 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
              <div className="text-xs mb-2" style={{ color: '#4d6680' }}>{sev}</div>
              <div className="text-2xl font-medium font-mono" style={{ color: sev === 'CRITICAL' ? '#ef4444' : sev === 'WARNING' ? '#f59e0b' : '#e2e8f0' }}>{count}</div>
            </div>
          )
        })}
      </div>

      <div className="p-4 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
        <div className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#4d6680' }}>Alert history</div>
        {alerts.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: '#334155' }}>No alerts — all systems nominal</div>
        ) : alerts.map((alert, i) => (
          <div key={alert.id || i} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #1e2d45' }}>
            <span className="text-xs px-2 py-0.5 rounded whitespace-nowrap font-medium" style={{
              background: alert.severity === 'CRITICAL' ? '#2a0a0a' : '#2a1a00',
              color: alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', fontSize: '9px'
            }}>{alert.severity}</span>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{alert.title}</div>
              <div className="text-xs mt-1" style={{ color: '#4d6680' }}>{alert.message}</div>
              <div className="text-xs mt-1" style={{ color: '#334155' }}>Server: {alert.serverName}</div>
            </div>
            <div className="text-xs whitespace-nowrap" style={{ color: '#334155' }}>
              {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : '--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}