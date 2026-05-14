 
import { useState } from 'react';
import AlertBadge from '../components/AlertBadge';

export default function AlertsPage({ alerts, setAlerts }) {
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a =>
    filter === 'all'      ? true :
    filter === 'active'   ? !a.resolved :
    filter === 'resolved' ? a.resolved : true
  );

  const resolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Alerts</h1>
          <p style={styles.sub}>{alerts.filter(a => !a.resolved).length} active · {alerts.filter(a => a.resolved).length} resolved</p>
        </div>

        {/* Filter */}
        <div style={styles.filters}>
          {['all', 'active', 'resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Severity</span>
          <span>Server</span>
          <span>Metric</span>
          <span>Value</span>
          <span>Threshold</span>
          <span>Time</span>
          <span>Action</span>
        </div>

        {filtered.map(alert => (
          <div key={alert.id} style={{
            ...styles.tableRow,
            opacity: alert.resolved ? 0.5 : 1,
          }}>
            <span><AlertBadge type={alert.type} /></span>
            <span style={styles.serverName}>{alert.serverName}</span>
            <span style={styles.metric}>{alert.metric}</span>
            <span style={{ color: alert.type === 'critical' ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>{alert.value}</span>
            <span style={styles.threshold}>{alert.threshold}</span>
            <span style={styles.time}>{alert.time}</span>
            <span>
              {alert.resolved
                ? <span style={styles.resolvedTag}>✓ Resolved</span>
                : <button style={styles.resolveBtn} onClick={() => resolve(alert.id)}>Resolve</button>
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page:         { padding: '32px', maxWidth: '1400px' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title:        { fontSize: '1.6rem', fontWeight: '800', color: '#f1f5f9' },
  sub:          { color: '#64748b', fontSize: '0.85rem', marginTop: '4px' },
  filters:      { display: 'flex', gap: '8px' },
  filterBtn:    { padding: '8px 18px', borderRadius: '8px', border: '1px solid #2a3347', background: '#1a1f2e', color: '#64748b', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' },
  filterActive: { background: '#6366f122', color: '#818cf8', borderColor: '#6366f144' },
  table:        { background: '#1a1f2e', borderRadius: '14px', border: '1px solid #2a3347', overflow: 'hidden' },
  tableHeader:  { display: 'grid', gridTemplateColumns: '100px 1fr 1fr 100px 100px 100px 100px', gap: '16px', padding: '14px 20px', background: '#0f1117', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tableRow:     { display: 'grid', gridTemplateColumns: '100px 1fr 1fr 100px 100px 100px 100px', gap: '16px', padding: '16px 20px', borderTop: '1px solid #2a3347', alignItems: 'center', fontSize: '0.88rem' },
  serverName:   { fontWeight: '600', color: '#f1f5f9' },
  metric:       { color: '#94a3b8' },
  threshold:    { color: '#64748b' },
  time:         { color: '#475569', fontFamily: 'monospace', fontSize: '0.8rem' },
  resolvedTag:  { color: '#10b981', fontWeight: '600', fontSize: '0.8rem' },
  resolveBtn:   { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
};