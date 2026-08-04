import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      alert("Registration Successful!");

      // Clear form
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to Home page
      navigate("/");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>

          <input
            className="register-input"
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            className="register-btn"
            type="submit"
          >
            Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;