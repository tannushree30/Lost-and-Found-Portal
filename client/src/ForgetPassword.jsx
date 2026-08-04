import { useState } from "react";
import API from "./services/api";
import "./ForgetPassword.css";

function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await API.put("/auth/forgot-password", {
        email: form.email,
        password: form.password,
      });

      alert(res.data.message);

      setForm({
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <h1>Forgot Password</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Update Password
          </button>

        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;