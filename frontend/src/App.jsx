import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import Appointments from "./pages/Appointments";
import AddAppointment from "./pages/AddAppointment";
import Doctors from "./pages/Doctors";
import AddDoctor from "./pages/AddDoctor";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";

function AdminRoute({ children }) {
  return localStorage.getItem("user") ? children : <Navigate to="/" replace />;
}
function PatientRoute({ children }) {
  return localStorage.getItem("patient") ? children : <Navigate to="/patient-login" replace />;
}
function DoctorRoute({ children }) {
  return localStorage.getItem("doctor") ? children : <Navigate to="/doctor-login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/patients" element={<AdminRoute><Patients /></AdminRoute>} />
        <Route path="/patients/add" element={<AdminRoute><AddPatient /></AdminRoute>} />
        <Route path="/appointments" element={<AdminRoute><Appointments /></AdminRoute>} />
        <Route path="/appointments/add" element={<AdminRoute><AddAppointment /></AdminRoute>} />
        <Route path="/doctors" element={<AdminRoute><Doctors /></AdminRoute>} />
        <Route path="/doctors/add" element={<AdminRoute><AddDoctor /></AdminRoute>} />
        <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/dashboard" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;