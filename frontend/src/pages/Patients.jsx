import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  .search-bar { background: white; border: 1px solid #e8edf2; border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .search-bar input { border: none; outline: none; font-size: 14px; color: #0a1628; width: 100%; font-family: 'DM Sans', sans-serif; background: transparent; }
  .search-bar span { color: #94a3b8; font-size: 16px; }

  .table-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; }
  .table-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .table-header h3 { font-size: 14px; font-weight: 600; color: #0a1628; }
  .table-count { font-size: 12px; color: #94a3b8; background: #f0f4f8; padding: 3px 10px; border-radius: 20px; }

  table { width: 100%; border-collapse: collapse; }
  thead { background: #f8fafc; }
  th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 14px 20px; font-size: 14px; color: #334155; border-top: 1px solid #f1f5f9; }
  tr:hover td { background: #f8fafc; }

  .patient-name-cell { display: flex; align-items: center; gap: 10px; }
  .patient-avatar { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #2563eb; flex-shrink: 0; }

  .gender-badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: 500; }
  .gender-male { background: #eff6ff; color: #2563eb; }
  .gender-female { background: #fdf4ff; color: #9333ea; }
  .gender-other { background: #f0fdf4; color: #16a34a; }

  .action-btns { display: flex; gap: 6px; }
  .btn-icon { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.15s; }
  .btn-delete { background: #fef2f2; color: #dc2626; }
  .btn-delete:hover { background: #dc2626; color: white; }

  .empty-state { padding: 60px 20px; text-align: center; color: #94a3b8; }
  .empty-state .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state p { font-size: 14px; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients", active: true },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctors", icon: "🩺", label: "Doctors" },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchPatients = () => {
    fetch(`${API_URL}/api/patients`)
      .then(r => r.json()).then(setPatients).catch(() => {});
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this patient?")) return;
    await fetch(`${API_URL}/api/patients/${id}`, { method: "DELETE" });
    fetchPatients();
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

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
              <h1>Patients</h1>
              <p>Manage and view all patient records</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="page-header">
              <div>
                <div className="page-title">Patient Records</div>
                <div className="page-subtitle">{patients.length} patients registered</div>
              </div>
              <Link to="/patients/add" className="btn-primary">➕ Add Patient</Link>
            </div>

            <div className="search-bar">
              <span>🔍</span>
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>All Patients</h3>
                <span className="table-count">{filtered.length} records</span>
              </div>
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <p>{search ? "No patients match your search" : "No patients added yet"}</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="patient-name-cell">
                            <div className="patient-avatar">{p.name?.[0]?.toUpperCase()}</div>
                            <div>
                              <div style={{ fontWeight: 500, color: "#0a1628" }}>{p.name}</div>
                              <div style={{ fontSize: "11px", color: "#94a3b8" }}>ID #{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.age || "—"}</td>
                        <td>
                          {p.gender ? (
                            <span className={`gender-badge ${p.gender.toLowerCase() === "male" ? "gender-male" : p.gender.toLowerCase() === "female" ? "gender-female" : "gender-other"}`}>
                              {p.gender}
                            </span>
                          ) : "—"}
                        </td>
                        <td>{p.phone || "—"}</td>
                        <td>{p.email || "—"}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon btn-delete" onClick={() => handleDelete(p.id)} title="Delete">🗑️</button>
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

export default Patients;