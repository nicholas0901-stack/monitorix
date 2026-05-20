const GRAFANA_URL = 'http://localhost:3001'

export default function MetricsPage() {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#4d6680' }}>
          Grafana running at <span style={{ color: '#0ea5e9' }}>localhost:3001</span>
        </span>
        <a href={GRAFANA_URL} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '12px', color: '#0ea5e9', padding: '6px 16px', border: '1px solid #0ea5e9', borderRadius: '4px', textDecoration: 'none' }}>
          Open Grafana ↗
        </a>
      </div>

      <div style={{ background: '#0d1626', border: '1px solid #1e2d45', borderRadius: '6px', padding: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '16px' }}>
          Quick links
        </div>
        {[
          { label: 'Dashboards', url: `${GRAFANA_URL}/dashboards`, desc: 'View all Grafana dashboards' },
          { label: 'Explore metrics', url: `${GRAFANA_URL}/explore`, desc: 'Query Prometheus with PromQL' },
          { label: 'Datasources', url: `${GRAFANA_URL}/datasources`, desc: 'Prometheus auto-configured' },
          { label: 'Create dashboard', url: `${GRAFANA_URL}/dashboard/new`, desc: 'Build a custom dashboard' },
          { label: 'Alerting', url: `${GRAFANA_URL}/alerting`, desc: 'Configure alert rules' },
        ].map(link => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: '8px', background: '#060910', border: '1px solid #1e2d45', borderRadius: '6px', textDecoration: 'none' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{link.label}</div>
              <div style={{ fontSize: '11px', color: '#4d6680', marginTop: '2px' }}>{link.desc}</div>
            </div>
            <span style={{ color: '#0ea5e9', fontSize: '13px' }}>↗</span>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#0d1626', border: '1px solid #1e2d45', borderRadius: '6px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#4d6680', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Prometheus datasource</div>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#22c55e', marginBottom: '6px' }}>http://prometheus:9090</div>
          <div style={{ fontSize: '11px', color: '#334155' }}>Auto-provisioned on startup</div>
          <div style={{ fontSize: '11px', color: '#334155', marginTop: '3px' }}>Scrape interval: 15 seconds</div>
        </div>
        <div style={{ background: '#0d1626', border: '1px solid #1e2d45', borderRadius: '6px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#4d6680', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Useful PromQL queries</div>
          {[
            'jvm_memory_used_bytes',
            'process_cpu_usage',
            'http_server_requests_seconds_count',
            'jvm_threads_live_threads',
          ].map(q => (
            <div key={q} style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0ea5e9', marginBottom: '4px' }}>{q}</div>
          ))}
        </div>
      </div>

    </div>
  )
}