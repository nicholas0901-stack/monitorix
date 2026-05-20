const settings = [
  { section: 'Agent', items: [
    { label: 'Agent URL', value: import.meta.env.VITE_API_URL || 'http://localhost:8080' },
    { label: 'Metrics refresh', value: '5 seconds' },
    { label: 'Log refresh', value: '3 seconds' },
    { label: 'Log retention', value: '50 entries (UI)' }
  ]},
  { section: 'Prometheus', items: [
    { label: 'Prometheus URL', value: 'http://localhost:9090' },
    { label: 'Scrape interval', value: '15 seconds' },
    { label: 'Retention', value: '15 days' }
  ]},
  { section: 'Grafana', items: [
    { label: 'Grafana URL', value: import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3001' },
    { label: 'Admin user', value: 'admin' },
    { label: 'Datasource', value: 'Prometheus (auto-provisioned)' }
  ]},
  { section: 'ELK Stack', items: [
    { label: 'Elasticsearch', value: 'http://localhost:9200' },
    { label: 'Kibana URL', value: import.meta.env.VITE_KIBANA_URL || 'http://localhost:5601' },
    { label: 'Log index', value: 'monitorix-logs-*' },
    { label: 'TTL', value: '7 days' }
  ]}
]

export default function SettingsPage() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {settings.map(group => (
        <div key={group.section} className="p-4 rounded" style={{ background: '#0d1626', border: '1px solid #1e2d45' }}>
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#0ea5e9' }}>{group.section}</div>
          {group.items.map(item => (
            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2d45' }}>
              <span className="text-xs" style={{ color: '#4d6680' }}>{item.label}</span>
              <span className="text-xs font-mono" style={{ color: '#64748b' }}>{item.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}