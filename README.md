# 🔍 ServerLens

> Network Infrastructure Monitoring Dashboard

A real-time network monitoring dashboard for managing servers across multiple data centers — with live metrics, alerts, incident management, and uptime tracking.

## 🔑 Demo Accounts
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| operator | op123 | Operator |
| viewer | view123 | Viewer |

## ✨ Features
- 📊 **Dashboard** — Real-time server status, metric cards, recent alerts
- 🖥️ **Servers** — Monitor 8 servers, search, export CSV
- 🔍 **Server Detail** — CPU/RAM chart, incident history per server
- 📡 **Bandwidth** — Compare bandwidth across all servers
- 📝 **Incidents** — Create, track, and resolve incident reports
- 📈 **Uptime** — 30-day uptime heatmap per server
- 🔔 **Alerts** — Filter and resolve network alerts
- 🔐 **Auth** — Role-based mock authentication (Admin / Operator / Viewer)
- 🌙 **Dark / Light Mode** — Toggle anytime
- 📥 **Export CSV** — Download server metrics

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Styling | CSS-in-JS |
| Mock Data | Custom WebSocket Simulator |

## 🚀 Run Locally
```bash
git clone https://github.com/YOUR_USERNAME/serverlens.git
cd serverlens
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## 👤 Author
**Kittisak Juprasert**  
Computer Science · Pibulsongkram Rajabhat University