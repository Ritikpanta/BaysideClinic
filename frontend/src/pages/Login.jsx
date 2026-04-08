import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  .auth-page {
    min-height: 100vh;
    display: flex;
    background: #f0f4f8;
  }

  .auth-left {
    width: 420px;
    background: #0a1628;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 48px;
    flex-shrink: 0;
  }

  .auth-left .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
  }

  .auth-left .brand img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
  }

  .auth-left .brand span {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .portal-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(37,99,235,0.2);
    border: 1px solid rgba(37,99,235,0.4);
    color: #93c5fd;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .auth-left h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 32px;
    color: white;
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .auth-left p {
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 40px;
  }

  .other-portals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
  }

  .portal-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    text-decoration: none;
    transition: all 0.15s;
  }

  .portal-link:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.15);
  }

  .portal-link-icon {
    font-size: 18px;
  }

  .portal-link-text {
    display: flex;
    flex-direction: column;
  }

  .portal-link-title {
    color: white;
    font-size: 13px;
    font-weight: 500;
  }

  .portal-link-sub {
    color: rgba(255,255,255,0.35);
    font-size: 11px;
    margin-top: 1px;
  }

  .portal-link-arrow {
    margin-left: auto;
    color: rgba(255,255,255,0.25);
    font-size: 14px;
  }

  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .auth-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    border: 1px solid #e8edf2;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .auth-card h2 {
    font-family: helvetica, poppins, serif;
    font-size: 26px;
    color: #0a1628;
    font-weight: 400;
    margin-bottom: 6px;
  }

  .auth-card .sub {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 28px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .form-label {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    padding: 11px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #0a1628;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
    background: white;
  }

  .btn-submit {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    margin-top: 4px;
  }

  .btn-submit:hover { background: #1d4ed8; }

  .error-msg {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .divider {
    text-align: center;
    font-size: 13px;
    color: #94a3b8;
    margin: 20px 0;
    position: relative;
  }

  .divider::before, .divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 42%;
    height: 1px;
    background: #e2e8f0;
  }

  .divider::before { left: 0; }
  .divider::after { right: 0; }

  .signup-link {
    text-align: center;
    font-size: 13px;
    color: #64748b;
    margin-top: 16px;
  }

  .signup-link a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  .signup-link a:hover { text-decoration: underline; }
`;
const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/api/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ username, password })
});

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("`${API_URL}/api/login`", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">

     
        <div className="auth-left">
          <div className="brand">
                       <img src="/baysideclinic.png" alt="Bayside Clinical" style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", margin: "center" }} />          </div>
          <div className="portal-badge">🏥 Admin Portal</div>
          <h1>Clinic Management System</h1>
          <p>Manage patients, doctors, and appointments from one centralised dashboard.</p>

          <div className="other-portals">
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
              Other Portals
            </p>
            <Link to="/patient-login" className="portal-link">
              <span className="portal-link-icon">👤</span>
              <div className="portal-link-text">
                <span className="portal-link-title">Patient Portal</span>
                <span className="portal-link-sub">Book & manage appointments</span>
              </div>
              <span className="portal-link-arrow">→</span>
            </Link>
            <Link to="/doctor-login" className="portal-link">
              <span className="portal-link-icon">🩺</span>
              <div className="portal-link-text">
                <span className="portal-link-title">Doctor Portal</span>
                <span className="portal-link-sub">Manage your schedule & patients</span>
              </div>
              <span className="portal-link-arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Admin Sign In</h2>
            <p className="sub">Enter your admin credentials to access the dashboard.</p>

            {message && <div className="error-msg">⚠️ {message}</div>}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button className="btn-submit" onClick={handleSubmit}>Sign In</button>

            <div className="divider">or</div>

            <div className="signup-link">
              Don't have an account? <Link to="/register">Create one →</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;