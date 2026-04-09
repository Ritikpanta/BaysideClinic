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
  .portal-tag { display: inline-block; background: rgba(37,99,235,0.25); color: #93c5fd; font-size: 10px; padding: 3px 8px; border-radius: 10px; margin-top: 8px; font-weight: 500; }

  .sidebar-nav { padding: 16px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .nav-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.55); font-size: 13px; background: none; border: none; cursor: pointer; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .nav-btn:hover { background: rgba(255,255,255,0.07); color: white; }
  .nav-btn.active { background: #2563eb; color: white; font-weight: 500; }

  .sidebar-footer { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,0.07); }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.4); font-size: 13px; cursor: pointer; border: none; background: none; width: 100%; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }

  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
  .topbar { background: white; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8edf2; sticky: top 0; position: sticky; top: 0; z-index: 50; }
  .topbar h1 { font-family: 'Instrument Serif', serif; font-size: 20px; color: #0a1628; font-weight: 400; }
  .topbar p { font-size: 12px; color: #94a3b8; margin-top: 1px; }
  .user-badge { display: flex; align-items: center; gap: 10px; background: #f0f4f8; padding: 7px 14px; border-radius: 50px; }
  .user-avatar { width: 26px; height: 26px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 600; }
  .user-badge span { font-size: 13px; font-weight: 500; color: #0a1628; }

  .content { padding: 28px; flex: 1; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e8edf2; }
  .stat-icon { font-size: 22px; margin-bottom: 10px; }
  .stat-value { font-size: 26px; font-weight: 600; color: #0a1628; }
  .stat-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 15px; font-weight: 600; color: #0a1628; }

  .doctors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
  .doctor-card { background: white; border-radius: 12px; border: 1px solid #e8edf2; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.2s; }
  .doctor-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
  .doc-avatar { width: 52px; height: 52px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 10px; }
  .doc-name { font-size: 14px; font-weight: 600; color: #0a1628; margin-bottom: 3px; }
  .doc-specialty { font-size: 12px; color: #64748b; margin-bottom: 10px; }
  .doc-exp { font-size: 11px; color: #94a3b8; margin-bottom: 12px; }
  .available-badge { background: #f0fdf4; color: #16a34a; font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: 500; margin-bottom: 14px; }

  .book-btn { width: 100%; padding: 9px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .book-btn:hover { background: #1d4ed8; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .modal { background: white; border-radius: 16px; padding: 32px; width: 400px; }
  .modal h3 { font-family: 'Instrument Serif', serif; font-size: 20px; color: #0a1628; margin-bottom: 6px; font-weight: 400; }
  .modal p { font-size: 13px; color: #94a3b8; margin-bottom: 20px; }
  .modal-label { font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; display: block; }
  .modal-input { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 20px; background: #fafafa; }
  .modal-input:focus { border-color: #2563eb; background: white; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
  .btn-cancel-modal { padding: 9px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-confirm { padding: 9px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-confirm:hover { background: #1d4ed8; }

  .appointments-list { display: flex; flex-direction: column; gap: 10px; }
  .appt-card { background: white; border-radius: 12px; border: 1px solid #e8edf2; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
  .appt-info { display: flex; align-items: center; gap: 14px; }
  .appt-icon { width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .appt-doctor { font-size: 14px; font-weight: 500; color: #0a1628; }
  .appt-specialty { font-size: 12px; color: #64748b; }
  .appt-date { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: 500; }
  .badge-amber { background: #fffbeb; color: #d97706; }
  .badge-green { background: #f0fdf4; color: #16a34a; }
  .badge-red { background: #fef2f2; color: #dc2626; }
  .cancel-btn { padding: 7px 14px; background: #fef2f2; color: #dc2626; border: none; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; margin-left: 10px; }
  .cancel-btn:hover { background: #dc2626; color: white; }

  .empty-state { padding: 40px; text-align: center; color: #94a3b8; background: white; border-radius: 12px; border: 1px solid #e8edf2; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: #0a1628; color: white; padding: 12px 20px; border-radius: 10px; font-size: 13px; z-index: 300; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

const bgColors = ["#eff6ff", "#f0fdf4", "#fdf4ff", "#fffbeb", "#fef2f2"];
const getColor = name => bgColors[(name?.charCodeAt(0) || 0) % bgColors.length];
const getInitials = name => name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "DR";

function PatientDashboard() {
  const [tab, setTab] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient"));

  useEffect(() => {
    if (!patient) { navigate("/patient-login"); return; }
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = () => {
    fetch(`${API_URL}/api/patient/doctors`)
      .then(r => r.json()).then(setDoctors).catch(() => {});
  };

  const fetchAppointments = () => {
    fetch(`${API_URL}/api/patient/appointments/${patient?.patient_id}`)
      .then(r => r.json()).then(setAppointments).catch(() => {});
  };

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleBook = async () => {
    if (!bookingDate) return;
    try {
      const res = await fetch(`${API_URL}/api/patient/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.patient_id, doctor_id: bookingDoctor.id, appointment_date: bookingDate }),
      });
      if (res.ok) {
        setBookingDoctor(null); setBookingDate("");
        fetchAppointments();
        showToast("✅ Appointment booked successfully!");
        setTab("appointments");
      }
    } catch { showToast("❌ Failed to book appointment"); }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    const res = await fetch(`${API_URL}/api/patient/appointments/${id}/cancel`, { method: "PATCH" });
    if (res.ok) { fetchAppointments(); showToast("Appointment cancelled"); }
  };

  const handleLogout = () => { localStorage.removeItem("patient"); navigate("/patient-login"); };

  const booked = appointments.filter(a => a.status === "Booked").length;
  const completed = appointments.filter(a => a.status === "Completed").length;

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
             <img
              src="/baysideclinic.png"
              alt="Bayside Clinical"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                objectFit: "cover",
                margin: "center"
              }}
            />
            
            <p>Management System</p>
            <span className="portal-tag">Patient Portal</span>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-btn ${tab === "doctors" ? "active" : ""}`} onClick={() => setTab("doctors")}>🩺 Available Doctors</button>
            <button className={`nav-btn ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>📅 My Appointments</button>
            <button className={`nav-btn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>👤 My Profile</button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}><span>🚪</span> Sign Out</button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div>
              <h1>Welcome, {patient?.name} 👋</h1>
              <p>Patient Portal — Bayside Clinical</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{patient?.name?.[0]?.toUpperCase()}</div>
              <span>{patient?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{booked}</div>
                <div className="stat-label">Upcoming Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{completed}</div>
                <div className="stat-label">Completed Visits</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🩺</div>
                <div className="stat-value">{doctors.length}</div>
                <div className="stat-label">Available Doctors</div>
              </div>
            </div>

            {tab === "doctors" && (
              <>
                <div className="section-header">
                  <div className="section-title">Available Doctors</div>
                </div>
                {doctors.length === 0 ? (
                  <div className="empty-state">No doctors available right now</div>
                ) : (
                  <div className="doctors-grid">
                    {doctors.map(doc => (
                      <div className="doctor-card" key={doc.id}>
                        <div className="doc-avatar" style={{ background: getColor(doc.name) }}>{getInitials(doc.name)}</div>
                        <div className="doc-name">{doc.name}</div>
                        <div className="doc-specialty">{doc.specialty || "General Practice"}</div>
                        {doc.experience_years && <div className="doc-exp">{doc.experience_years} years experience</div>}
                        <span className="available-badge">🟢 Available</span>
                        <button className="book-btn" onClick={() => setBookingDoctor(doc)}>Book Appointment</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "appointments" && (
              <>
                <div className="section-header">
                  <div className="section-title">My Appointments</div>
                </div>
                {appointments.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>📅</div>
                    <p>No appointments yet. <button style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", font: "inherit" }} onClick={() => setTab("doctors")}>Book one now →</button></p>
                  </div>
                ) : (
                  <div className="appointments-list">
                    {appointments.map(a => (
                      <div className="appt-card" key={a.id}>
                        <div className="appt-info">
                          <div className="appt-icon">🩺</div>
                          <div>
                            <div className="appt-doctor">{a.doctor_name || "Doctor TBA"}</div>
                            <div className="appt-specialty">{a.specialty || ""}</div>
                            <div className="appt-date">{new Date(a.appointment_date).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className={`badge ${a.status === "Booked" ? "badge-amber" : a.status === "Completed" ? "badge-green" : "badge-red"}`}>{a.status}</span>
                          {a.status === "Booked" && (
                            <button className="cancel-btn" onClick={() => handleCancel(a.id)}>Cancel</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "profile" && (
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e8edf2", padding: "28px", maxWidth: "480px" }}>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontWeight: 400, color: "#0a1628", marginBottom: "20px" }}>My Profile</h2>
                {[
                  { label: "Full Name", value: patient?.name },
                  { label: "Username", value: patient?.username },
                  { label: "Patient ID", value: `#${patient?.patient_id}` },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#0a1628" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {bookingDoctor && (
          <div className="modal-overlay" onClick={() => setBookingDoctor(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Book with {bookingDoctor.name}</h3>
              <p>{bookingDoctor.specialty || "General Practice"}</p>
              <label className="modal-label">Select Date & Time</label>
              <input className="modal-input" type="datetime-local" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
              <div className="modal-actions">
                <button className="btn-cancel-modal" onClick={() => setBookingDoctor(null)}>Cancel</button>
                <button className="btn-confirm" onClick={handleBook}>📅 Confirm Booking</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

export default PatientDashboard;