import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import ServersPage from './pages/ServersPage'
import MetricsPage from './pages/MetricsPage'
import LogsPage from './pages/LogsPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ArchitecturePage from './pages/ArchitecturePage'
import { useState } from 'react'
import { useMetrics } from './hooks/useMetrics'

const pageTitles = {
  '/': 'Infrastructure Dashboard',
  '/servers': 'Servers',
  '/metrics': 'Metrics — Grafana',
  '/logs': 'Logs — Kibana',
  '/alerts': 'Alerts',
  '/settings': 'Settings'
}

function DashboardLayout() {
  const location = useLocation()
  const { alerts } = useMetrics(10000)
  const alertCount = alerts.filter(a => !a.resolved).length

  useEffect(() => {
    const tick = () => {
      const el = document.getElementById('clock')
      if (el) el.textContent = new Date().toLocaleTimeString()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar alertCount={alertCount} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: '#060910', borderBottom: '1px solid #1e2d45', padding: '0 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#4d6680' }}>Monitorix</span>
            <span style={{ color: '#334155' }}>/</span>
            <span style={{ color: '#0ea5e9' }}>{pageTitles[location.pathname] || 'Dashboard'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
            {alertCount > 0 && (
              <span style={{ background: '#2a0a0a', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 500 }}>
                {alertCount} active alerts
              </span>
            )}
            <span style={{ color: '#334155' }} id="clock" />
            <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8px' }}>●</span> Live
            </span>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#0a0e1a' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/servers" element={<ServersPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('gateway_token'))

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('gateway_token'))
    window.addEventListener('storage', handler)
    window.addEventListener('monitorix-auth', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('monitorix-auth', handler)
    }
  }, [])

  const user = JSON.parse(localStorage.getItem('gateway_user') || 'null')
  return { isAuthenticated: !!token, token, user }
}

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no sidebar */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage />
        } />
        <Route path="/architecture" element={<ArchitecturePage />} />
        {/* Protected routes — with sidebar */}
        <Route path="/*" element={
          isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}