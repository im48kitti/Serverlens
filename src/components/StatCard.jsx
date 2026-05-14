 export default function StatCard({ icon, label, value, sub, color = '#6366f1' }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconBox, background: color + '22', color }}>
        {icon}
      </div>
      <div>
        <div style={styles.value}>{value}</div>
        <div style={styles.label}>{label}</div>
        {sub && <div style={styles.sub}>{sub}</div>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1a1f2e',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #2a3347',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  value: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#f1f5f9',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '2px',
  },
  sub: {
    fontSize: '0.75rem',
    color: '#10b981',
    marginTop: '2px',
  },
};
