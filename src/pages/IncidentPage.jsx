import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth }  from '../context/AuthContext';
import { servers }  from '../data/mockData';
import AlertBadge   from '../components/AlertBadge';

const SEVERITY = ['critical', 'warning', 'info'];

const emptyForm = {
  title:       '',
  serverId:    '',
  severity:    'warning',
  category:    '',
  description: '',
  steps:       '',
};

export default function IncidentPage() {
  const { theme }                   = useTheme();
  const { user }                    = useAuth();
  const [form,     setForm]         = useState(emptyForm);
  const [errors,   setErrors]       = useState({});
  const [incidents, setIncidents]   = useState([
    { id: 1, title: 'SL-Stream-01 CPU Critical',  serverId: 4, severity: 'critical', category: 'Performance',  description: 'CPU สูงเกิน 88% ต่อเนื่องนาน 10 นาที', steps: 'ตรวจสอบ process, restart service', status: 'open',     reporter: 'admin',    createdAt: '2025-05-10 10:42' },
    { id: 2, title: 'SL-Cloud-02 Offline',        serverId: 7, severity: 'critical', category: 'Availability', description: 'Server ไม่ตอบสนอง ping timeout',        steps: 'ติดต่อ DC team, ตรวจสอบ power',  status: 'open',     reporter: 'operator', createdAt: '2025-05-10 09:15' },
    { id: 3, title: 'SL-BKK-02 High Latency',     serverId: 2, severity: 'warning',  category: 'Network',      description: 'Latency สูงกว่าปกติ 40ms+',             steps: 'ตรวจสอบ routing table',           status: 'resolved', reporter: 'admin',    createdAt: '2025-05-08 14:30' },
  ]);
  const [showForm,  setShowForm]    = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'กรุณากรอกหัวข้อ';
    if (!form.serverId)           e.serverId     = 'กรุณาเลือก server';
    if (!form.category.trim())    e.category     = 'กรุณากรอก category';
    if (!form.description.trim()) e.description  = 'กรุณากรอกรายละเอียด';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const newIncident = {
      id:          incidents.length + 1,
      ...form,
      serverId:    Number(form.serverId),
      status:      'open',
      reporter:    user?.username ?? 'unknown',
      createdAt:   new Date().toLocaleString('sv-SE').slice(0, 16),
    };

    setIncidents(prev => [newIncident, ...prev]);
    setForm(emptyForm);
    setErrors({});
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
  };

  const getServerName = (id) => servers.find(s => s.id === id)?.name ?? 'Unknown';

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${errors[field] ? '#ef4444' : theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: theme.text }}>Incident Reports</h1>
          <p style={{ color: theme.subtext, fontSize: '0.85rem', marginTop: '4px' }}>
            {incidents.filter(i => i.status === 'open').length} open ·{' '}
            {incidents.filter(i => i.status === 'resolved').length} resolved
          </p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' }}
        >
          {showForm ? '✕ ยกเลิก' : '+ New Incident'}
        </button>
      </div>

      {/* Success Toast */}
      {submitted && (
        <div style={{ background: '#10b98122', border: '1px solid #10b98144', color: '#10b981', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600' }}>
          ✅ บันทึก Incident Report เรียบร้อยแล้ว
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, marginBottom: '20px', fontSize: '1rem', fontWeight: '700' }}>
            📝 รายงาน Incident ใหม่
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                หัวข้อ Incident *
              </label>
              <input
                placeholder="เช่น CPU spike บน Monomax-Stream-01"
                value={form.title}
                onChange={e => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                style={inputStyle('title')}
              />
              {errors.title && <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>{errors.title}</span>}
            </div>

            {/* Server */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                Server ที่เกิดปัญหา *
              </label>
              <select
                value={form.serverId}
                onChange={e => { setForm({ ...form, serverId: e.target.value }); setErrors({ ...errors, serverId: '' }); }}
                style={{ ...inputStyle('serverId'), cursor: 'pointer' }}
              >
                <option value="">-- เลือก Server --</option>
                {servers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.serverId && <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>{errors.serverId}</span>}
            </div>

            {/* Severity */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                Severity *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {SEVERITY.map(s => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, severity: s })}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '600', fontSize: '0.82rem', border: '1px solid',
                      borderColor: form.severity === s ? 'transparent' : theme.border,
                      background: form.severity === s
                        ? s === 'critical' ? '#ef444422' : s === 'warning' ? '#f59e0b22' : '#3b82f622'
                        : theme.inputBg,
                      color: form.severity === s
                        ? s === 'critical' ? '#ef4444' : s === 'warning' ? '#f59e0b' : '#3b82f6'
                        : theme.subtext,
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
                style={{ ...inputStyle('category'), cursor: 'pointer' }}
              >
                <option value="">-- เลือก Category --</option>
                {['Performance', 'Availability', 'Network', 'Security', 'Hardware', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>{errors.category}</span>}
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                รายละเอียดปัญหา *
              </label>
              <textarea
                rows={3}
                placeholder="อธิบายปัญหาที่พบ..."
                value={form.description}
                onChange={e => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
                style={{ ...inputStyle('description'), resize: 'vertical' }}
              />
              {errors.description && <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>{errors.description}</span>}
            </div>

            {/* Steps */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: '6px' }}>
                ขั้นตอนที่ทำไปแล้ว (optional)
              </label>
              <textarea
                rows={2}
                placeholder="เช่น restart service, ตรวจสอบ log..."
                value={form.steps}
                onChange={e => setForm({ ...form, steps: e.target.value })}
                style={{ ...inputStyle('steps'), resize: 'vertical' }}
              />
            </div>

          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{ marginTop: '20px', padding: '12px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem' }}
          >
            ✓ บันทึก Incident Report
          </button>
        </div>
      )}

      {/* Incident List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incidents.map(inc => (
          <div
            key={inc.id}
            style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', opacity: inc.status === 'resolved' ? 0.65 : 1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <AlertBadge type={inc.severity} />
                <h3 style={{ color: theme.text, fontSize: '0.98rem', fontWeight: '700' }}>{inc.title}</h3>
                {inc.status === 'resolved' && (
                  <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>✓ Resolved</span>
                )}
              </div>
              {inc.status === 'open' && (
                <button
                  onClick={() => resolveIncident(inc.id)}
                  style={{ padding: '6px 14px', background: '#10b98122', color: '#10b981', border: '1px solid #10b98133', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' }}
                >
                  ✓ Mark Resolved
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {[
                { label: 'Server',    value: getServerName(inc.serverId) },
                { label: 'Category',  value: inc.category },
                { label: 'Reporter',  value: inc.reporter },
              ].map(item => (
                <div key={item.label} style={{ background: theme.inputBg, borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: theme.subtext, marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: theme.text }}>{item.value}</div>
                </div>
              ))}
            </div>

            <p style={{ color: theme.subtext, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '6px' }}>
              {inc.description}
            </p>
            {inc.steps && (
              <p style={{ color: theme.subtext, fontSize: '0.82rem', fontStyle: 'italic' }}>
                🔧 {inc.steps}
              </p>
            )}
            <div style={{ color: theme.subtext, fontSize: '0.75rem', marginTop: '10px', textAlign: 'right', fontFamily: 'monospace' }}>
              {inc.createdAt}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}