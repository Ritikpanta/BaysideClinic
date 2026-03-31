import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Patients</h1>
      <Link to="/patients/add">
        <button>Add Patient</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.phone}</td>
              <td>{patient.email}</td>
              <td>{patient.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Patients;