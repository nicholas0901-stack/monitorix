import { useState } from 'react'
import { useLogs } from '../hooks/useLogs'
import LogStream from '../components/LogStream'

const KIBANA_URL = import.meta.env.VITE_KIBANA_URL || 'http://localhost:5601'

export default function LogsPage() {
  const { logs } = useLogs(100, 3000)
  const [view, setView] = useState('stream')
  const [filter, setFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('ALL')

  const filtered = logs.filter(l => {
    const matchLevel = levelFilter === 'ALL' || l.level === levelFilter
    const matchText = !filter || l.message?.toLowerCase().includes(filter.toLowerCase()) || l.serverId?.includes(filter)
    return matchLevel && matchText
  })

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div className="flex items-center gap-3">
        <div className="flex rounded overflow-hidden" style={{ border: '1px solid #1e2d45' }}>
          {['stream', 'kibana'].map(v => (
            <button key={v} onClick={() => setView(v)} className="px-4 py-1.5 text-xs cursor-pointer capitalize" style={{
              background: view === v ? '#0ea5e9' : 'transparent',
              color: view === v ? '#fff' : '#4d6680',
              border: 'none'
            }}>{v === 'kibana' ? 'Kibana' : 'Log stream'}</button>
          ))}
        </div>
        {view === 'stream' && (
          <>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by server or message..." className="text-xs px-3 py-1.5 rounded outline-none" style={{ background: '#0d1626', border: '1px solid #1e2d45', color: '#e2e8f0', width: '240px' }} />
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="text-xs px-3 py-1.5 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45', color: '#e2e8f0' }}>
              {['ALL', 'INFO', 'WARN', 'ERROR'].map(l => <option key={l}>{l}</option>)}
            </select>
            <span className="text-xs" style={{ color: '#334155' }}>{filtered.length} entries</span>
          </>
        )}
        {view === 'kibana' && (
          <a href={KIBANA_URL} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: '#0ea5e9' }}>Open in Kibana ↗</a>
        )}
      </div>

      {view === 'stream' ? (
        <div className="flex-1 p-3 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45', overflow: 'auto' }}>
          <LogStream logs={filtered} maxLines={100} />
        </div>
      ) : (
        <iframe src={KIBANA_URL} style={{ flex: 1, border: 'none', width: '100%', minHeight: '600px' }} title="Kibana log search" />
      )}
    </div>
  )
}