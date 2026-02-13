import { useState } from "react";
import "../styles/Auth.css";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import api from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    api.post("/api/token/", {
      username,
      password
    })
    .then(response => {
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("username", username); 
  window.location.href = "/home";
})

    .catch(() => {
      setError("Invalid username or password");
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          maxLength="30"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            maxLength="20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </span>
        </div>

        <button onClick={handleLogin}>Login</button>

        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
