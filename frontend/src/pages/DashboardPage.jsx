import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { useMetrics } from '../hooks/useMetrics'
import { useLogs } from '../hooks/useLogs'
import MetricCard from '../components/MetricCard'
import ServerTile from '../components/ServerTile'
import LogStream from '../components/LogStream'
import AlertFeed from '../components/AlertFeed'
import api from '../services/api'
import { usePrometheusRange } from '../hooks/usePrometheus'

Chart.register(...registerables)

function PromCpuChart() {
  const { data } = usePrometheusRange('process_cpu_usage', 15000)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data.length || !canvasRef.current) return

    const series = data[0]
    if (!series) return

    const labels = series.values.map(v =>
      new Date(v[0] * 1000).toLocaleTimeString()
    )
    const values = series.values.map(v =>
      Math.round(parseFloat(v[1]) * 10000) / 100
    )

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'JVM CPU %',
            data: values,
            borderColor: '#0ea5e9',
            borderWidth: 1.5,
            fill: true,
            backgroundColor: '#0ea5e915',
            pointRadius: 0,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0d1626',
              borderColor: '#1e2d45',
              borderWidth: 1,
              titleColor: '#94a3b8',
              bodyColor: '#64748b',
              callbacks: { label: ctx => `CPU: ${ctx.parsed.y.toFixed(3)}%` }
            }
          },
          scales: {
            x: {
              display: true,
              ticks: {
                color: '#334155',
                font: { size: 9 },
                maxTicksLimit: 6,
                maxRotation: 0
              },
              grid: { color: '#1e2d4522' },
              border: { color: '#1e2d45' }
            },
            y: {
              min: 0,
              grid: { color: '#1e2d4522' },
              ticks: {
                color: '#334155',
                font: { size: 9 },
                callback: v => v.toFixed(2) + '%'
              },
              border: { color: '#1e2d45' }
            }
          }
        }
      })
    } else {
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets[0].data = values
      chartRef.current.update('none')
    }
  }, [data])

  return (
    <div style={{ position: 'relative', height: '120px' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

function DonutChart({ servers }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!servers.length) return
    const healthy = servers.filter(s => s.status === 'HEALTHY').length
    const warning = servers.filter(s => s.status === 'WARNING').length
    const critical = servers.filter(s => s.status === 'CRITICAL').length

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Healthy', 'Warning', 'Critical'],
          datasets: [{ data: [healthy, warning, critical], backgroundColor: ['#22c55e33', '#f59e0b33', '#ef444433'], borderColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 2 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          cutout: '65%',
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#4d6680', boxWidth: 10, font: { size: 9 }, padding: 8 } },
            tooltip: { backgroundColor: '#0d1626', borderColor: '#1e2d45', borderWidth: 1, titleColor: '#94a3b8', bodyColor: '#64748b' }
          }
        }
      })
    } else {
      chartRef.current.data.datasets[0].data = [healthy, warning, critical]
      chartRef.current.update('none')
    }
  }, [servers])

    return (
    <div style={{ position: 'relative', height: '120px' }}>
        <canvas ref={canvasRef} />
    </div>
    )
}

export default function DashboardPage() {
  const { summary, servers, alerts, loading, refresh } = useMetrics(5000)
  const { logs } = useLogs(50, 3000)

  const triggerSpike = async () => {
    const target = servers[0]?.serverId || 'web-01'
    try {
      await api.post(`/api/servers/${target}/spike`)
      refresh()
    } catch (err) {
      console.error('Spike error:', err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <span className="text-sm" style={{ color: '#4d6680' }}>Connecting to agent...</span>
    </div>
  )

  const healthy = servers.filter(s => s.status === 'HEALTHY').length
  const warning = servers.filter(s => s.status === 'WARNING').length
  const critical = servers.filter(s => s.status === 'CRITICAL').length
  const avgCpu = servers.length ? Math.round(servers.reduce((a, s) => a + s.cpuUsage, 0) / servers.length) : 0
  const avgMem = servers.length ? Math.round(servers.reduce((a, s) => a + s.memoryUsagePercent, 0) / servers.length) : 0

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3">
        <MetricCard label="Total servers" value={servers.length} sub="All reachable" accent="#0ea5e9" />
        <MetricCard label="Healthy" value={healthy} sub="No issues" accent="#22c55e" />
        <MetricCard label="Warning" value={warning} sub="Needs attention" accent="#f59e0b" />
        <MetricCard label="Critical" value={critical} sub="Immediate action" accent="#ef4444" />
        <MetricCard label="Active alerts" value={summary?.activeAlerts || alerts.length} sub="Last 24h" accent="#a78bfa" />
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
        <div className="p-3 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4d6680' }}>
            JVM CPU usage — real Prometheus data (last 30 min)
          </div>
                    <PromCpuChart />
        </div>
        <div className="p-3 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4d6680' }}>
            Server status
          </div>
          <DonutChart servers={servers} />
        </div>
        <div className="p-3 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4d6680' }}>
            Avg resource usage
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
                <span>CPU</span><span style={{ color: avgCpu > 80 ? '#ef4444' : '#0ea5e9' }}>{avgCpu}%</span>
              </div>
              <div className="h-2 rounded overflow-hidden" style={{ background: '#1e2d45' }}>
                <div className="h-full rounded transition-all duration-500" style={{ width: `${avgCpu}%`, background: avgCpu > 80 ? '#ef4444' : avgCpu > 70 ? '#f59e0b' : '#0ea5e9' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
                <span>Memory</span><span style={{ color: avgMem > 80 ? '#ef4444' : '#a78bfa' }}>{avgMem}%</span>
              </div>
              <div className="h-2 rounded overflow-hidden" style={{ background: '#1e2d45' }}>
                <div className="h-full rounded transition-all duration-500" style={{ width: `${avgMem}%`, background: avgMem > 80 ? '#ef4444' : avgMem > 70 ? '#f59e0b' : '#a78bfa' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#4d6680' }}>Server health</span>
            <button onClick={triggerSpike} className="text-xs px-3 py-1 rounded cursor-pointer" style={{ background: 'transparent', border: '1px solid #ef444466', color: '#ef4444' }}>
              Simulate spike
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {servers.map(s => <ServerTile key={s.serverId} server={s} />)}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3 rounded flex-1" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
            <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4d6680' }}>Alert feed</div>
            <AlertFeed alerts={alerts} />
          </div>
          <div className="p-3 rounded flex-1" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#4d6680' }}>Log stream</span>
              <span className="text-xs" style={{ color: '#334155' }}>{logs.length} entries</span>
            </div>
            <LogStream logs={logs} maxLines={8} />
          </div>
        </div>
      </div>
    </div>
  )
}