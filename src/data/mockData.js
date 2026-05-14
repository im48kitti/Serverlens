 // ข้อมูล server จำลองของ JAS Group
export const servers = [
  { id: 1, name: 'SL-BKK-01',     location: 'Bangkok DC',    type: 'Core Router',    ip: '10.0.1.1',  status: 'online' },
  { id: 2, name: 'SL-BKK-02',     location: 'Bangkok DC',    type: 'Edge Server',    ip: '10.0.1.2',  status: 'online' },
  { id: 3, name: 'SL-CM-01',      location: 'Chiang Mai DC', type: 'Core Router',    ip: '10.0.2.1',  status: 'online' },
  { id: 4, name: 'SL-Stream-01',  location: 'Bangkok DC',    type: 'Stream Server',  ip: '10.0.1.10', status: 'warning' },
  { id: 5, name: 'SL-Stream-02',  location: 'Bangkok DC',    type: 'Stream Server',  ip: '10.0.1.11', status: 'online' },
  { id: 6, name: 'SL-Cloud-01',   location: 'Nonthaburi DC', type: 'Cloud Instance', ip: '10.0.3.1',  status: 'online' },
  { id: 7, name: 'SL-Cloud-02',   location: 'Nonthaburi DC', type: 'Cloud Instance', ip: '10.0.3.2',  status: 'offline' },
  { id: 8, name: 'SL-SAT-01',     location: 'Satellite Hub', type: 'Satellite Node', ip: '10.0.4.1',  status: 'online' },
];

// สร้าง metric history 20 จุดย้อนหลัง
const generateHistory = (base, variance) =>
  Array.from({ length: 20 }, (_, i) => ({
    time: `${i + 1}m`,
    value: Math.min(100, Math.max(0, base + (Math.random() - 0.5) * variance)),
  }));

export const initialMetrics = {
  1: { cpu: 42, ram: 61, bandwidth: 3.2,  latency: 12, uptime: 99.98, history: { cpu: generateHistory(42, 20), ram: generateHistory(61, 15), bandwidth: generateHistory(3.2, 2) } },
  2: { cpu: 35, ram: 54, bandwidth: 2.8,  latency: 14, uptime: 99.95, history: { cpu: generateHistory(35, 20), ram: generateHistory(54, 15), bandwidth: generateHistory(2.8, 2) } },
  3: { cpu: 28, ram: 47, bandwidth: 1.9,  latency: 18, uptime: 99.99, history: { cpu: generateHistory(28, 15), ram: generateHistory(47, 10), bandwidth: generateHistory(1.9, 1) } },
  4: { cpu: 88, ram: 91, bandwidth: 8.7,  latency: 45, uptime: 98.21, history: { cpu: generateHistory(88, 10), ram: generateHistory(91, 8),  bandwidth: generateHistory(8.7, 3) } },
  5: { cpu: 54, ram: 72, bandwidth: 6.1,  latency: 22, uptime: 99.87, history: { cpu: generateHistory(54, 20), ram: generateHistory(72, 15), bandwidth: generateHistory(6.1, 3) } },
  6: { cpu: 31, ram: 45, bandwidth: 4.4,  latency: 9,  uptime: 100,   history: { cpu: generateHistory(31, 15), ram: generateHistory(45, 10), bandwidth: generateHistory(4.4, 2) } },
  7: { cpu: 0,  ram: 0,  bandwidth: 0,    latency: 0,  uptime: 95.10, history: { cpu: generateHistory(0, 0),   ram: generateHistory(0, 0),   bandwidth: generateHistory(0, 0) } },
  8: { cpu: 19, ram: 38, bandwidth: 1.2,  latency: 31, uptime: 99.72, history: { cpu: generateHistory(19, 10), ram: generateHistory(38, 10), bandwidth: generateHistory(1.2, 1) } },
};

export const initialAlerts = [
  { id: 1, serverId: 4, serverName: 'SL-Stream-01', type: 'critical', metric: 'CPU',       value: '88%',      threshold: '80%',  time: '10:42 AM', resolved: false },
  { id: 2, serverId: 4, serverName: 'SL-Stream-01', type: 'critical', metric: 'RAM',       value: '91%',      threshold: '85%',  time: '10:43 AM', resolved: false },
  { id: 3, serverId: 7, serverName: 'SL-Cloud-02',  type: 'critical', metric: 'Status',    value: 'Offline',  threshold: '-',    time: '09:15 AM', resolved: false },
  { id: 4, serverId: 4, serverName: 'SL-Stream-01', type: 'warning',  metric: 'Latency',   value: '45ms',     threshold: '30ms', time: '10:40 AM', resolved: false },
  { id: 5, serverId: 2, serverName: 'SL-BKK-02',    type: 'info',     metric: 'Bandwidth', value: '2.8 Gbps', threshold: '-',    time: '08:00 AM', resolved: true  },
];