import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-page {
    min-height: 100vh;
    display: flex;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .auth-left {
    width: 380px;
    background: #0a1628;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 48px;
    flex-shrink: 0;
  }

  .auth-left .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
  }

  .auth-left .brand img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
  }

  .auth-left .brand span {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .auth-left h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 30px;
    color: white;
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .auth-left p {
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .portal-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(37,99,235,0.2);
    border: 1px solid rgba(37,99,235,0.4);
    color: #93c5fd;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .auth-link {
    color: rgba(255,255,255,0.35);
    font-size: 13px;
    text-decoration: none;
    transition: color 0.15s;
  }

  .auth-link:hover {
    color: white;
  }

  .auth-link span {
    color: #60a5fa;
  }

  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    overflow-y: auto;
  }

  .auth-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 480px;
    border: 1px solid #e8edf2;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .auth-card h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    color: #0a1628;
    font-weight: 400;
    margin-bottom: 6px;
  }

  .auth-card .sub {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 20px 0 12px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .form-group.full {
    grid-column: 1 / -1;
    margin-bottom: 0;
  }

  .form-label {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  .form-label span {
    color: #ef4444;
  }

  .form-input,
  .form-select {
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #0a1628;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input:focus,
  .form-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
    background: white;
  }

  .input-error {
    border: 1px solid #dc2626 !important;
    background: #fef2f2 !important;
  }

  .error-msg {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .success-msg {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .error-text {
    color: #dc2626;
    font-size: 12px;
    margin-top: 2px;
    font-weight: 500;
  }

  .password-strength {
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  }

  .password-strength.weak {
    color: #dc2626;
  }

  .password-strength.medium {
    color: #d97706;
  }

  .password-strength.strong {
    color: #059669;
  }

  .btn-submit {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    margin-top: 16px;
  }

  .btn-submit:hover {
    background: #1d4ed8;
  }

  .login-link {
    text-align: center;
    font-size: 13px;
    color: #64748b;
    margin-top: 16px;
  }

  .login-link a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  @media (max-width: 900px) {
    .auth-page {
      flex-direction: column;
    }

    .auth-left {
      width: 100%;
      padding: 40px 24px;
    }

    .auth-right {
      padding: 24px;
    }
  }

  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function PatientRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return "";

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&.#_-]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedPassword = formData.password.trim();
    const trimmedGender = formData.gender.trim();

    if (!trimmedName) {
      newErrors.name = "Full name is required";
    } else if (!nameRegex.test(trimmedName)) {
      newErrors.name = "Enter a proper full name";
    } else if (trimmedName.split(/\s+/).length < 2) {
      newErrors.name = "Please enter first and last name";
    }

    if (!trimmedUsername) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(trimmedUsername)) {
      newErrors.username =
        "Username must be 4 to 20 characters, letters, numbers, or underscore only";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(trimmedPassword)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }

    if (!formData.age.toString().trim()) {
      newErrors.age = "Age is required";
    } else {
      const age = Number(formData.age);
      if (!Number.isInteger(age) || age < 1 || age > 120) {
        newErrors.age = "Enter a valid age between 1 and 120";
      }
    }

    if (!trimmedGender) {
      newErrors.gender = "Gender is required";
    }

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/patient/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully");
        setTimeout(() => {
          navigate("/patient-login");
        }, 800);
      } else {
        if (data.field) {
          setErrors((prev) => ({
            ...prev,
            [data.field]: data.message,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: data.message || "Registration failed",
          }));
        }
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "Server connection failed",
      }));
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="auth-page">
        <div className="auth-left">
          <div className="brand">
            <img src="/Baysideclinic.png" alt="logo" />
            <span>Bayside Clinical</span>
          </div>

          <div className="portal-badge">🏥 Patient Portal</div>
          <h1>Join Bayside Clinical</h1>
          <p>
            Create your patient account to start booking appointments with our
            doctors.
          </p>

          <Link to="/patient-login" className="auth-link">
            ← Already have an account? <span>Sign in</span>
          </Link>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Patient Account</h2>
            <p className="sub">Fill in your details to get started</p>

            {errors.general && (
              <div className="error-msg">⚠️ {errors.general}</div>
            )}

            {success && <div className="success-msg">✅ {success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="section-title">Account Details</div>

              <div className="form-grid">
                <div className="form-group full">
                  <label className="form-label">
                    Full Name <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.name ? "input-error" : ""}`}
                    name="name"
                    placeholder="e.g. John Smith"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <div className="error-text">{errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Username <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.username ? "input-error" : ""}`}
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                  />
                  {errors.username && (
                    <div className="error-text">{errors.username}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Password <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  {passwordStrength && (
                    <div
                      className={`password-strength ${passwordStrength.toLowerCase()}`}
                    >
                      Password strength: {passwordStrength}
                    </div>
                  )}
                  {errors.password && (
                    <div className="error-text">{errors.password}</div>
                  )}
                </div>
              </div>

              <div className="section-title">Personal Info</div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Age <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.age ? "input-error" : ""}`}
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 21"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                  {errors.age && (
                    <div className="error-text">{errors.age}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Gender <span>*</span>
                  </label>
                  <select
                    className={`form-select ${errors.gender ? "input-error" : ""}`}
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <div className="error-text">{errors.gender}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.phone ? "input-error" : ""}`}
                    type="tel"
                    placeholder="0412345678"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <div className="error-text">{errors.phone}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span>*</span>
                  </label>
                  <input
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <div className="error-text">{errors.email}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-submit">
                Create Account
              </button>
            </form>

            <div className="login-link">
              Already have an account? <Link to="/patient-login">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientRegister;