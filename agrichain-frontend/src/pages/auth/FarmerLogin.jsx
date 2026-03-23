import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function FarmerLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await login(form);
      if (role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        setError("This login is for farmers only");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "420px", margin: "4rem auto" }}
    >
      <div className="card">
        <div className="card-header">
          <h2>Farmer Login</h2>
        </div>
        <div className="card-body">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="farmer@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "1.2rem" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            Don't have an account?{" "}
            <Link to="/farmer/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
