import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .layout { display: flex; min-height: 100vh; background: #f0f4f8; font-family: 'DM Sans', sans-serif; }
  .sidebar { width: 260px; background: #0a1628; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
  .sidebar-brand { padding: 28px 24px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
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
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .page-title { font-family: 'Instrument Serif', serif; font-size: 26px; color: #0a1628; font-weight: 400; }
  .page-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; }
  .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #2563eb; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-primary:hover { background: #1d4ed8; }

  .doctors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .doctor-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.2s; position: relative; }
  .doctor-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .doctor-avatar { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #2563eb; margin-bottom: 14px; }
  .doctor-name { font-size: 15px; font-weight: 600; color: #0a1628; margin-bottom: 4px; }
  .doctor-specialty { font-size: 12px; color: #64748b; margin-bottom: 12px; }
  .doctor-status { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 500; margin-bottom: 14px; }
  .status-available { background: #f0fdf4; color: #16a34a; }
  .status-busy { background: #fef2f2; color: #dc2626; }
  .status-leave { background: #fffbeb; color: #d97706; }
  .doctor-info { width: 100%; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; justify-content: space-around; }
  .doctor-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .doctor-stat-value { font-size: 16px; font-weight: 600; color: #0a1628; }
  .doctor-stat-label { font-size: 11px; color: #94a3b8; }
  .delete-btn { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 7px; border: none; background: #fef2f2; color: #dc2626; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s; }
  .doctor-card:hover .delete-btn { opacity: 1; }
  .delete-btn:hover { background: #dc2626; color: white; }
  .empty-state { grid-column: 1 / -1; padding: 80px 20px; text-align: center; color: #94a3b8; background: white; border-radius: 14px; border: 1px solid #e8edf2; }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-title { font-size: 16px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .empty-sub { font-size: 13px; margin-bottom: 20px; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctors", icon: "🩺", label: "Doctors", active: true },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

const bgColors = ["#eff6ff", "#f0fdf4", "#fdf4ff", "#fffbeb", "#fef2f2", "#f0f9ff"];
const getColor = (name) => bgColors[(name?.charCodeAt(0) || 0) % bgColors.length];
const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "DR";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchDoctors = () => {
    fetch(`${API_URL}/api/doctors`)
      .then(r => r.json()).then(setDoctors).catch(() => {});
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this doctor from the system?")) return;
    await fetch(`${API_URL}/api/doctors/${id}`, { method: "DELETE" });
    fetchDoctors();
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <img src="/Baysideclinic.png" alt="logo" style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", marginBottom: "12px" }} />
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
              <h1>Doctors</h1>
              <p>Clinical staff and specialist directory</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="page-header">
              <div>
                <div className="page-title">Medical Staff</div>
                <div className="page-subtitle">{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered</div>
              </div>
              <Link to="/doctors/add" className="btn-primary">➕ Add Doctor</Link>
            </div>

            <div className="doctors-grid">
              {doctors.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🩺</div>
                  <div className="empty-title">No doctors added yet</div>
                  <div className="empty-sub">Add your first doctor to get started</div>
                  <Link to="/doctors/add" className="btn-primary">➕ Add Doctor</Link>
                </div>
              ) : doctors.map(doc => (
                <div className="doctor-card" key={doc.id}>
                  <button className="delete-btn" onClick={() => handleDelete(doc.id)}>🗑️</button>
                  <div className="doctor-avatar" style={{ background: getColor(doc.name) }}>
                    {getInitials(doc.name)}
                  </div>
                  <div className="doctor-name">{doc.name}</div>
                  <div className="doctor-specialty">{doc.specialty || "General"}</div>
                  <span className={`doctor-status ${doc.status === "Available" ? "status-available" : doc.status === "Busy" ? "status-busy" : "status-leave"}`}>
                    {doc.status === "Available" ? "🟢" : doc.status === "Busy" ? "🔴" : "🟡"} {doc.status}
                  </span>
                  <div className="doctor-info">
                    <div className="doctor-stat">
                      <div className="doctor-stat-value">{doc.experience_years ?? "—"}</div>
                      <div className="doctor-stat-label">Yrs Exp.</div>
                    </div>
                    <div className="doctor-stat">
                      <div className="doctor-stat-value">{doc.phone ? "✅" : "—"}</div>
                      <div className="doctor-stat-label">Phone</div>
                    </div>
                    <div className="doctor-stat">
                      <div className="doctor-stat-value">{doc.email ? "✅" : "—"}</div>
                      <div className="doctor-stat-label">Email</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctors;