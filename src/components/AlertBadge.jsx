 const colors = {
  critical: { bg: '#ff000022', text: '#ff4444', border: '#ff444433' },
  warning:  { bg: '#ffaa0022', text: '#ffaa00', border: '#ffaa0033' },
  info:     { bg: '#3b82f622', text: '#3b82f6', border: '#3b82f633' },
};

export default function AlertBadge({ type }) {
  const c = colors[type] || colors.info;
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: '6px',
      padding: '2px 10px',
      fontSize: '0.72rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {type}
    </span>
  );
}
