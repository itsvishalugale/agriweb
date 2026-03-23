import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function BuyerRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await register(form, "buyer");
      if (role === "buyer") {
        navigate("/buyer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "480px", margin: "3rem auto" }}
    >
      <div className="card">
        <div className="card-header">
          <h2>Buyer Registration</h2>
        </div>
        <div className="card-body">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (City / District)</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              {loading ? "Creating account..." : "Register as Farmer"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            Already have an account? <Link to="/farmer/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
