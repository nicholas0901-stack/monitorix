import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useMetrics(intervalMs = 5000) {
  const [summary, setSummary] = useState(null)
  const [servers, setServers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [sumRes, srvRes, altRes] = await Promise.all([
        api.get('/api/summary'),
        api.get('/api/servers'),
        api.get('/api/alerts')
      ])
      setSummary(sumRes.data)
      setServers(srvRes.data)
      setAlerts(altRes.data)
    } catch (err) {
      console.error('Metrics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { summary, servers, alerts, loading, refresh }
}