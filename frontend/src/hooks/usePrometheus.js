import { useState, useEffect, useCallback } from 'react'

export function usePrometheusRange(query, intervalMs = 15000) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const end = Math.floor(Date.now() / 1000)
      const start = end - 1800
      const url = `/prometheus/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=15`
      const res = await fetch(url)
      const json = await res.json()
      setData(json.data?.result || [])
    } catch (err) {
      console.error('Prometheus query error:', err)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, intervalMs)
    return () => clearInterval(id)
  }, [fetchData, intervalMs])

  return { data, loading }
}