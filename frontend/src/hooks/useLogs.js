import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useLogs(limit = 50, intervalMs = 3000) {
  const [logs, setLogs] = useState([])

  const refresh = useCallback(async () => {
    try {
      const res = await api.get(`/api/logs?limit=${limit}`)
      setLogs(res.data)
    } catch (err) {
      console.error('Logs fetch error:', err)
    }
  }, [limit])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { logs, refresh }
}