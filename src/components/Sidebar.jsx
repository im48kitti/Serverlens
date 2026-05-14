import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const nav = [
  { path: '/',          icon: '📊', label: 'Dashboard'  },
  { path: '/servers',   icon: '🖥️', label: 'Servers'    },
  { path: '/bandwidth', icon: '📡', label: 'Bandwidth'  },
  { path: '/incidents', icon: '📝', label: 'Incidents'  },
  { path: '/uptime',    icon: '📈', label: 'Uptime'     },
  { path: '/alerts',    icon: '🔔', label: 'Alerts'     },
];

export default function Sidebar({ alertCount, search, setSearch }) {
  const { pathname }    = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <aside style={{ ...styles.sidebar, background: theme.navBg, borderColor: theme.border }}>

      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
        <div>
          <div style={styles.logoTitle}>ServerLens</div>
          <div style={styles.logoSub}>Dashboard</div>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="🔍 Search server..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          ...styles.search,
          background: theme.inputBg,
          border: `1px solid ${theme.border}`,
          color: theme.text,
          marginBottom: '16px',
        }}
      />

      {/* Nav */}
      <nav style={styles.nav}>
        {nav.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              color: theme.subtext,
              ...(pathname === item.path ? styles.navActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {item.path === '/alerts' && alertCount > 0 && (
              <span style={styles.badge}>{alertCount}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Dark/Light Toggle */}
      <button onClick={toggle} style={{ ...styles.toggleBtn, background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text }}>
        {theme.dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Footer */}
      <div style={{ ...styles.footer, background: theme.inputBg }}>
        <div style={styles.dot} />
        <div>
          <div style={{ fontSize: '0.78rem', color: theme.text }}>Live Monitoring</div>
          <div style={{ fontSize: '0.7rem', color: theme.subtext }}>Updates every 2s</div>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    borderRight: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    gap: '4px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingLeft: '8px',
  },
  logoIcon: {
    width: '38px', height: '38px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
  },
  logoTitle: { fontWeight: '800', fontSize: '1.1rem' },
  logoSub:   { fontSize: '0.7rem', marginTop: '-2px' },
  search: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px',
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500',
    position: 'relative',
  },
  navActive: { background: '#6366f122', color: '#818cf8' },
  navIcon:   { fontSize: '1rem' },
  badge: {
    marginLeft: 'auto',
    background: '#ef4444', color: 'white',
    borderRadius: '10px', padding: '1px 7px',
    fontSize: '0.7rem', fontWeight: '700',
  },
  toggleBtn: {
    padding: '10px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '0.82rem',
    fontWeight: '600', marginBottom: '12px',
    width: '100%', textAlign: 'left',
  },
  footer: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px', borderRadius: '10px',
  },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0,
  },
};