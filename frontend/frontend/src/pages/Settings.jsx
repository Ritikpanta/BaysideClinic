import { useState } from "react";
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
  .content { padding: 32px; flex: 1; display: flex; gap: 24px; align-items: flex-start; }

  .settings-nav { width: 200px; flex-shrink: 0; background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; }
  .settings-nav-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-size: 13px; color: #64748b; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; border-left: 3px solid transparent; }
  .settings-nav-item:hover { background: #f8fafc; color: #0a1628; }
  .settings-nav-item.active { color: #2563eb; background: #eff6ff; border-left-color: #2563eb; font-weight: 500; }

  .settings-panel { flex: 1; display: flex; flex-direction: column; gap: 20px; }
  .settings-card { background: white; border-radius: 14px; border: 1px solid #e8edf2; overflow: hidden; }
  .settings-card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
  .settings-card-header h3 { font-size: 15px; font-weight: 600; color: #0a1628; }
  .settings-card-header p { font-size: 13px; color: #94a3b8; margin-top: 2px; }
  .settings-card-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .settings-row { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
  .settings-row:last-child { border-bottom: none; padding-bottom: 0; }
  .settings-row-info h4 { font-size: 14px; font-weight: 500; color: #0a1628; margin-bottom: 2px; }
  .settings-row-info p { font-size: 12px; color: #94a3b8; }

  .toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #e2e8f0; border-radius: 24px; transition: 0.3s; }
  .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .toggle input:checked + .toggle-slider { background: #2563eb; }
  .toggle input:checked + .toggle-slider:before { transform: translateX(18px); }

  .form-input { padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #0a1628; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; width: 220px; }
  .form-input:focus { border-color: #2563eb; background: white; }

  .btn-primary { background: #2563eb; color: white; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-danger { background: #fef2f2; color: #dc2626; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid #fecaca; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-danger:hover { background: #dc2626; color: white; }

  .info-badge { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: #16a34a; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .system-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .info-item { background: #f8fafc; border-radius: 8px; padding: 14px; }
  .info-item-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .info-item-value { font-size: 14px; font-weight: 500; color: #0a1628; }
`;

const navLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patients", icon: "👥", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctors", icon: "🩺", label: "Doctors" },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/settings", icon: "⚙️", label: "Settings", active: true },
];

const tabs = ["General", "Security", "Notifications", "System"];

function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [toggles, setToggles] = useState({ emailNotif: true, smsNotif: false, darkMode: false, autoBackup: true });
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };
  const toggle = key => setToggles(t => ({ ...t, [key]: !t[key] }));

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
              <h1>Settings</h1>
              <p>Manage your system preferences</p>
            </div>
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>
          </header>

          <div className="content">
            <div className="settings-nav">
              {tabs.map(tab => (
                <button key={tab} className={`settings-nav-item ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab === "General" ? "⚙️" : tab === "Security" ? "🔒" : tab === "Notifications" ? "🔔" : "🖥️"} {tab}
                </button>
              ))}
            </div>

            <div className="settings-panel">
              {activeTab === "General" && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3>Clinic Information</h3>
                    <p>Basic details about your clinic</p>
                  </div>
                  <div className="settings-card-body">
                    {[
                      { label: "Clinic Name", placeholder: "Bayside Clinical" },
                      { label: "Contact Email", placeholder: "admin@bayside.com.au" },
                      { label: "Phone Number", placeholder: "+61 2 9000 0000" },
                    ].map(field => (
                      <div className="settings-row" key={field.label}>
                        <div className="settings-row-info">
                          <h4>{field.label}</h4>
                        </div>
                        <input className="form-input" placeholder={field.placeholder} />
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn-primary">Save Changes</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Security" && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3>Security Settings</h3>
                    <p>Manage access and password settings</p>
                  </div>
                  <div className="settings-card-body">
                    <div className="settings-row">
                      <div className="settings-row-info">
                        <h4>Current Account</h4>
                        <p>Logged in as <strong>{user?.username}</strong> ({user?.role})</p>
                      </div>
                      <span className="info-badge">✅ Active</span>
                    </div>
                    <div className="settings-row">
                      <div className="settings-row-info">
                        <h4>Change Password</h4>
                        <p>Update your login password</p>
                      </div>
                      <button className="btn-primary">Change</button>
                    </div>
                    <div className="settings-row">
                      <div className="settings-row-info">
                        <h4>Sign Out All Sessions</h4>
                        <p>Log out from all devices</p>
                      </div>
                      <button className="btn-danger" onClick={handleLogout}>Sign Out</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Notifications" && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3>Notification Preferences</h3>
                    <p>Control how and when you receive alerts</p>
                  </div>
                  <div className="settings-card-body">
                    {[
                      { key: "emailNotif", label: "Email Notifications", desc: "Receive appointment reminders via email" },
                      { key: "smsNotif", label: "SMS Notifications", desc: "Send SMS reminders to patients" },
                      { key: "autoBackup", label: "Auto Backup Alerts", desc: "Get notified when database backups run" },
                    ].map(item => (
                      <div className="settings-row" key={item.key}>
                        <div className="settings-row-info">
                          <h4>{item.label}</h4>
                          <p>{item.desc}</p>
                        </div>
                        <label className="toggle">
                          <input type="checkbox" checked={toggles[item.key]} onChange={() => toggle(item.key)} />
                          <span className="toggle-slider" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "System" && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3>System Information</h3>
                    <p>Technical details about this installation</p>
                  </div>
                  <div className="settings-card-body">
                    <div className="system-info">
                      {[
                        { label: "Application", value: "Bayside Clinical v1.0" },
                        { label: "Frontend", value: "React + Vite" },
                        { label: "Backend", value: "Python Flask" },
                        { label: "Database", value: "MySQL (Local)" },
                        { label: "DB Host", value: "127.0.0.1:3306" },
                        { label: "DB Name", value: "bayside_system" },
                        { label: "User Role", value: user?.role || "admin" },
                        { label: "Status", value: "🟢 Online" },
                      ].map(item => (
                        <div className="info-item" key={item.label}>
                          <div className="info-item-label">{item.label}</div>
                          <div className="info-item-value">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;