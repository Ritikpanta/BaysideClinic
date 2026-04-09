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
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-family: 'Instrument Serif', serif; font-size: 26px; color: #0a1628; font-weight: 400; }
  .page-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; }
  .btn-primary { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-primary:hover { background: #1d4ed8; }

  .filter-bar { display: flex; gap: 8px; margin-bottom: 20px; }
  .filter-btn { padding: 8px 16px; border-radius: 20px; border: 1px solid #e8edf2; background: white; font-size: 13px; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .filter-btn:hover { border-color: #2563eb; color: #2563eb; }
  .filter-btn.active { background: #2563eb; color: white; border-color: #2563eb; }

  .table-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; }
  .table-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .table-header h3 { font-size: 14px; font-weight: 600; color: #0a1628; }
  .table-count { font-size: 12px; color: #94a3b8; background: #f0f4f8; padding: 3px 10px; border-radius: 20px; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #f8fafc; }
  th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 14px 20px; font-size: 14px; color: #334155; border-top: 1px solid #f1f5f9; }
  tr:hover td { background: #f8fafc; }

  .badge { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 500; }
  .badge-green { background: #f0fdf4; color: #16a34a; }
  .badge-amber { background: #fffbeb; color: #d97706; }
  .badge-red { background: #fef2f2; color: #dc2626; }

  .action-btns { display: flex; gap: 6px; }
  .btn-icon { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.15s; }
  .btn-delete { background: #fef2f2; color: #dc2626; }
  .btn-delete:hover { background: #dc2626; color: white; }

  .empty-state { padding: 60px 20px; text-align: center; color: #94a3b8; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments", active: true },
  { to: "/doctors", icon: "🩺", label: "Doctors" },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchAppointments = () => {
    fetch(`${API_URL}/api/appointments`)
      .then(r => r.json()).then(setAppointments).catch(() => {});
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`${API_URL}/api/appointments/${id}`, { method: "DELETE" });
    fetchAppointments();
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const filtered = filter === "All" ? appointments : appointments.filter(a => a.status === filter);

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
           <img src="/baysideclinic.png" alt="Bayside Clinical" style={{ width: "72px", height: "72px", borderRadius: "10px", objectFit: "cover" }} />
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
              <h1>Appointments</h1>
              <p>Schedule and manage clinic appointments</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="page-header">
              <div>
                <div className="page-title">All Appointments</div>
                <div className="page-subtitle">{appointments.length} total appointments</div>
              </div>
              <Link to="/appointments/add" className="btn-primary">➕ New Appointment</Link>
            </div>

            <div className="filter-bar">
              {["All", "Booked", "Completed", "Cancelled"].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>{filter === "All" ? "All Appointments" : filter}</h3>
                <span className="table-count">{filtered.length} records</span>
              </div>
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <p>No appointments found</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id}>
                        <td style={{ color: "#94a3b8", fontSize: "12px" }}>#{a.id}</td>
                        <td style={{ fontWeight: 500, color: "#0a1628" }}>{a.patient_name}</td>
                        <td>{new Date(a.appointment_date).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</td>
                        <td>
                          <span className={`badge ${a.status === "Completed" ? "badge-green" : a.status === "Booked" ? "badge-amber" : "badge-red"}`}>
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon btn-delete" onClick={() => handleDelete(a.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointments;