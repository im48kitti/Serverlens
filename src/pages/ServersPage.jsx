import { servers } from '../data/mockData';
import ServerCard   from '../components/ServerCard';
import { useTheme } from '../context/ThemeContext';

// Export เป็น CSV
const exportCSV = (metrics) => {
  const rows = [
    ['Server', 'Location', 'Type', 'IP', 'Status', 'CPU%', 'RAM%', 'Bandwidth(Gbps)', 'Latency(ms)', 'Uptime%'],
    ...servers.map(s => {
      const m = metrics[s.id];
      return [
        s.name, s.location, s.type, s.ip, s.status,
        m.cpu.toFixed(1), m.ram.toFixed(1),
        m.bandwidth.toFixed(2), m.latency, m.uptime,
      ];
    }),
  ];
  const csv     = rows.map(r => r.join(',')).join('\n');
  const blob    = new Blob([csv], { type: 'text/csv' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `serverlens-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ServersPage({ metrics, search }) {
  const { theme } = useTheme();

  // filter ตาม search
  const filtered = servers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.ip.includes(search)
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={{ ...styles.title, color: theme.text }}>All Servers</h1>
          <p style={{ ...styles.sub, color: theme.subtext }}>
               {filtered.length} / {servers.length} nodes · Network Infrastructure
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={() => exportCSV(metrics)}
          style={{ ...styles.exportBtn, background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
        >
          📥 Export CSV
        </button>
      </div>

      {/* No Result */}
      {filtered.length === 0 ? (
        <div style={{ ...styles.empty, color: theme.subtext }}>
          😕 ไม่พบ server ที่ค้นหา
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(s => (
            <ServerCard key={s.id} server={s} metrics={metrics[s.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page:      { padding: '32px', maxWidth: '1400px' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title:     { fontSize: '1.6rem', fontWeight: '800' },
  sub:       { fontSize: '0.85rem', marginTop: '4px' },
  exportBtn: { padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' },
  empty:     { textAlign: 'center', padding: '60px', fontSize: '1rem' },
};