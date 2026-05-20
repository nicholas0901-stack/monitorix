function Bar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs w-8" style={{ color: '#4d6680' }}>{label}</span>
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: '#1e2d45' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs w-8 text-right font-mono" style={{ color: '#64748b' }}>{value}%</span>
    </div>
  )
}

export default function ServerTile({ server }) {
  const { id, name, status, cpuUsage, memoryUsagePercent, diskUsagePercent } = server

  const statusColor = status === 'CRITICAL' ? '#ef4444' : status === 'WARNING' ? '#f59e0b' : '#22c55e'
  const barColor = (v) => v > 85 ? '#ef4444' : v > 70 ? '#f59e0b' : '#0ea5e9'
  const borderColor = status === 'CRITICAL' ? '#ef444455' : status === 'WARNING' ? '#f59e0b55' : '#1e2d45'

  return (
    <div className="p-3 rounded" style={{ background: '#060910', border: `1px solid ${borderColor}`, borderLeft: `3px solid ${statusColor}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium font-mono" style={{ color: '#e2e8f0' }}>{id}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{
          background: status === 'CRITICAL' ? '#2a0a0a' : status === 'WARNING' ? '#2a1a00' : '#0c2a1a',
          color: statusColor,
          fontSize: '9px',
          fontWeight: 500
        }}>{status}</span>
      </div>
      <div className="text-xs mb-2" style={{ color: '#334155' }}>{name}</div>
      <Bar label="CPU" value={cpuUsage} color={barColor(cpuUsage)} />
      <Bar label="MEM" value={memoryUsagePercent} color={barColor(memoryUsagePercent)} />
      <Bar label="DISK" value={diskUsagePercent} color={barColor(diskUsagePercent)} />
    </div>
  )
}