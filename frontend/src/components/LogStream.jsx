const levelColor = { INFO: '#0ea5e9', WARN: '#f59e0b', ERROR: '#ef4444' }

export default function LogStream({ logs, maxLines = 20 }) {
  return (
    <div className="overflow-auto" style={{ maxHeight: '200px' }}>
      {logs.slice(0, maxLines).map((log, i) => (
        <div key={log.id || i} className="flex gap-2 py-1 text-xs font-mono" style={{ borderBottom: '1px solid #1e2d45' }}>
          <span style={{ color: '#334155', whiteSpace: 'nowrap' }}>
            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--:--'}
          </span>
          <span style={{ color: levelColor[log.level] || '#64748b', minWidth: '36px' }}>{log.level}</span>
          <span style={{ color: '#0ea5e955', minWidth: '70px' }}>[{log.serverId}]</span>
          <span style={{ color: '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {log.message}
          </span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-xs py-4 text-center" style={{ color: '#334155' }}>No logs yet</div>
      )}
    </div>
  )
}