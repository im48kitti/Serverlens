 import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MetricChart({ data, color = '#6366f1', unit = '%' }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: '#1a1f2e', border: '1px solid #2a3347', borderRadius: '8px', fontSize: '0.75rem' }}
          formatter={(v) => [`${v.toFixed(1)}${unit}`, '']}
          labelStyle={{ color: '#64748b' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
