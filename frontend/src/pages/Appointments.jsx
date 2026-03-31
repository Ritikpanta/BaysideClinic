import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Appointments</h1>
      <Link to="/appointments/add">
        <button>Add Appointment</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Appointment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.patient_name}</td>
              <td>{item.appointment_date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;