import { useMetrics } from '../hooks/useMetrics'
import ServerTile from '../components/ServerTile'
import api from '../services/api'

export default function ServersPage() {
  const { servers, loading, refresh } = useMetrics(5000)

  const triggerSpike = async (serverId) => {
    try {
      await api.post(`/api/servers/${serverId}/spike`)
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-4 text-sm" style={{ color: '#4d6680' }}>Loading...</div>

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-medium" style={{ color: '#94a3b8' }}>
          {servers.length} servers monitored
        </h1>
      </div>

      {servers.map(server => (
        <div key={server.serverId} className="p-4 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium font-mono" style={{ color: '#e2e8f0' }}>{server.serverId}</div>
              <div className="text-xs mt-0.5" style={{ color: '#4d6680' }}>{server.serverName}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded font-medium" style={{
                background: server.status === 'CRITICAL' ? '#2a0a0a' : server.status === 'WARNING' ? '#2a1a00' : '#0c2a1a',
                color: server.status === 'CRITICAL' ? '#ef4444' : server.status === 'WARNING' ? '#f59e0b' : '#22c55e'
              }}>{server.status}</span>
              <button onClick={() => triggerSpike(server.serverId)} className="text-xs px-3 py-1 rounded cursor-pointer" style={{ background: 'transparent', border: '1px solid #ef444466', color: '#ef4444' }}>
                Spike
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'CPU Usage', value: server.cpuUsage + '%', color: server.cpuUsage > 80 ? '#ef4444' : '#0ea5e9' },
              { label: 'Memory', value: server.memoryUsagePercent + '%', color: server.memoryUsagePercent > 80 ? '#ef4444' : '#a78bfa' },
              { label: 'Disk', value: server.diskUsagePercent + '%', color: server.diskUsagePercent > 80 ? '#ef4444' : '#22c55e' },
              { label: 'Uptime', value: Math.round(server.uptimeSeconds / 3600) + 'h', color: '#f59e0b' }
            ].map(m => (
              <div key={m.label} className="p-3 rounded" style={{ background: '#060910', border: '1px solid #1e2d45' }}>
                <div className="text-xs mb-1" style={{ color: '#4d6680' }}>{m.label}</div>
                <div className="text-xl font-medium font-mono" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}