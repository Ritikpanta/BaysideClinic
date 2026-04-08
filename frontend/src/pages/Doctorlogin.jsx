import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');  * { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'General Sans', 'Inter', sans-serif; }
  .auth-page { min-height: 100vh; display: flex; background: #f0f4f8; }
  .auth-left { width: 420px; background: #0a1628; display: flex; flex-direction: column; justify-content: center; padding: 60px 48px; flex-shrink: 0; }
  .auth-left .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .auth-left .brand img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
  .auth-left .brand span { color: white; font-size: 16px; font-weight: 600; }
  .auth-left h1 { font-family: 'Instrument Serif', serif; font-size: 32px; color: white; font-weight: 400; line-height: 1.2; margin-bottom: 12px; }
  .auth-left p { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; margin-bottom: 40px; }
  .portal-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.4); color: #6ee7b7; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 24px; }
  .auth-links { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
  .auth-link { color: rgba(255,255,255,0.35); font-size: 13px; text-decoration: none; transition: color 0.15s; }
  .auth-link:hover { color: white; }
  .auth-link span { color: #6ee7b7; }
  .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
  .auth-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 400px; border: 1px solid #e8edf2; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .auth-card h2 { font-family: 'Instrument Serif', serif; font-size: 24px; color: #0a1628; font-weight: 400; margin-bottom: 6px; }
  .auth-card .sub { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 500; color: #374151; }
  .form-input { padding: 11px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; transition: border-color 0.15s; }
  .form-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.08); background: white; }
  .btn-submit { width: 100%; padding: 12px; background: #059669; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; margin-top: 8px; }
  .btn-submit:hover { background: #047857; }
  .error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; color: #065f46; padding: 10px 14px; border-radius: 8px; font-size: 12px; margin-bottom: 16px; line-height: 1.5; }
`;

function DoctorLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("doctor", JSON.stringify(data));
        navigate("/doctor/dashboard");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server connection failed");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-left">
          <div className="brand">
                             <img src="/baysideclinic.png" alt="Bayside Clinical" style={{ width: "72px", height: "72px", borderRadius: "10px", objectFit: "cover" }} />

          </div>
          <div className="portal-badge">🩺 Doctor Portal</div>
          <h1>Manage your patients & schedule</h1>
          <p>Access your appointments, view patient details, and manage your availability — all from one place.</p>
          <div className="auth-links">
            <Link to="/" className="auth-link">← Back to Admin Login</Link>
            <Link to="/patient-login" className="auth-link">Are you a patient? <span>Sign in here →</span></Link>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2>Doctor Sign In</h2>
            <p className="sub">Enter the credentials set by your admin.</p>
            {/* <div className="info-box">
              ℹ️ Your username and password are set by the clinic admin when your account is created via the <strong>Add Doctor</strong> form.
            </div> */}
            {error && <div className="error-msg">⚠️ {error}</div>}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="Enter your username" value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Enter your password" value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <button className="btn-submit" onClick={handleSubmit}>Sign In as Doctor</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorLogin;