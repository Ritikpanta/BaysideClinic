import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/patients");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to connect to server");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Patient</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} /><br /><br />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} /><br /><br />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} /><br /><br />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} /><br /><br />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br /><br />
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange}></textarea><br /><br />

        <button type="submit">Save Patient</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPatient;