import { useTheme } from '../context/ThemeContext';
import { servers, initialMetrics } from '../data/mockData';

// สร้าง mock uptime history 30 วันย้อนหลัง
const generateUptimeHistory = (baseUptime, serverId) => {
  return Array.from({ length: 30 }, (_, i) => {
    const date    = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toLocaleDateString('sv-SE');

    // server offline มี uptime ต่ำ
    if (serverId === 7 && i >= 27) {
      return { date: dateStr, uptime: 0, incidents: 1, downtime: 1440 };
    }

    // server warning มีบางวันที่ uptime ต่ำ
    const variance = serverId === 4 ? 3 : 0.5;
    const uptime   = Math.min(100, Math.max(85, baseUptime + (Math.random() - 0.5) * variance));
    const downtime = Math.round(((100 - uptime) / 100) * 1440);

    return {
      date:      dateStr,
      uptime:    parseFloat(uptime.toFixed(3)),
      incidents: downtime > 30 ? 1 : 0,
      downtime,
    };
  });
};

const uptimeHistories = {
  1: generateUptimeHistory(99.98, 1),
  2: generateUptimeHistory(99.95, 2),
  3: generateUptimeHistory(99.99, 3),
  4: generateUptimeHistory(98.21, 4),
  5: generateUptimeHistory(99.87, 5),
  6: generateUptimeHistory(100,   6),
  7: generateUptimeHistory(95.10, 7),
  8: generateUptimeHistory(99.72, 8),
};

const getUptimeColor = (uptime) => {
  if (uptime === 0)    return '#ef4444';
  if (uptime < 99)     return '#f59e0b';
  if (uptime < 99.9)   return '#3b82f6';
  return '#10b981';
};

const getUptimeBg = (uptime) => {
  if (uptime === 0)    return '#ef444433';
  if (uptime < 99)     return '#f59e0b33';
  if (uptime < 99.9)   return '#3b82f633';
  return '#10b98133';
};

export default function UptimePage() {
  const { theme } = useTheme();

  // คำนวณ summary แต่ละ server
  const summaries = servers.map(s => {
    const history  = uptimeHistories[s.id];
    const avg      = history.reduce((sum, d) => sum + d.uptime, 0) / history.length;
    const minDay   = history.reduce((a, b) => a.uptime < b.uptime ? a : b);
    const totalInc = history.reduce((sum, d) => sum + d.incidents, 0);
    const totalDown = history.reduce((sum, d) => sum + d.downtime, 0);
    return { ...s, avg, minDay, totalInc, totalDown };
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: theme.text }}>Uptime History</h1>
        <p style={{ color: theme.subtext, fontSize: '0.85rem', marginTop: '4px' }}>
          สถิติ uptime ย้อนหลัง 30 วัน · ทุก server
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { color: '#10b981', label: '≥ 99.9% (Excellent)' },
          { color: '#3b82f6', label: '99–99.9% (Good)' },
          { color: '#f59e0b', label: '< 99% (Warning)' },
          { color: '#ef4444', label: '0% (Offline)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: theme.subtext }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '0', padding: '12px 20px', background: theme.inputBg, fontSize: '0.75rem', fontWeight: '700', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Server</span>
          <span>Avg Uptime (30d)</span>
          <span>Worst Day</span>
          <span>Incidents</span>
          <span>Total Downtime</span>
        </div>

        {summaries.map((s, i) => (
          <div
            key={s.id}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '0', padding: '16px 20px', borderTop: `1px solid ${theme.border}`, alignItems: 'center' }}
          >
            {/* Server name */}
            <div>
              <div style={{ fontWeight: '700', color: theme.text, fontSize: '0.9rem' }}>{s.name}</div>
              <div style={{ color: theme.subtext, fontSize: '0.75rem', marginTop: '2px' }}>{s.location}</div>
            </div>

            {/* Avg uptime + bar */}
            <div>
              <div style={{ fontWeight: '700', color: getUptimeColor(s.avg), fontSize: '0.95rem' }}>
                {s.avg.toFixed(3)}%
              </div>
              <div style={{ height: '4px', background: theme.border, borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.avg}%`, background: getUptimeColor(s.avg), borderRadius: '2px' }} />
              </div>
            </div>

            {/* Worst day */}
            <div>
              <div style={{ fontWeight: '600', color: getUptimeColor(s.minDay.uptime), fontSize: '0.85rem' }}>
                {s.minDay.uptime.toFixed(2)}%
              </div>
              <div style={{ color: theme.subtext, fontSize: '0.72rem', fontFamily: 'monospace' }}>
                {s.minDay.date}
              </div>
            </div>

            {/* Incidents */}
            <div>
              <span style={{
                background: s.totalInc > 0 ? '#ef444422' : '#10b98122',
                color:      s.totalInc > 0 ? '#ef4444'   : '#10b981',
                padding: '3px 10px', borderRadius: '6px',
                fontSize: '0.82rem', fontWeight: '700',
              }}>
                {s.totalInc} incident{s.totalInc !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Total downtime */}
            <div style={{ color: s.totalDown > 60 ? '#f59e0b' : theme.subtext, fontSize: '0.85rem', fontWeight: '600' }}>
              {s.totalDown >= 60
                ? `${Math.floor(s.totalDown / 60)}h ${s.totalDown % 60}m`
                : `${s.totalDown}m`
              }
            </div>
          </div>
        ))}
      </div>

      {/* Per-server heatmap calendar */}
      {servers.map(s => (
        <div key={s.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontWeight: '700', color: theme.text, fontSize: '0.95rem' }}>{s.name}</span>
              <span style={{ color: theme.subtext, fontSize: '0.78rem', marginLeft: '10px' }}>{s.type}</span>
            </div>
            <span style={{ fontWeight: '700', color: getUptimeColor(initialMetrics[s.id].uptime), fontSize: '0.88rem' }}>
              {initialMetrics[s.id].uptime.toFixed(2)}% current
            </span>
          </div>

          {/* Heatmap — 30 blocks */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {uptimeHistories[s.id].map((day, i) => (
              <div
                key={i}
                title={`${day.date}: ${day.uptime}% uptime${day.downtime > 0 ? ` (${day.downtime}m down)` : ''}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '5px',
                  background: getUptimeBg(day.uptime),
                  border: `1px solid ${getUptimeColor(day.uptime)}44`,
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.55rem',
                  color: getUptimeColor(day.uptime),
                  fontWeight: '700',
                }}
              >
                {day.uptime === 0 ? '✕' : day.incidents > 0 ? '!' : ''}
              </div>
            ))}
          </div>

          {/* Date labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingX: '2px' }}>
            <span style={{ fontSize: '0.68rem', color: theme.subtext }}>
              {uptimeHistories[s.id][0].date}
            </span>
            <span style={{ fontSize: '0.68rem', color: theme.subtext }}>
              {uptimeHistories[s.id][29].date}
            </span>
          </div>
        </div>
      ))}

    </div>
  );
}