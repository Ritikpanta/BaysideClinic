import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import Appointments from "./pages/Appointments";
import AddAppointment from "./pages/AddAppointment";
import Doctors from "./pages/Doctors";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Register from "./page`s/Register";

// Protects any route that requires login
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — redirect to login if not logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
        <Route path="/patients/add" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/appointments/add" element={<ProtectedRoute><AddAppointment /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;