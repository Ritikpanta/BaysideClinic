import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .layout {
    display: flex;
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .sidebar {
    width: 260px;
    background: #0a1628;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
  }

  .sidebar-brand {
    padding: 28px 24px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .sidebar-brand h2 {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .sidebar-brand p {
    color: rgba(255,255,255,0.4);
    font-size: 11px;
    margin-top: 2px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .sidebar-nav {
    padding: 16px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-section-label {
    color: rgba(255,255,255,0.25);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 12px 12px 6px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.15s;
  }

  .nav-link:hover {
    background: rgba(255,255,255,0.07);
    color: white;
  }

  .nav-link.active {
    background: #2563eb;
    color: white;
    font-weight: 500;
  }

  .nav-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: rgba(255,255,255,0.4);
    font-size: 14px;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .logout-btn:hover {
    background: rgba(239,68,68,0.15);
    color: #f87171;
  }

  .main {
    margin-left: 260px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: white;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8edf2;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-left h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 22px;
    color: #0a1628;
    font-weight: 400;
  }

  .topbar-left p {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 1px;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0f4f8;
    padding: 8px 14px;
    border-radius: 50px;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    background: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .user-badge span {
    font-size: 13px;
    font-weight: 500;
    color: #0a1628;
  }

  .content {
    padding: 32px;
    flex: 1;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .page-title {
    font-family: 'Instrument Serif', serif;
    font-size: 26px;
    color: #0a1628;
    font-weight: 400;
  }

  .page-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #2563eb;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-primary:hover {
    background: #1d4ed8;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: white;
    color: #0f172a;
    padding: 10px 18px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.15s;
    border: 1px solid #dbe3ec;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-secondary:hover {
    background: #f8fafc;
  }

  .form-card {
    background: white;
    border-radius: 18px;
    border: 1px solid #e8edf2;
    padding: 28px;
    max-width: 900px;
  }

  .form-card-header {
    margin-bottom: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid #eef2f7;
  }

  .form-card-header h2 {
    font-size: 20px;
    color: #0a1628;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .form-card-header p {
    font-size: 13px;
    color: #94a3b8;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group.full {
    grid-column: 1 / -1;
  }

  .form-group label {
    font-size: 13px;
    font-weight: 500;
    color: #334155;
  }

  .form-control {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #dbe3ec;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    outline: none;
    transition: all 0.15s;
  }

  .form-control:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 28px;
  }

  .helper-box {
    margin-top: 24px;
    background: #f8fbff;
    border: 1px solid #dbeafe;
    border-radius: 14px;
    padding: 16px 18px;
    max-width: 900px;
  }

  .helper-box h3 {
    font-size: 14px;
    color: #1e3a8a;
    margin-bottom: 6px;
  }

  .helper-box p {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
  }

  @media (max-width: 900px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .main {
      margin-left: 0;
    }

    .sidebar {
      display: none;
    }
  }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctors", icon: "🩺", label: "Doctors", active: true },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

function AddDoctor() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    status: "Available",
    experience_years: "",
    phone: "",
    email: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        experience_years: formData.experience_years === "" ? null : Number(formData.experience_years),
      };

      const response = await fetch("http://127.0.0.1:5000/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor");
      }

      navigate("/doctors");
    } catch (error) {
      alert("Could not save doctor. Check backend route and field names.");
      console.error(error);
    }
  };

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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${link.active ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>Add Doctor</h1>
              <p>Create a new doctor profile</p>
            </div>

            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="page-header">
              <div>
                <div className="page-title">New Medical Staff</div>
                <div className="page-subtitle">Fill in the doctor details below</div>
              </div>

              <Link to="/doctors" className="btn-secondary">
                ← Back to Doctors
              </Link>
            </div>

            <div className="form-card">
              <div className="form-card-header">
                <h2>Doctor Information</h2>
                <p>Add the doctor’s basic profile, contact details, and work status.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Doctor Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Specialty</label>
                    <input
                      type="text"
                      name="specialty"
                      className="form-control"
                      placeholder="e.g. Cardiologist"
                      value={formData.specialty}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="experience_years"
                      className="form-control"
                      placeholder="Enter years"
                      value={formData.experience_years}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    💾 Save Doctor
                  </button>

                  <Link to="/doctors" className="btn-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            <div className="helper-box">
              <h3>Quick note</h3>
              <p>
                After saving, the doctor will appear in the Doctors page list. If saving does not work,
                the frontend is fine, then the Flask backend route or field names need checking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddDoctor;