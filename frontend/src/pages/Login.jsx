import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaInfoCircle,
  FaPlaneDeparture,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert("Login Successful!");

        console.log(data);

        // Save JWT Token
        localStorage.setItem("token", data.token);

        // Save User Data
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to Dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT PANEL */}

      <div className="left-panel">
        <div className="brand">
          <div className="logo">
            <FaPlaneDeparture />
          </div>

          <div>
            <h2>Rang Travels CRM</h2>
            <p>Travel Management Portal</p>
          </div>
        </div>

        <div className="left-content">
          <h1>
            Manage.
            <br />
            Travel.
            <br />
            Succeed.
          </h1>

          <p>
            Streamline your travel operations and provide the best experience
            to your customers.
          </p>

          <img
            src="/travel.png"
            alt="Travel"
            className="travel-image"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="right-panel">
        <div className="login-card">

          <div className="lock-circle">
            <FaLock />
          </div>

          <h1>Welcome Back!</h1>

          <p className="subtitle">
            Login with your employee credentials
          </p>

          <hr />

          <form onSubmit={handleLogin}>

            <label>Employee ID / Email</label>

            <div className="input-box">
              <FaUser className="icon" />

              <input
                type="email"
                placeholder="Enter employee ID or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label>Password</label>

            <div className="input-box">
              <FaLock className="icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="options">
              <label className="remember">
                <input type="checkbox" />
                Remember Me
              </label>

              <a href="/">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              <FaSignInAlt />

              {loading ? "Logging In..." : "LOGIN"}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="info-box">
            <FaInfoCircle />

            <p>
              Accounts are created only by the Administrator.
              <br />
              Contact your Administrator if you don't have login credentials.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;