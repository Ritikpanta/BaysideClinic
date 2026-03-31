import Sidebar from "../components/Sidebar";

function Doctors() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Doctors</h1>
        <p>Doctor and staff management page.</p>
      </div>
    </div>
  );
}

export default Doctors;