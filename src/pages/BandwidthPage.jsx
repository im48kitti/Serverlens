import { useTheme } from '../context/ThemeContext';
import { servers }  from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LineChart, Line, Cell
} from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#8b5cf6','#14b8a6'];

export default function BandwidthPage({ metrics }) {
  const { theme } = useTheme();

  // ข้อมูลเปรียบเทียบทุก server
  const compareData = servers.map((s, i) => ({
  name: s.name.replace('SL-', ''),
    fullName:  s.name,
    bandwidth: parseFloat((metrics[s.id]?.bandwidth ?? 0).toFixed(2)),
    latency:   metrics[s.id]?.latency ?? 0,
    status:    s.status,
    color:     COLORS[i],
  }));

  // Top 3 bandwidth
  const top3 = [...compareData].sort((a, b) => b.bandwidth - a.bandwidth).slice(0, 3);

  // History ของทุก server รวมกัน (20 จุด)
  const historyData = metrics[1]?.history.bandwidth.map((_, i) => {
    const point = { time: `${i + 1}m` };
    servers.forEach(s => {
      const key = s.name.replace('SL-', '');
      point[key] = parseFloat((metrics[s.id]?.history.bandwidth[i]?.value ?? 0).toFixed(2));
    });
    return point;
  }) ?? [];

  const totalBandwidth = compareData.reduce((sum, s) => sum + s.bandwidth, 0);
  const avgBandwidth   = totalBandwidth / compareData.filter(s => s.status !== 'offline').length;
  const maxServer      = compareData.reduce((a, b) => a.bandwidth > b.bandwidth ? a : b);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: theme.text }}>Bandwidth Monitor</h1>
        <p style={{ color: theme.subtext, fontSize: '0.85rem', marginTop: '4px' }}>
          เปรียบเทียบ bandwidth usage ทุก server · Real-time
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: '📡', label: 'Total Bandwidth',   value: `${totalBandwidth.toFixed(2)} Gbps`, color: '#6366f1' },
          { icon: '📊', label: 'Average per Server', value: `${avgBandwidth.toFixed(2)} Gbps`,  color: '#10b981' },
          { icon: '🔝', label: 'Highest Usage',      value: `${maxServer.fullName}`,             color: '#f59e0b', sub: `${maxServer.bandwidth} Gbps` },
        ].map(c => (
          <div key={c.label} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: c.color + '22', color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: c.color }}>{c.value}</div>
              {c.sub && <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>{c.sub}</div>}
              <div style={{ fontSize: '0.78rem', color: theme.subtext, marginTop: '2px' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart — เปรียบทุก server */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          Current Bandwidth Usage — All Servers
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={compareData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: theme.subtext, fontSize: 11 }} />
            <YAxis tick={{ fill: theme.subtext, fontSize: 11 }} unit=" Gbps" />
            <Tooltip
              contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '0.82rem' }}
              labelStyle={{ color: theme.text }}
              formatter={(v, _, props) => [`${v} Gbps`, props.payload.fullName]}
            />
            <Bar dataKey="bandwidth" radius={[6, 6, 0, 0]}>
              {compareData.map((entry, i) => (
                <Cell key={i} fill={entry.status === 'offline' ? '#374151' : entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart — history */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          Bandwidth History (Last 20 Updates)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="time" tick={{ fill: theme.subtext, fontSize: 10 }} />
            <YAxis tick={{ fill: theme.subtext, fontSize: 10 }} unit=" G" />
            <Tooltip
              contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '0.78rem' }}
              labelStyle={{ color: theme.subtext }}
            />
            <Legend wrapperStyle={{ color: theme.subtext, fontSize: '0.75rem' }} />
            {servers.filter(s => s.status !== 'offline').map((s, i) => {
              const key = s.name.replace('JasTel-', '').replace('Monomax-', 'MX-').replace('CCS-', '').replace('JSTC-', '');
              return (
                <Line key={s.id} type="monotone" dataKey={key} stroke={COLORS[i]} strokeWidth={2} dot={false} />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 Table */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          🏆 Top 3 Highest Bandwidth
        </h3>
        {top3.map((s, i) => (
          <div key={s.fullName} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.color + '22', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', color: theme.text, fontSize: '0.92rem' }}>{s.fullName}</div>
              <div style={{ color: theme.subtext, fontSize: '0.78rem', marginTop: '2px' }}>Latency: {s.latency}ms</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '800', color: s.color, fontSize: '1.1rem' }}>{s.bandwidth} Gbps</div>
              <div style={{ fontSize: '0.72rem', color: theme.subtext }}>
                {((s.bandwidth / totalBandwidth) * 100).toFixed(1)}% of total
              </div>
            </div>
            {/* Mini bar */}
            <div style={{ width: '100px', height: '6px', background: theme.border, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(s.bandwidth / maxServer.bandwidth) * 100}%`, background: s.color, borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}