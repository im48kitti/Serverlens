import { useNavigate } from 'react-router-dom';
import MetricChart from './MetricChart';

const statusStyle = {
  online:  { color: '#10b981', bg: '#10b98122', label: '● Online' },
  offline: { color: '#ef4444', bg: '#ef444422', label: '● Offline' },
  warning: { color: '#f59e0b', bg: '#f59e0b22', label: '● Warning' },
};

const getColor = (val) => {
  if (val >= 85) return '#ef4444';
  if (val >= 70) return '#f59e0b';
  return '#10b981';
};

export default function ServerCard({ server, metrics }) {
  const navigate = useNavigate();
  const s = statusStyle[server.status];
  const m = metrics;

  return (
    <div
      style={{ ...styles.card, cursor: 'pointer' }}
      onClick={() => navigate(`/server/${server.id}`)}
    >
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.name}>{server.name}</div>
          <div style={styles.meta}>{server.type} · {server.location}</div>
          <div style={styles.ip}>{server.ip}</div>
        </div>
        <span style={{ ...styles.status, background: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>

      {server.status === 'offline' ? (
        <div style={styles.offline}>Server Offline</div>
      ) : (
        <>
          {/* Metrics Row */}
          <div style={styles.metrics}>
            {[
              { label: 'CPU',       value: m.cpu,       unit: '%',     color: getColor(m.cpu) },
              { label: 'RAM',       value: m.ram,       unit: '%',     color: getColor(m.ram) },
              { label: 'Bandwidth', value: m.bandwidth, unit: ' Gbps', color: '#6366f1', fixed: 1 },
              { label: 'Latency',   value: m.latency,   unit: 'ms',    color: m.latency > 30 ? '#f59e0b' : '#10b981' },
            ].map(item => (
              <div key={item.label} style={styles.metric}>
                <div style={{ ...styles.metricVal, color: item.color }}>
                  {item.fixed ? item.value.toFixed(item.fixed) : Math.round(item.value)}{item.unit}
                </div>
                <div style={styles.metricLabel}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* CPU Chart */}
          <div style={styles.chartLabel}>CPU Usage</div>
          <MetricChart data={m.history.cpu} color={getColor(m.cpu)} />

          {/* Uptime */}
          <div style={styles.uptime}>
            Uptime: <span style={{ color: '#10b981' }}>{m.uptime.toFixed(2)}%</span>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#1a1f2e',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #2a3347',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  name:        { fontWeight: '700', fontSize: '1rem', color: '#f1f5f9' },
  meta:        { fontSize: '0.78rem', color: '#64748b', marginTop: '2px' },
  ip:          { fontSize: '0.75rem', color: '#3b82f6', marginTop: '2px', fontFamily: 'monospace' },
  status:      { borderRadius: '8px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap' },
  metrics:     { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: '#0f1117', borderRadius: '10px', padding: '12px' },
  metric:      { textAlign: 'center' },
  metricVal:   { fontSize: '1rem', fontWeight: '700' },
  metricLabel: { fontSize: '0.7rem', color: '#64748b', marginTop: '2px' },
  chartLabel:  { fontSize: '0.75rem', color: '#64748b' },
  uptime:      { fontSize: '0.78rem', color: '#64748b', textAlign: 'right' },
  offline:     { textAlign: 'center', padding: '24px', color: '#ef4444', fontSize: '0.9rem', background: '#ef444411', borderRadius: '10px' },
};