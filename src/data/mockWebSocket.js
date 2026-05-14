 // จำลอง WebSocket — อัปเดต metric ทุก 2 วินาที
export const createMockWebSocket = (onData) => {
  const interval = setInterval(() => {
    // สุ่ม server id ที่จะอัปเดต
    const serverId = Math.ceil(Math.random() * 8);

    // server offline ไม่อัปเดต
    if (serverId === 7) return;

    // base values ตาม server
    const bases = {
      1: { cpu: 42, ram: 61, bw: 3.2 },
      2: { cpu: 35, ram: 54, bw: 2.8 },
      3: { cpu: 28, ram: 47, bw: 1.9 },
      4: { cpu: 88, ram: 91, bw: 8.7 },
      5: { cpu: 54, ram: 72, bw: 6.1 },
      6: { cpu: 31, ram: 45, bw: 4.4 },
      8: { cpu: 19, ram: 38, bw: 1.2 },
    };

    const b = bases[serverId];
    const newMetric = {
      serverId,
      cpu:       Math.min(100, Math.max(0, b.cpu + (Math.random() - 0.5) * 20)),
      ram:       Math.min(100, Math.max(0, b.ram + (Math.random() - 0.5) * 15)),
      bandwidth: Math.max(0, b.bw + (Math.random() - 0.5) * 2),
      latency:   Math.max(1, Math.round(Math.random() * 50 + 5)),
    };

    onData(newMetric);
  }, 2000);

  return () => clearInterval(interval);
};