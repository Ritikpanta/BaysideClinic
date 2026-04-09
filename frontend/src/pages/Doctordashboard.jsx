import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .layout { display: flex; min-height: 100vh; background: #f0f4f8; font-family: 'DM Sans', sans-serif; }
  .sidebar { width: 240px; background: #0a1628; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
  .sidebar-brand { padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .sidebar-brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; margin-bottom: 10px; }
  .sidebar-brand h2 { color: white; font-size: 14px; font-weight: 600; }
  .sidebar-brand p { color: rgba(255,255,255,0.4); font-size: 10px; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .portal-tag { display: inline-block; background: rgba(16,185,129,0.2); color: #6ee7b7; font-size: 10px; padding: 3px 8px; border-radius: 10px; margin-top: 8px; font-weight: 500; }
  .sidebar-nav { padding: 16px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .nav-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.55); font-size: 13px; background: none; border: none; cursor: pointer; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .nav-btn:hover { background: rgba(255,255,255,0.07); color: white; }
  .nav-btn.active { background: #059669; color: white; font-weight: 500; }
  .sidebar-footer { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,0.07); }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.4); font-size: 13px; cursor: pointer; border: none; background: none; width: 100%; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }
  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
  .topbar { background: white; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8edf2; position: sticky; top: 0; z-index: 50; }
  .topbar h1 { font-family: 'Instrument Serif', serif; font-size: 20px; color: #0a1628; font-weight: 400; }
  .topbar p { font-size: 12px; color: #94a3b8; margin-top: 1px; }
  .user-badge { display: flex; align-items: center; gap: 10px; background: #f0fdf4; padding: 7px 14px; border-radius: 50px; }
  .user-avatar { width: 26px; height: 26px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 600; }
  .user-badge span { font-size: 13px; font-weight: 500; color: #0a1628; }
  .content { padding: 28px; flex: 1; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e8edf2; }
  .stat-icon { font-size: 22px; margin-bottom: 10px; }
  .stat-value { font-size: 26px; font-weight: 600; color: #0a1628; }
  .stat-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }

  .availability-bar { background: white; border-radius: 12px; border: 1px solid #e8edf2; padding: 18px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
  .avail-info h3 { font-size: 14px; font-weight: 600; color: #0a1628; margin-bottom: 3px; }
  .avail-info p { font-size: 12px; color: #94a3b8; }
  .avail-btns { display: flex; gap: 8px; }
  .avail-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1px solid transparent; transition: all 0.15s; }
  .avail-btn.active-available { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
  .avail-btn.active-busy { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .avail-btn.active-leave { background: #fffbeb; color: #d97706; border-color: #fde68a; }
  .avail-btn.inactive { background: #f8fafc; color: #94a3b8; }
  .avail-btn:hover { opacity: 0.8; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 15px; font-weight: 600; color: #0a1628; }
  .filter-bar { display: flex; gap: 8px; }
  .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #e8edf2; background: white; font-size: 12px; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .filter-btn.active { background: #059669; color: white; border-color: #059669; }

  .appt-list { display: flex; flex-direction: column; gap: 10px; }
  .appt-card { background: white; border-radius: 12px; border: 1px solid #e8edf2; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
  .appt-left { display: flex; align-items: center; gap: 14px; }
  .patient-avatar { width: 40px; height: 40px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #2563eb; flex-shrink: 0; }
  .patient-name { font-size: 14px; font-weight: 500; color: #0a1628; }
  .patient-meta { font-size: 12px; color: #94a3b8; margin-top: 1px; }
  .appt-date { font-size: 12px; color: #64748b; margin-top: 3px; }
  .appt-right { display: flex; align-items: center; gap: 8px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: 500; }
  .badge-amber { background: #fffbeb; color: #d97706; }
  .badge-green { background: #f0fdf4; color: #16a34a; }
  .badge-red { background: #fef2f2; color: #dc2626; }
  .action-btns { display: flex; gap: 6px; }
  .btn-approve { padding: 6px 12px; background: #f0fdf4; color: #16a34a; border: none; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; }
  .btn-approve:hover { background: #16a34a; color: white; }
  .btn-reject { padding: 6px 12px; background: #fef2f2; color: #dc2626; border: none; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; }
  .btn-reject:hover { background: #dc2626; color: white; }
  .btn-complete { padding: 6px 12px; background: #eff6ff; color: #2563eb; border: none; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; }
  .btn-complete:hover { background: #2563eb; color: white; }

  .patients-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .patient-card { background: white; border-radius: 12px; border: 1px solid #e8edf2; padding: 20px; }
  .patient-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .pc-avatar { width: 44px; height: 44px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #2563eb; flex-shrink: 0; }
  .pc-name { font-size: 14px; font-weight: 600; color: #0a1628; }
  .pc-meta { font-size: 12px; color: #94a3b8; }
  .pc-details { display: flex; flex-direction: column; gap: 6px; }
  .pc-row { display: flex; justify-content: space-between; font-size: 12px; }
  .pc-label { color: #94a3b8; }
  .pc-value { color: #374151; font-weight: 500; }

  .profile-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; padding: 28px; max-width: 500px; }
  .profile-card h2 { font-family: 'Instrument Serif', serif; font-size: 22px; font-weight: 400; color: #0a1628; margin-bottom: 20px; }
  .profile-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .profile-label { font-size: 13px; color: #94a3b8; }
  .profile-value { font-size: 13px; font-weight: 500; color: #0a1628; }

  .empty-state { padding: 40px; text-align: center; color: #94a3b8; background: white; border-radius: 12px; border: 1px solid #e8edf2; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: #0a1628; color: white; padding: 12px 20px; border-radius: 10px; font-size: 13px; z-index: 300; }
`;

const getInitials = name => name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "PT";

function DoctorDashboard() {
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentStatus, setCurrentStatus] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  useEffect(() => {
    if (!doctor) { navigate("/doctor-login"); return; }
    setCurrentStatus(doctor.status || "Available");
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    fetch(`${API_URL}/api/doctor/appointments/${doctor?.doctor_id}`)
      .then(r => r.json()).then(setAppointments).catch(() => {});
  };

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = async (apptId, status) => {
    const res = await fetch(`${API_URL}/api/doctor/appointments/${apptId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { fetchAppointments(); showToast(`Appointment marked as ${status}`); }
  };

  const toggleAvailability = async (status) => {
    const res = await fetch(`${API_URL}/api/doctor/availability/${doctor?.doctor_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setCurrentStatus(status);
      const updated = { ...doctor, status };
      localStorage.setItem("doctor", JSON.stringify(updated));
      showToast(`Status set to ${status}`);
    }
  };

  const handleLogout = () => { localStorage.removeItem("doctor"); navigate("/doctor-login"); };

  const filtered = filter === "All" ? appointments : appointments.filter(a => a.status === filter);
  const booked = appointments.filter(a => a.status === "Booked").length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const uniquePatients = [...new Map(appointments.map(a => [a.patient_name, a])).values()];

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <img src="/Baysideclinic.png" alt="logo" />
            <h2>Bayside Clinical</h2>
            <p>Management System</p>
            <span className="portal-tag">Doctor Portal</span>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-btn ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>📅 My Appointments</button>
            <button className={`nav-btn ${tab === "patients" ? "active" : ""}`} onClick={() => setTab("patients")}>👥 My Patients</button>
            <button className={`nav-btn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>👤 My Profile</button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}><span>🚪</span> Sign Out</button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div>
              <h1>Dr. {doctor?.name} 👋</h1>
              <p>{doctor?.specialty || "General Practice"} — Doctor Portal</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{doctor?.name?.[0]?.toUpperCase()}</div>
              <span>{doctor?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{booked}</div>
                <div className="stat-label">Upcoming</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{uniquePatients.length}</div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">{currentStatus === "Available" ? "🟢" : currentStatus === "Busy" ? "🔴" : "🟡"}</div>
                <div className="stat-value" style={{ fontSize: "14px", marginTop: "4px" }}>{currentStatus}</div>
                <div className="stat-label">My Status</div>
              </div>
            </div>

            <div className="availability-bar">
              <div className="avail-info">
                <h3>My Availability</h3>
                <p>Patients can only book with you when you're set to Available</p>
              </div>
              <div className="avail-btns">
                {["Available", "Busy", "On Leave"].map(s => (
                  <button key={s}
                    className={`avail-btn ${currentStatus === s ? `active-${s.toLowerCase().replace(" ", "-")}` : "inactive"}`}
                    onClick={() => toggleAvailability(s)}>
                    {s === "Available" ? "🟢" : s === "Busy" ? "🔴" : "🟡"} {s}
                  </button>
                ))}
              </div>
            </div>

            {tab === "appointments" && (
              <>
                <div className="section-header">
                  <div className="section-title">Appointments</div>
                  <div className="filter-bar">
                    {["All", "Booked", "Completed", "Cancelled"].map(f => (
                      <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <div className="empty-state">No appointments found</div>
                ) : (
                  <div className="appt-list">
                    {filtered.map(a => (
                      <div className="appt-card" key={a.id}>
                        <div className="appt-left">
                          <div className="patient-avatar">{getInitials(a.patient_name)}</div>
                          <div>
                            <div className="patient-name">{a.patient_name}</div>
                            <div className="patient-meta">{a.gender || ""}{a.age ? ` · ${a.age} yrs` : ""}{a.phone ? ` · ${a.phone}` : ""}</div>
                            <div className="appt-date">📅 {new Date(a.appointment_date).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</div>
                          </div>
                        </div>
                        <div className="appt-right">
                          <span className={`badge ${a.status === "Booked" ? "badge-amber" : a.status === "Completed" ? "badge-green" : "badge-red"}`}>{a.status}</span>
                          {a.status === "Booked" && (
                            <div className="action-btns">
                              <button className="btn-complete" onClick={() => updateStatus(a.id, "Completed")}>✅ Complete</button>
                              <button className="btn-reject" onClick={() => updateStatus(a.id, "Cancelled")}>✕ Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "patients" && (
              <>
                <div className="section-header">
                  <div className="section-title">My Patients ({uniquePatients.length})</div>
                </div>
                {uniquePatients.length === 0 ? (
                  <div className="empty-state">No patients yet</div>
                ) : (
                  <div className="patients-grid">
                    {uniquePatients.map((a, i) => (
                      <div className="patient-card" key={i}>
                        <div className="patient-card-header">
                          <div className="pc-avatar">{getInitials(a.patient_name)}</div>
                          <div>
                            <div className="pc-name">{a.patient_name}</div>
                            <div className="pc-meta">{a.gender || "—"}{a.age ? ` · ${a.age} yrs` : ""}</div>
                          </div>
                        </div>
                        <div className="pc-details">
                          <div className="pc-row"><span className="pc-label">Phone</span><span className="pc-value">{a.phone || "—"}</span></div>
                          <div className="pc-row"><span className="pc-label">Email</span><span className="pc-value">{a.email || "—"}</span></div>
                          <div className="pc-row">
                            <span className="pc-label">Visits</span>
                            <span className="pc-value">{appointments.filter(ap => ap.patient_name === a.patient_name).length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "profile" && (
              <div className="profile-card">
                <h2>My Profile</h2>
                {[
                  { label: "Full Name", value: doctor?.name },
                  { label: "Username", value: doctor?.username },
                  { label: "Specialty", value: doctor?.specialty || "General Practice" },
                  { label: "Current Status", value: currentStatus },
                  { label: "Doctor ID", value: `#${doctor?.doctor_id}` },
                ].map(item => (
                  <div className="profile-row" key={item.label}>
                    <span className="profile-label">{item.label}</span>
                    <span className="profile-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

export default DoctorDashboard;