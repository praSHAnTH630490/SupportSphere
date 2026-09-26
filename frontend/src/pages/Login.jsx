import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      console.log("Login response:", data);

      login(
        {
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role
        },
        data.token
      );

      if (data.role === "CUSTOMER") {
        navigate("/customer/dashboard");
      } else if (data.role === "AGENT") {
        navigate("/agent/dashboard");
      } else if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your SupportSphere account</p>
        </div>

        <form onSubmit={handleSubmit}>

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
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;