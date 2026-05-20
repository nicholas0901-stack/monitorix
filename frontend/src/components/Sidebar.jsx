import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Server, LineChart, Terminal,
  Bell, Settings, Activity
} from 'lucide-react'

const nav = [
  { section: 'Overview' },
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/servers', icon: Server, label: 'Servers' },
  { section: 'Observability' },
  { to: '/metrics', icon: LineChart, label: 'Metrics', sub: 'Grafana' },
  { to: '/logs', icon: Terminal, label: 'Logs', sub: 'Kibana' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { section: 'System' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ alertCount = 0 }) {
  return (
    <div className="w-52 flex flex-col h-screen" style={{ background: '#060910', borderRight: '1px solid #1e2d45' }}>
      <div className="px-4 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #1e2d45' }}>
        <Activity size={18} className="text-sky-400" />
        <div>
          <div className="text-sm font-medium text-white">Monitorix</div>
          <div className="text-xs" style={{ color: '#4d6680' }}>Infrastructure Monitor</div>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-auto">
        {nav.map((item, i) => {
          if (item.section) return (
            <div key={i} className="px-4 pt-4 pb-1 text-xs font-medium" style={{ color: '#4d6680', letterSpacing: '.06em' }}>
              {item.section.toUpperCase()}
            </div>
          )
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-all border-l-2 ${
                  isActive
                    ? 'border-sky-400 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(14,165,233,0.08)' : 'transparent'
              })}
            >
              <Icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.sub && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1e2d45', color: '#4d6680', fontSize: '9px' }}>
                  {item.sub}
                </span>
              )}
              {item.to === '/alerts' && alertCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#2a0a0a', color: '#ef4444', fontSize: '9px' }}>
                  {alertCount}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-3" style={{ borderTop: '1px solid #1e2d45' }}>
        <div className="text-xs" style={{ color: '#4d6680' }}>ENV: PRODUCTION</div>
        <div className="text-xs mt-1" style={{ color: '#4d6680' }}>REGION: AP-SE-1</div>
      </div>
    </div>
  )
}