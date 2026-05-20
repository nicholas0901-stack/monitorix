export default function AlertFeed({ alerts, maxItems = 5 }) {
  if (!alerts.length) return (
    <div className="text-xs py-3 text-center" style={{ color: '#334155' }}>No active alerts</div>
  )

  return (
    <div>
      {alerts.slice(0, maxItems).map((alert, i) => (
        <div key={alert.id || i} className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid #1e2d45' }}>
          <span className="text-xs px-2 py-0.5 rounded whitespace-nowrap font-medium" style={{
            background: alert.severity === 'CRITICAL' ? '#2a0a0a' : '#2a1a00',
            color: alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
            fontSize: '9px'
          }}>{alert.severity}</span>
          <div className="flex-1">
            <div className="text-xs font-medium" style={{ color: '#cbd5e1' }}>{alert.title}</div>
            <div className="text-xs mt-0.5" style={{ color: '#4d6680' }}>{alert.message}</div>
          </div>
          <div className="text-xs whitespace-nowrap" style={{ color: '#334155' }}>
            {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : '--'}
          </div>
        </div>
      ))}
    </div>
  )
}