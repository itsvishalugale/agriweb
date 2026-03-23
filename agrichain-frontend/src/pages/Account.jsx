import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Account() {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Determine sidebar links based on role
  const links =
    user?.role === "farmer"
      ? [
          { label: "Dashboard", path: "/farmer/dashboard" },
          { label: "Upload Crop", path: "/farmer/upload" },
          { label: "My Crops", path: "/farmer/mycrops" },
          { label: "My Orders", path: "/farmer/orders" },
          { label: "Account", path: "/account" },
        ]
      : [
          { label: "Dashboard", path: "/buyer/dashboard" },
          { label: "Marketplace", path: "/buyer/marketplace" },
          { label: "My Cart", path: "/buyer/cart" },
          { label: "My Orders", path: "/buyer/orders" },
          { label: "Account", path: "/account" },
        ];

  useEffect(() => {
    if (user?.accountDetails) {
      setForm({
        name: user.accountDetails.name || "",
        phone: user.accountDetails.phone || "",
        location: user.accountDetails.location || "",
        bio: user.accountDetails.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await api.put("/auth/profile", {
        accountDetails: form,
      });

      // Update context with new user data
      setUser((prev) => ({ ...prev, accountDetails: res.data.accountDetails }));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />

      <main className="main-content">
        <h1>Account Settings</h1>
        <p style={{ marginBottom: "2rem", color: "#718096" }}>
          Update your personal information and contact details.
        </p>

        {message && (
          <div
            style={{
              background: "#e6fffa",
              color: "#0c8599",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1.5rem",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c92a2a",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        <div className="card" style={{ maxWidth: "600px" }}>
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          <div className="card-body">
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
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio / About (optional)</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell others a bit about yourself or your farm..."
                />
              </div>

              <button
                type="submit"
                className="btn"
                disabled={saving}
                style={{ marginTop: "1.5rem" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        <div className="card" style={{ marginTop: "2rem", maxWidth: "600px" }}>
          <div className="card-header">
            <h3>Account Information</h3>
          </div>
          <div className="card-body">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {user?.role === "farmer" ? "Farmer" : "Buyer"}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {user
                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                : "—"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
