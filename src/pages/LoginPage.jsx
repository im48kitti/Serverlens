import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { login }           = useAuth();
  const { theme }           = useTheme();
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoad]  = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('กรุณากรอกข้อมูลให้ครบ'); return; }
    setLoad(true);
    setError('');
    // จำลอง delay เหมือน API จริง
    await new Promise(r => setTimeout(r, 800));
    const ok = login(username, password);
    if (!ok) setError('Username หรือ Password ไม่ถูกต้อง');
    setLoad(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{ ...styles.page, background: theme.bg }}>

      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚡</div>
          <div>
            <div style={styles.brandTitle}>ServerLens</div>
            <div style={styles.brandSub}>Network Infrastructure Dashboard</div>
          </div>
        </div>
        <h2 style={styles.leftTitle}>Monitor your infrastructure<br />in real-time</h2>
        <div style={styles.features}>
          {['Real-time server monitoring', 'Instant alert notifications', 'Bandwidth & latency tracking', 'Incident report management'].map(f => (
            <div key={f} style={styles.feature}>
              <span style={styles.featureIcon}>✓</span> {f}
            </div>
          ))}
        </div>
        <div style={styles.serverCount}>
          <span style={styles.countNum}>8</span>
          <span style={styles.countLabel}>Servers Monitored</span>
          <span style={styles.dot} />
          <span style={styles.countNum}>3</span>
          <span style={styles.countLabel}>Data Centers</span>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{ ...styles.right, background: theme.surface, borderColor: theme.border }}>
        <div style={styles.formHeader}>
          <h2 style={{ ...styles.formTitle, color: theme.text }}>Sign In</h2>
          <p style={{ color: theme.subtext, fontSize: '0.88rem' }}>
            เข้าสู่ระบบ ServerLens
          </p>
        </div>

        <div style={styles.form}>
          {/* Username */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: theme.subtext }}>Username</label>
            <input
              value={username}
              onChange={e => setUser(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="เช่น admin"
              style={{ ...styles.input, background: theme.inputBg, border: `1px solid ${error ? '#ef4444' : theme.border}`, color: theme.text }}
              data-testid="input-username"
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: theme.subtext }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPass(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              style={{ ...styles.input, background: theme.inputBg, border: `1px solid ${error ? '#ef4444' : theme.border}`, color: theme.text }}
              data-testid="input-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
            data-testid="login-btn"
          >
            {loading ? '⏳ กำลังเข้าสู่ระบบ...' : '→ Sign In'}
          </button>

          {/* Demo accounts */}
          <div style={{ ...styles.demoBox, background: theme.inputBg, border: `1px solid ${theme.border}` }}>
            <p style={{ color: theme.subtext, fontSize: '0.78rem', marginBottom: '8px', fontWeight: '600' }}>
              🔑 Demo Accounts
            </p>
            {[
              { u: 'admin',    p: 'admin123',  r: 'Admin' },
              { u: 'operator', p: 'op123',     r: 'Operator' },
              { u: 'viewer',   p: 'view123',   r: 'Viewer' },
            ].map(acc => (
              <button
                key={acc.u}
                onClick={() => { setUser(acc.u); setPass(acc.p); setError(''); }}
                style={{ ...styles.demoBtn, color: theme.subtext, border: `1px solid ${theme.border}`, background: theme.surface }}
              >
                <strong style={{ color: theme.text }}>{acc.u}</strong> · {acc.r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' },
  left:       { background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' },
  brand:      { display: 'flex', alignItems: 'center', gap: '14px' },
  brandIcon:  { width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  brandTitle: { fontWeight: '800', fontSize: '1.3rem', color: 'white' },
  brandSub:   { fontSize: '0.78rem', color: '#a5b4fc', marginTop: '2px' },
  leftTitle:  { fontSize: '2rem', fontWeight: '800', color: 'white', lineHeight: 1.4 },
  features:   { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature:    { color: '#c7d2fe', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' },
  featureIcon:{ color: '#818cf8', fontWeight: '700' },
  serverCount:{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px' },
  countNum:   { fontSize: '1.6rem', fontWeight: '800', color: 'white' },
  countLabel: { fontSize: '0.78rem', color: '#a5b4fc' },
  dot:        { width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1', margin: '0 4px' },
  right:      { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', border: 'none' },
  formHeader: { marginBottom: '32px' },
  formTitle:  { fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' },
  form:       { display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '360px', width: '100%' },
  field:      { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:      { fontSize: '0.82rem', fontWeight: '600' },
  input:      { padding: '12px 16px', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' },
  errorBox:   { background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' },
  loginBtn:   { padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700', letterSpacing: '0.5px' },
  demoBox:    { borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' },
  demoBtn:    { padding: '8px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left' },
};