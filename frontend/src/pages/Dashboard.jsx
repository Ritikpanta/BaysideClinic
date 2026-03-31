import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome, {user?.username || "User"}</h1>
      <p>This is your clinic dashboard.</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Link to="/patients">
          <button>View Patients</button>
        </Link>

        <Link to="/patients/add">
          <button>Add Patient</button>
        </Link>

        <Link to="/appointments">
          <button>View Appointments</button>
        </Link>

        <Link to="/appointments/add">
          <button>Add Appointment</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;