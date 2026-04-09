import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .layout { display: flex; min-height: 100vh; background: #f0f4f8; font-family: 'DM Sans', sans-serif; }
  .sidebar { width: 260px; background: #0a1628; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
  .sidebar-brand { padding: 28px 24px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .brand-icon { width: 36px; height: 36px; background: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 18px; }
  .sidebar-brand h2 { color: white; font-size: 16px; font-weight: 600; }
  .sidebar-brand p { color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 2px; letter-spacing: 0.5px; text-transform: uppercase; }
  .sidebar-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .nav-section-label { color: rgba(255,255,255,0.25); font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 12px 12px 6px; }
  .nav-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.55); text-decoration: none; font-size: 14px; transition: all 0.15s; }
  .nav-link:hover { background: rgba(255,255,255,0.07); color: white; }
  .nav-link.active { background: #2563eb; color: white; font-weight: 500; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.07); }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.4); font-size: 14px; cursor: pointer; border: none; background: none; width: 100%; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }
  .main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }
  .topbar { background: white; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8edf2; position: sticky; top: 0; z-index: 50; }
  .topbar-left h1 { font-family: 'Instrument Serif', serif; font-size: 22px; color: #0a1628; font-weight: 400; }
  .topbar-left p { font-size: 13px; color: #94a3b8; margin-top: 1px; }
  .user-badge { display: flex; align-items: center; gap: 10px; background: #f0f4f8; padding: 8px 14px; border-radius: 50px; }
  .user-avatar { width: 28px; height: 28px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600; }
  .user-badge span { font-size: 13px; font-weight: 500; color: #0a1628; }
  .content { padding: 32px; flex: 1; }
  .page-title { font-family: 'Instrument Serif', serif; font-size: 26px; color: #0a1628; font-weight: 400; margin-bottom: 4px; }
  .page-subtitle { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: white; border-radius: 14px; padding: 22px; border: 1px solid #e8edf2; }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px; }
  .stat-value { font-size: 28px; font-weight: 600; color: #0a1628; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 13px; color: #94a3b8; }
  .blue .stat-icon { background: #eff6ff; }
  .green .stat-icon { background: #f0fdf4; }
  .amber .stat-icon { background: #fffbeb; }
  .red .stat-icon { background: #fef2f2; }

  .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .panel { background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; }
  .panel-header { padding: 18px 20px; border-bottom: 1px solid #f1f5f9; }
  .panel-header h3 { font-size: 14px; font-weight: 600; color: #0a1628; }
  .panel-header p { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .panel-body { padding: 20px; }

  .status-breakdown { display: flex; flex-direction: column; gap: 14px; }
  .status-row { display: flex; align-items: center; gap: 12px; }
  .status-label { font-size: 13px; color: #374151; width: 90px; flex-shrink: 0; }
  .status-bar-bg { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .status-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .bar-amber { background: #f59e0b; }
  .bar-green { background: #22c55e; }
  .bar-red { background: #ef4444; }
  .status-count { font-size: 13px; font-weight: 600; color: #0a1628; width: 30px; text-align: right; }

  .gender-breakdown { display: flex; justify-content: space-around; padding: 10px 0; }
  .gender-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .gender-circle { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .gender-value { font-size: 20px; font-weight: 600; color: #0a1628; }
  .gender-name { font-size: 12px; color: #94a3b8; }

  .summary-list { display: flex; flex-direction: column; gap: 12px; }
  .summary-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f8fafc; border-radius: 8px; }
  .summary-item-label { font-size: 13px; color: #374151; display: flex; align-items: center; gap: 8px; }
  .summary-item-value { font-size: 14px; font-weight: 600; color: #0a1628; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctors", icon: "🩺", label: "Doctors" },
  { to: "/reports", icon: "📊", label: "Reports", active: true },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

function Reports() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/patients`).then(r => r.json()).then(setPatients).catch(() => {});
    fetch(`${API_URL}/api/appointments`).then(r => r.json()).then(setAppointments).catch(() => {});
  }, []);

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const booked = appointments.filter(a => a.status === "Booked").length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;
  const total = appointments.length || 1;

  const male = patients.filter(p => p.gender?.toLowerCase() === "male").length;
  const female = patients.filter(p => p.gender?.toLowerCase() === "female").length;
  const other = patients.filter(p => p.gender && !["male","female"].includes(p.gender.toLowerCase())).length;

  const today = new Date().toDateString();
  const todayAppts = appointments.filter(a => new Date(a.appointment_date).toDateString() === today).length;

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">🏥</div>
            <h2>Bayside Clinical</h2>
            <p>Management System</p>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link ${link.active ? "active" : ""}`}>
                <span className="nav-icon">{link.icon}</span>{link.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}><span>🚪</span> Sign Out</button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>Reports</h1>
              <p>Clinic analytics and insights</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="page-title">Clinic Overview</div>
            <div className="page-subtitle">Live data from your database</div>

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{patients.length}</div>
                <div className="stat-label">Total Patients</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card amber">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">{todayAppts}</div>
                <div className="stat-label">Today's Appointments</div>
              </div>
              <div className="stat-card red">
                <div className="stat-icon">❌</div>
                <div className="stat-value">{cancelled}</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>

            <div className="reports-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3>Appointment Status Breakdown</h3>
                  <p>Distribution of all appointments</p>
                </div>
                <div className="panel-body">
                  <div className="status-breakdown">
                    <div className="status-row">
                      <span className="status-label">🟡 Booked</span>
                      <div className="status-bar-bg"><div className="status-bar bar-amber" style={{ width: `${(booked/total)*100}%` }} /></div>
                      <span className="status-count">{booked}</span>
                    </div>
                    <div className="status-row">
                      <span className="status-label">🟢 Completed</span>
                      <div className="status-bar-bg"><div className="status-bar bar-green" style={{ width: `${(completed/total)*100}%` }} /></div>
                      <span className="status-count">{completed}</span>
                    </div>
                    <div className="status-row">
                      <span className="status-label">🔴 Cancelled</span>
                      <div className="status-bar-bg"><div className="status-bar bar-red" style={{ width: `${(cancelled/total)*100}%` }} /></div>
                      <span className="status-count">{cancelled}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Patient Demographics</h3>
                  <p>Gender breakdown of registered patients</p>
                </div>
                <div className="panel-body">
                  <div className="gender-breakdown">
                    <div className="gender-item">
                      <div className="gender-circle" style={{ background: "#eff6ff" }}>👨</div>
                      <div className="gender-value">{male}</div>
                      <div className="gender-name">Male</div>
                    </div>
                    <div className="gender-item">
                      <div className="gender-circle" style={{ background: "#fdf4ff" }}>👩</div>
                      <div className="gender-value">{female}</div>
                      <div className="gender-name">Female</div>
                    </div>
                    <div className="gender-item">
                      <div className="gender-circle" style={{ background: "#f0fdf4" }}>🧑</div>
                      <div className="gender-value">{other}</div>
                      <div className="gender-name">Other</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel" style={{ gridColumn: "1 / -1" }}>
                <div className="panel-header">
                  <h3>Quick Summary</h3>
                  <p>Key clinic metrics at a glance</p>
                </div>
                <div className="panel-body">
                  <div className="summary-list">
                    {[
                      { icon: "👥", label: "Total registered patients", value: patients.length },
                      { icon: "📅", label: "Total appointments scheduled", value: appointments.length },
                      { icon: "📋", label: "Active bookings", value: booked },
                      { icon: "✅", label: "Completion rate", value: appointments.length ? `${Math.round((completed/appointments.length)*100)}%` : "0%" },
                      { icon: "📆", label: "Today's appointments", value: todayAppts },
                    ].map((item, i) => (
                      <div className="summary-item" key={i}>
                        <span className="summary-item-label">{item.icon} {item.label}</span>
                        <span className="summary-item-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;