import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const roleColor = { Admin: '#6366f1', Operator: '#f59e0b', Viewer: '#10b981' };

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme }        = useTheme();

  return (
    <div style={{ ...styles.bar, background: theme.surface, borderColor: theme.border }}>
      <div style={{ flex: 1 }} />
      <div style={styles.userBox}>
        <div style={{ ...styles.avatar, background: roleColor[user?.role] + '33', color: roleColor[user?.role] }}>
          {user?.name?.charAt(0)}
        </div>
        <div>
          <div style={{ ...styles.userName, color: theme.text }}>{user?.name}</div>
          <div style={{ ...styles.userRole, color: roleColor[user?.role] }}>{user?.role}</div>
        </div>
        <button onClick={logout} style={{ ...styles.logoutBtn, color: theme.subtext, border: `1px solid ${theme.border}`, background: theme.inputBg }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  bar:      { display: 'flex', alignItems: 'center', padding: '12px 32px', borderBottom: '1px solid', position: 'sticky', top: 0, zIndex: 50 },
  userBox:  { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar:   { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem' },
  userName: { fontSize: '0.88rem', fontWeight: '600' },
  userRole: { fontSize: '0.72rem', fontWeight: '600' },
  logoutBtn:{ padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
};