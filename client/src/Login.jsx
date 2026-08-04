import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");

      setForm({
        email: "",
        password: "",
      });

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Welcome Back</h1>

        <form onSubmit={handleSubmit}>

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>

          <p className="forgot-link">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;