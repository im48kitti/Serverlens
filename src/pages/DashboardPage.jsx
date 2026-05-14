import { servers } from '../data/mockData';
import StatCard   from '../components/StatCard';
import ServerCard from '../components/ServerCard';
import AlertBadge from '../components/AlertBadge';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPage({ metrics, alerts }) {
  const { theme } = useTheme();

  const online       = servers.filter(s => s.status === 'online').length;
  const warning      = servers.filter(s => s.status === 'warning').length;
  const offline      = servers.filter(s => s.status === 'offline').length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: theme.text }}>Network Dashboard</h1>
          <p style={{ color: theme.subtext, fontSize: '0.85rem', marginTop: '4px' }}>
            Network Infrastructure · Real-time Monitoring
          </p>
        </div>
        <div style={{ color: theme.subtext, fontSize: '0.82rem', padding: '8px 14px', background: theme.surface, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
          {new Date().toLocaleString('th-TH')}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon="🖥️" label="Total Servers" value={servers.length} sub="All nodes"        color="#6366f1" />
        <StatCard icon="✅" label="Online"         value={online}         sub="Running normally" color="#10b981" />
        <StatCard icon="⚠️" label="Warning"        value={warning}        sub="Needs attention"  color="#f59e0b" />
        <StatCard icon="❌" label="Offline"        value={offline}        sub="Down"             color="#ef4444" />
        <StatCard icon="🔔" label="Active Alerts"  value={activeAlerts}   sub="Unresolved"       color="#f43f5e" />
      </div>

      {/* Server Cards */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', color: theme.subtext, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Server Status
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {servers.map(s => (
          <ServerCard key={s.id} server={s} metrics={metrics[s.id]} />
        ))}
      </div>

      {/* Recent Alerts */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', color: theme.subtext, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Recent Alerts
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.slice(0, 5).map(alert => (
          <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: theme.surface, borderRadius: '10px', border: `1px solid ${theme.border}`, flexWrap: 'wrap' }}>
            <AlertBadge type={alert.type} />
            <span style={{ fontWeight: '600', color: theme.text, fontSize: '0.88rem' }}>{alert.serverName}</span>
            <span style={{ color: theme.subtext, fontSize: '0.85rem', flex: 1 }}>
              {alert.metric}: <strong style={{ color: theme.text }}>{alert.value}</strong>
            </span>
            <span style={{ color: theme.subtext, fontSize: '0.78rem' }}>{alert.time}</span>
            {alert.resolved && <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>✓ Resolved</span>}
          </div>
        ))}
      </div>

    </div>
  );
}