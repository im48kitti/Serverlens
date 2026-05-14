import { useParams, useNavigate } from 'react-router-dom';
import { servers, initialMetrics } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import MetricChart from '../components/MetricChart';
import AlertBadge  from '../components/AlertBadge';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const statusStyle = {
  online:  { color: '#10b981', label: '● Online' },
  offline: { color: '#ef4444', label: '● Offline' },
  warning: { color: '#f59e0b', label: '● Warning' },
};

const getColor = (val) =>
  val >= 85 ? '#ef4444' : val >= 70 ? '#f59e0b' : '#10b981';

// Mock incident history ของแต่ละ server
const mockIncidents = {
  1: [],
  2: [{ id: 1, time: '2025-05-01 14:22', type: 'warning', desc: 'CPU spike ถึง 78% นาน 5 นาที', resolved: true }],
  3: [],
  4: [
    { id: 1, time: '2025-05-10 10:40', type: 'critical', desc: 'CPU สูงเกิน 85% ต่อเนื่อง', resolved: false },
    { id: 2, time: '2025-05-10 10:43', type: 'critical', desc: 'RAM เกิน 90%',               resolved: false },
    { id: 3, time: '2025-05-08 08:11', type: 'warning',  desc: 'Latency สูงกว่าปกติ',        resolved: true },
  ],
  5: [{ id: 1, time: '2025-05-03 22:10', type: 'info', desc: 'Scheduled maintenance', resolved: true }],
  6: [],
  7: [{ id: 1, time: '2025-05-10 09:15', type: 'critical', desc: 'Server went offline', resolved: false }],
  8: [{ id: 1, time: '2025-04-28 11:00', type: 'warning', desc: 'Latency สูงผิดปกติ 40ms+', resolved: true }],
};

// สร้าง combined chart data (CPU + RAM + Bandwidth)
const buildChartData = (history) =>
  history.cpu.map((c, i) => ({
    time:      c.time,
    CPU:       parseFloat(c.value.toFixed(1)),
    RAM:       parseFloat(history.ram[i]?.value.toFixed(1) ?? 0),
    Bandwidth: parseFloat(history.bandwidth[i]?.value.toFixed(2) ?? 0),
  }));

export default function ServerDetailPage({ metrics }) {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { theme }     = useTheme();
  const server        = servers.find(s => s.id === Number(id));
  const metric        = metrics?.[Number(id)];
  const incidents     = mockIncidents[Number(id)] ?? [];
  const chartData     = metric ? buildChartData(metric.history) : [];
  const s             = server ? statusStyle[server.status] : null;

  if (!server || !metric) return (
    <div style={{ padding: '60px', textAlign: 'center', color: theme.subtext }}>
      <h2 style={{ color: theme.text }}>😕 ไม่พบ Server</h2>
      <button onClick={() => navigate('/servers')} style={styles.backBtn}>
        ← กลับ
      </button>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/servers')}
        style={{ ...styles.backBtn, background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
      >
        ← กลับ
      </button>

      {/* Header */}
      <div style={{ ...styles.header, background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div style={styles.headerLeft}>
          <div style={styles.serverIcon}>🖥️</div>
          <div>
            <h1 style={{ ...styles.serverName, color: theme.text }}>{server.name}</h1>
            <p style={{ color: theme.subtext, fontSize: '0.88rem', marginTop: '4px' }}>
              {server.type} · {server.location}
            </p>
            <p style={{ color: '#3b82f6', fontSize: '0.82rem', fontFamily: 'monospace', marginTop: '2px' }}>
              {server.ip}
            </p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={{ color: s.color, fontWeight: '700', fontSize: '1rem' }}>{s.label}</span>
          <div style={{ ...styles.uptimeBox, background: theme.inputBg }}>
            <span style={{ color: theme.subtext, fontSize: '0.78rem' }}>Uptime</span>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1.2rem' }}>
              {metric.uptime.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={styles.metricGrid}>
        {[
          { label: 'CPU Usage',       value: `${metric.cpu.toFixed(1)}%`,        color: getColor(metric.cpu),      icon: '⚙️' },
          { label: 'RAM Usage',       value: `${metric.ram.toFixed(1)}%`,        color: getColor(metric.ram),      icon: '💾' },
          { label: 'Bandwidth',       value: `${metric.bandwidth.toFixed(2)} Gbps`, color: '#6366f1',              icon: '📡' },
          { label: 'Latency',         value: `${metric.latency} ms`,             color: metric.latency > 30 ? '#f59e0b' : '#10b981', icon: '⏱️' },
        ].map(m => (
          <div key={m.label} style={{ ...styles.metricCard, background: theme.surface, border: `1px solid ${theme.border}` }}>
            <div style={styles.metricTop}>
              <span style={styles.metricIcon}>{m.icon}</span>
              <span style={{ ...styles.metricVal, color: m.color }}>{m.value}</span>
            </div>
            <div style={{ color: theme.subtext, fontSize: '0.8rem' }}>{m.label}</div>
            {/* Mini progress bar */}
            {m.label !== 'Latency' && m.label !== 'Bandwidth' && (
              <div style={styles.barBg}>
                <div style={{ ...styles.barFill, width: `${parseFloat(m.value)}%`, background: m.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Combined Chart */}
      <div style={{ ...styles.chartBox, background: theme.surface, border: `1px solid ${theme.border}` }}>
        <h3 style={{ ...styles.sectionTitle, color: theme.subtext }}>Performance History (Last 20 Updates)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gCPU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRAM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="time" tick={{ fill: theme.subtext, fontSize: 11 }} />
            <YAxis tick={{ fill: theme.subtext, fontSize: 11 }} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '0.8rem' }}
              labelStyle={{ color: theme.subtext }}
            />
            <Legend wrapperStyle={{ color: theme.subtext, fontSize: '0.82rem' }} />
            <Area type="monotone" dataKey="CPU" stroke="#6366f1" fill="url(#gCPU)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="RAM" stroke="#10b981" fill="url(#gRAM)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Incident History */}
      <div style={{ ...styles.incidentBox, background: theme.surface, border: `1px solid ${theme.border}` }}>
        <h3 style={{ ...styles.sectionTitle, color: theme.subtext }}>Incident History</h3>
        {incidents.length === 0 ? (
          <div style={{ color: theme.subtext, fontSize: '0.9rem', padding: '20px 0', textAlign: 'center' }}>
            ✅ ไม่มี incident บน server นี้
          </div>
        ) : (
          <div style={styles.incidentList}>
            {incidents.map(inc => (
              <div key={inc.id} style={{ ...styles.incidentRow, borderColor: theme.border, opacity: inc.resolved ? 0.6 : 1 }}>
                <AlertBadge type={inc.type} />
                <span style={{ color: theme.text, fontSize: '0.88rem', flex: 1 }}>{inc.desc}</span>
                <span style={{ color: theme.subtext, fontSize: '0.78rem', fontFamily: 'monospace' }}>{inc.time}</span>
                {inc.resolved
                  ? <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>✓ Resolved</span>
                  : <span style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: '600' }}>● Active</span>
                }
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  backBtn:      { padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', marginBottom: '20px' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px', padding: '24px 28px', marginBottom: '20px' },
  headerLeft:   { display: 'flex', alignItems: 'center', gap: '16px' },
  serverIcon:   { fontSize: '2.5rem' },
  serverName:   { fontSize: '1.5rem', fontWeight: '800' },
  headerRight:  { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
  uptimeBox:    { padding: '10px 18px', borderRadius: '10px', textAlign: 'center' },
  metricGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  metricCard:   { borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
  metricTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  metricIcon:   { fontSize: '1.3rem' },
  metricVal:    { fontSize: '1.4rem', fontWeight: '800' },
  barBg:        { height: '4px', background: '#2a3347', borderRadius: '2px', overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: '2px', transition: 'width 0.5s' },
  chartBox:     { borderRadius: '14px', padding: '24px', marginBottom: '20px' },
  incidentBox:  { borderRadius: '14px', padding: '24px' },
  sectionTitle: { fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' },
  incidentList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  incidentRow:  { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid', flexWrap: 'wrap' },
};