import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .layout {
    display: flex;
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 260px;
    background: #0a1628;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    z-index: 100;
  }

  .sidebar-brand {
    padding: 28px 24px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .sidebar-brand .brand-icon {
    width: 36px; height: 36px;
    background: #2563eb;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
    font-size: 18px;
  }

  .sidebar-brand h2 {
    color: white;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .sidebar-brand p {
    color: rgba(255,255,255,0.4);
    font-size: 11px;
    margin-top: 2px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .sidebar-nav {
    padding: 16px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-section-label {
    color: rgba(255,255,255,0.25);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 12px 12px 6px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.15s ease;
  }

  .nav-link:hover {
    background: rgba(255,255,255,0.07);
    color: white;
  }

  .nav-link.active {
    background: #2563eb;
    color: white;
    font-weight: 500;
  }

  .nav-link .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: rgba(255,255,255,0.4);
    font-size: 14px;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .logout-btn:hover {
    background: rgba(239,68,68,0.15);
    color: #f87171;
  }

  /* ── Main ── */
  .main {
    margin-left: 260px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: white;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8edf2;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-left h1 {
    font-family: Poppins
    , serif;
    font-size: 22px;
    color: #0a1628;
    font-weight: 400;
  }

  .topbar-left p {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 1px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0f4f8;
    padding: 8px 14px;
    border-radius: 50px;
  }

  .user-avatar {
    width: 28px; height: 28px;
    background: #2563eb;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .user-badge span {
    font-size: 13px;
    font-weight: 500;
    color: #0a1628;
  }

  /* ── Content ── */
  .content {
    padding: 32px;
    flex: 1;
  }

  /* ── Stat Cards ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: white;
    border-radius: 14px;
    padding: 22px;
    border: 1px solid #e8edf2;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  .stat-card .stat-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    margin-bottom: 14px;
  }

  .stat-card .stat-value {
    font-size: 28px;
    font-weight: 600;
    color: #0a1628;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-card .stat-label {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 400;
  }

  .stat-card .stat-change {
    font-size: 11px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .stat-card.blue .stat-icon { background: #eff6ff; }
  .stat-card.green .stat-icon { background: #f0fdf4; }
  .stat-card.amber .stat-icon { background: #fffbeb; }
  .stat-card.purple .stat-icon { background: #faf5ff; }

  /* ── Quick Actions ── */
  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #0a1628;
    margin-bottom: 14px;
    letter-spacing: -0.2px;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .action-card {
    background: white;
    border-radius: 14px;
    padding: 20px;
    border: 1px solid #e8edf2;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .action-card:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
    transform: translateY(-1px);
  }

  .action-card .action-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }

  .action-card .action-title {
    font-size: 14px;
    font-weight: 500;
    color: #0a1628;
  }

  .action-card .action-desc {
    font-size: 12px;
    color: #94a3b8;
  }

  /* ── Bottom Grid ── */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .panel {
    background: white;
    border-radius: 14px;
    border: 1px solid #e8edf2;
    overflow: hidden;
  }

  .panel-header {
    padding: 18px 20px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: #0a1628;
  }

  .panel-header a {
    font-size: 12px;
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  .panel-body { padding: 8px 0; }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    transition: background 0.15s;
  }

  .list-item:hover { background: #f8fafc; }

  .list-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #eff6ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #2563eb;
    flex-shrink: 0;
  }

  .list-info { flex: 1; }
  .list-name { font-size: 13px; font-weight: 500; color: #0a1628; }
  .list-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }

  .badge {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 20px;
    font-weight: 500;
  }
  .badge-green { background: #f0fdf4; color: #16a34a; }
  .badge-amber { background: #fffbeb; color: #d97706; }
  .badge-red { background: #fef2f2; color: #dc2626; }

  .empty-state {
    padding: 32px 20px;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
  }
`;

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/patients`)
      .then(r => r.json()).then(setPatients).catch(() => {});
    fetch(`${API_URL}/api/appointments`)
      .then(r => r.json()).then(setAppointments).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const todayAppts = appointments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.appointment_date).toDateString() === today;
  });

  const bookedCount = appointments.filter(a => a.status === "Booked").length;

  const navLinks = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard", active: true },
    { to: "/patients", icon: "👥", label: "Patients" },
    { to: "/appointments", icon: "📅", label: "Appointments" },
    { to: "/doctors", icon: "🩺", label: "Doctors" },
    { to: "/reports", icon: "📊", label: "Reports" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
                       <img src="/baysideclinic.png" alt="Bayside Clinical" style={{ width: "72px", height: "72px", borderRadius: "10px", objectFit: "cover" }} />

            <h2>Bayside Clinical</h2>
            <p>Management System</p>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${link.active ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>Good morning, {user?.username || "Doctor"}</h1>
              <p>{new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div className="topbar-right">
              <div className="user-badge">
                <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
                <span>{user?.username}</span>
              </div>
            </div>
          </header>

          <div className="content">

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{patients.length}</div>
                <div className="stat-label">Total Patients</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{appointments.length}</div>
                <div className="stat-label">Total Appointments</div>
              </div>
              <div className="stat-card amber">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">{todayAppts.length}</div>
                <div className="stat-label">Today's Appointments</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{bookedCount}</div>
                <div className="stat-label">Active Bookings</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-title">Quick Actions</div>
            <div className="actions-grid">
              <Link to="/patients/add" className="action-card">
                <div className="action-icon">➕</div>
                <div className="action-title">Add Patient</div>
                <div className="action-desc">Register a new patient</div>
              </Link>
              <Link to="/appointments/add" className="action-card">
                <div className="action-icon">📋</div>
                <div className="action-title">New Appointment</div>
                <div className="action-desc">Schedule an appointment</div>
              </Link>
              <Link to="/patients" className="action-card">
                <div className="action-icon">🔍</div>
                <div className="action-title">View Patients</div>
                <div className="action-desc">Browse all records</div>
              </Link>
              <Link to="/reports" className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-title">Reports</div>
                <div className="action-desc">View clinic analytics</div>
              </Link>
            </div>

            {/* Bottom panels */}
            <div className="bottom-grid">

              {/* Recent Patients */}
              <div className="panel">
                <div className="panel-header">
                  <h3>Recent Patients</h3>
                  <Link to="/patients">View all →</Link>
                </div>
                <div className="panel-body">
                  {patients.length === 0 ? (
                    <div className="empty-state">No patients yet</div>
                  ) : patients.slice(0, 5).map(p => (
                    <div className="list-item" key={p.id}>
                      <div className="list-avatar">{p.name?.[0]?.toUpperCase()}</div>
                      <div className="list-info">
                        <div className="list-name">{p.name}</div>
                        <div className="list-sub">{p.email || "No email"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="panel">
                <div className="panel-header">
                  <h3>Upcoming Appointments</h3>
                  <Link to="/appointments">View all →</Link>
                </div>
                <div className="panel-body">
                  {appointments.length === 0 ? (
                    <div className="empty-state">No appointments yet</div>
                  ) : appointments.slice(0, 5).map(a => (
                    <div className="list-item" key={a.id}>
                      <div className="list-avatar">📅</div>
                      <div className="list-info">
                        <div className="list-name">{a.patient_name}</div>
                        <div className="list-sub">{new Date(a.appointment_date).toLocaleString()}</div>
                      </div>
                      <span className={`badge ${a.status === "Booked" ? "badge-amber" : a.status === "Completed" ? "badge-green" : "badge-red"}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;