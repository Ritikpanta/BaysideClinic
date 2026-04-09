import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  .auth-page { min-height: 100vh; display: flex; background: #f0f4f8; }
  .auth-left { width: 420px; background: #0a1628; display: flex; flex-direction: column; justify-content: center; padding: 60px 48px; flex-shrink: 0; }
  .auth-left .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .auth-left .brand img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
  .auth-left .brand span { color: white; font-size: 16px; font-weight: 600; }
  .portal-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.2); border: 1px solid rgba(37,99,235,0.4); color: #93c5fd; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 24px; }
  .auth-left h1 { font-family: 'Instrument Serif', serif; font-size: 32px; color: white; font-weight: 400; line-height: 1.2; margin-bottom: 12px; }
  .auth-left p { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; margin-bottom: 40px; }
  .back-link { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.35); font-size: 13px; text-decoration: none; transition: color 0.15s; }
  .back-link:hover { color: white; }

  .roles-info { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
  .role-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); }
  .role-icon { font-size: 16px; }
  .role-name { color: white; font-size: 13px; font-weight: 500; }
  .role-desc { color: rgba(255,255,255,0.35); font-size: 11px; }

  .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
  .auth-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; border: 1px solid #e8edf2; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .auth-card h2 { font-family: 'Instrument Serif', serif; font-size: 26px; color: #0a1628; font-weight: 400; margin-bottom: 6px; }
  .auth-card .sub { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 500; color: #374151; }
  .form-label span { color: #ef4444; margin-left: 2px; }
  .form-input { padding: 11px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; transition: border-color 0.15s, box-shadow 0.15s; }
  .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); background: white; }
  .form-select { padding: 11px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; cursor: pointer; }
  .form-select:focus { border-color: #2563eb; background: white; }
  .btn-submit { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; margin-top: 4px; }
  .btn-submit:hover { background: #1d4ed8; }
  .error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .success-msg { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .divider { text-align: center; font-size: 13px; color: #94a3b8; margin: 20px 0; position: relative; }
  .divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: #e2e8f0; }
  .divider::before { left: 0; } .divider::after { right: 0; }
  .login-link { text-align: center; font-size: 13px; color: #64748b; }
  .login-link a { color: #2563eb; text-decoration: none; font-weight: 500; }
  .login-link a:hover { text-decoration: underline; }
`;

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "", role: "admin" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Account created! Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
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

          <div className="portal-badge">🏥 Admin Portal</div>
          <h1>Create an admin account</h1>
          <p>Set up your credentials to manage the Bayside Clinical system.</p>

          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "10px" }}>
              Available Roles
            </p>
            <div className="roles-info">
              {[
                { icon: "👨‍⚕️", name: "Doctor", desc: "Clinical staff access" },
                { icon: "📋", name: "Receptionist", desc: "Appointments & patients" },
              ].map(r => (
                <div className="role-item" key={r.name}>
                  <span className="role-icon">{r.icon}</span>
                  <div>
                    <div className="role-name">{r.name}</div>
                    <div className="role-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/" className="back-link">← Back to Sign In</Link>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="sub">Fill in the details below to create your admin account.</p>

            {error && <div className="error-msg">⚠️ {error}</div>}
            {message && <div className="success-msg">✅ {message}</div>}

            <div className="form-group">
              <label className="form-label">Username <span>*</span></label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span>*</span></label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role <span>*</span></label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <button className="btn-submit" onClick={handleSubmit}>Create Account</button>

            <div className="divider">or</div>

            <div className="login-link">
              Already have an account? <Link to="/">Sign in →</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Register;