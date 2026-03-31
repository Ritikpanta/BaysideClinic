import Sidebar from "../components/Sidebar";

function Settings() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Settings</h1>
        <p>System settings page.</p>
      </div>
    </div>
  );
}

export default Settings;