import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAppointment() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_date: "",
    status: "Booked",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/appointments");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to connect to server");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Appointment</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <select name="patient_id" value={formData.patient_id} onChange={handleChange}>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        <br /><br />

        <input
          type="datetime-local"
          name="appointment_date"
          value={formData.appointment_date}
          onChange={handleChange}
        />
        <br /><br />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <br /><br />

        <button type="submit">Save Appointment</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddAppointment;