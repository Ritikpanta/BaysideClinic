import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .auth-page { min-height: 100vh; display: flex; background: #f0f4f8; font-family: 'DM Sans', sans-serif; }
  .auth-left { width: 380px; background: #0a1628; display: flex; flex-direction: column; justify-content: center; padding: 60px 48px; flex-shrink: 0; }
  .auth-left .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .auth-left .brand img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
  .auth-left .brand span { color: white; font-size: 16px; font-weight: 600; }
  .auth-left h1 { font-family: 'Instrument Serif', serif; font-size: 30px; color: white; font-weight: 400; line-height: 1.2; margin-bottom: 12px; }
  .auth-left p { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; margin-bottom: 32px; }
  .portal-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.2); border: 1px solid rgba(37,99,235,0.4); color: #93c5fd; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 24px; }
  .auth-link { color: rgba(255,255,255,0.35); font-size: 13px; text-decoration: none; transition: color 0.15s; }
  .auth-link:hover { color: white; }
  .auth-link span { color: #60a5fa; }
  .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
  .auth-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 480px; border: 1px solid #e8edf2; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .auth-card h2 { font-family: 'Instrument Serif', serif; font-size: 24px; color: #0a1628; font-weight: 400; margin-bottom: 6px; }
  .auth-card .sub { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .form-group.full { grid-column: 1 / -1; margin-bottom: 0; }
  .form-label { font-size: 13px; font-weight: 500; color: #374151; }
  .form-label span { color: #ef4444; }
  .form-input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; transition: border-color 0.15s; }
  .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); background: white; }
  .form-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; cursor: pointer; }
  .form-select:focus { border-color: #2563eb; }
  .btn-submit { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; margin-top: 16px; }
  .btn-submit:hover { background: #1d4ed8; }
  .error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .success-msg { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .login-link { text-align: center; font-size: 13px; color: #64748b; margin-top: 16px; }
  .login-link a { color: #2563eb; text-decoration: none; font-weight: 500; }
  .section-title { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 12px; }
`;

function PatientRegister() {
  const [formData, setFormData] = useState({ name: "", username: "", password: "", email: "", phone: "", age: "", gender: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/patient/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/patient-login"), 1500);
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
            <img src="/Baysideclinic.png" alt="logo" />
            <span>Bayside Clinical</span>
          </div>
          <div className="portal-badge">🏥 Patient Portal</div>
          <h1>Join Bayside Clinical</h1>
          <p>Create your patient account to start booking appointments with our doctors.</p>
          <Link to="/patient-login" className="auth-link">← Already have an account? <span>Sign in</span></Link>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Patient Account</h2>
            <p className="sub">Fill in your details to get started</p>
            {error && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            <div className="section-title">Account Details</div>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Full Name <span>*</span></label>
                <input className="form-input" name="name" placeholder="e.g. John Smith" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Username <span>*</span></label>
                <input className="form-input" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Password <span>*</span></label>
                <input className="form-input" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="section-title">Personal Info</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" name="age" placeholder="e.g. 28" value={formData.age} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" placeholder="0412 345 678" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <button className="btn-submit" onClick={handleSubmit}>Create Account</button>
            <div className="login-link">Already have an account? <Link to="/patient-login">Sign in →</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientRegister;