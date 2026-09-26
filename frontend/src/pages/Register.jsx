import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await registerUser(
        name,
        email,
        password,
        phone
      );

      console.log("Registration response:", data);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join SupportSphere and get customer support</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;