import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initialMetrics, initialAlerts } from './data/mockData';
import { createMockWebSocket } from './data/mockWebSocket';
import { ThemeProvider }    from './context/ThemeContext';
import { AuthProvider }     from './context/AuthContext';
import ProtectedRoute       from './components/ProtectedRoute';
import Topbar               from './components/Topbar';
import Sidebar              from './components/Sidebar';
import LoginPage            from './pages/LoginPage';
import DashboardPage        from './pages/DashboardPage';
import ServersPage          from './pages/ServersPage';
import AlertsPage           from './pages/AlertsPage';
import ServerDetailPage     from './pages/ServerDetailPage';
import { useAuth }          from './context/AuthContext';
import BandwidthPage from './pages/BandwidthPage';
import IncidentPage from './pages/IncidentPage';
import UptimePage from './pages/UptimePage';

function Layout({ children, alertCount, search, setSearch }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar alertCount={alertCount} search={search} setSearch={setSearch} />
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user }              = useAuth();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [alerts,  setAlerts]  = useState(initialAlerts);
  const [search,  setSearch]  = useState('');
  const activeAlertCount      = alerts.filter(a => !a.resolved).length;

  useEffect(() => {
    if (!user) return;
    const stop = createMockWebSocket((newMetric) => {
      setMetrics(prev => {
        const old = prev[newMetric.serverId];
        return {
          ...prev,
          [newMetric.serverId]: {
            ...old,
            cpu: newMetric.cpu, ram: newMetric.ram,
            bandwidth: newMetric.bandwidth, latency: newMetric.latency,
            history: {
              cpu:       [...old.history.cpu.slice(1),       { time: 'now', value: newMetric.cpu }],
              ram:       [...old.history.ram.slice(1),       { time: 'now', value: newMetric.ram }],
              bandwidth: [...old.history.bandwidth.slice(1), { time: 'now', value: newMetric.bandwidth }],
            },
          },
        };
      });
    });
    return stop;
  }, [user]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

      {/* Protected */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
            <DashboardPage metrics={metrics} alerts={alerts} />
          </Layout>
        </ProtectedRoute>
      } />
<Route path="/uptime" element={
  <ProtectedRoute>
    <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
      <UptimePage />
    </Layout>
  </ProtectedRoute>
} />
      <Route path="/servers" element={
        <ProtectedRoute>
          <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
            <ServersPage metrics={metrics} search={search} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/server/:id" element={
        <ProtectedRoute>
          <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
            <ServerDetailPage metrics={metrics} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/alerts" element={
        <ProtectedRoute>
          <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
            <AlertsPage alerts={alerts} setAlerts={setAlerts} />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/bandwidth" element={
      <ProtectedRoute>
      <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
      <BandwidthPage metrics={metrics} />
      </Layout>
      </ProtectedRoute>
      } />

      <Route path="/incidents" element={
  <ProtectedRoute>
    <Layout alertCount={activeAlertCount} search={search} setSearch={setSearch}>
      <IncidentPage />
    </Layout>
  </ProtectedRoute>
} />
    </Routes>

    
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}