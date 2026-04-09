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
  .back-link { display: inline-flex; align-items: center; gap: 6px; color: #64748b; font-size: 13px; text-decoration: none; margin-bottom: 20px; transition: color 0.15s; }
  .back-link:hover { color: #2563eb; }
  .form-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; max-width: 580px; }
  .form-card-header { padding: 24px 28px; border-bottom: 1px solid #f1f5f9; }
  .form-card-header h2 { font-family: 'Instrument Serif', serif; font-size: 22px; color: #0a1628; font-weight: 400; }
  .form-card-header p { font-size: 13px; color: #94a3b8; margin-top: 4px; }
  .form-body { padding: 28px; display: flex; flex-direction: column; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 13px; font-weight: 500; color: #374151; }
  .form-label span { color: #ef4444; margin-left: 2px; }
  .form-input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; background: #fafafa; }
  .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); background: white; }
  .form-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; cursor: pointer; }
  .form-select:focus { border-color: #2563eb; background: white; }
  .form-footer { padding: 20px 28px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; justify-content: flex-end; }
  .btn-primary { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-secondary { display: flex; align-items: center; gap: 8px; background: white; color: #64748b; padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; border: 1px solid #e2e8f0; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; transition: all 0.15s; }
  .btn-secondary:hover { border-color: #94a3b8; }
  .error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
  .success-msg { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
  .no-patients { background: #fffbeb; border: 1px solid #fde68a; color: #d97706; padding: 12px 14px; border-radius: 8px; font-size: 13px; }
  .no-patients a { color: #2563eb; text-decoration: none; font-weight: 500; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments", active: true },
  { to: "/doctors", icon: "🩺", label: "Doctors" },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

function AddAppointment() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ patient_id: "", appointment_date: "", status: "Booked" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API_URL}/api/patients`)
      .then(r => r.json()).then(setPatients).catch(() => {});
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Appointment scheduled successfully!");
        setTimeout(() => navigate("/appointments"), 1200);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to connect to server");
    }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

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
              <h1>New Appointment</h1>
              <p>Schedule a patient appointment</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <Link to="/appointments" className="back-link">← Back to Appointments</Link>

            <div className="form-card">
              <div className="form-card-header">
                <h2>Schedule Appointment</h2>
                <p>Select a patient and set the date and time</p>
              </div>

              <div className="form-body">
                {error && <div className="error-msg">⚠️ {error}</div>}
                {message && <div className="success-msg">✅ {message}</div>}

                {patients.length === 0 ? (
                  <div className="no-patients">
                    ⚠️ No patients registered yet. <Link to="/patients/add">Add a patient first →</Link>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Select Patient <span>*</span></label>
                      <select className="form-select" name="patient_id" value={formData.patient_id} onChange={handleChange}>
                        <option value="">Choose a patient...</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date & Time <span>*</span></label>
                      <input className="form-input" type="datetime-local" name="appointment_date" value={formData.appointment_date} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                        <option value="Booked">Booked</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="form-footer">
                <Link to="/appointments" className="btn-secondary">Cancel</Link>
                <button className="btn-primary" onClick={handleSubmit} disabled={patients.length === 0}>
                  📅 Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAppointment;