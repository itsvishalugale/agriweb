import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  /* same as above */
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function UploadCrop() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image");
      return;
    }

    setError("");
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("image", file);

    try {
      await api.post("/crops/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Crop uploaded successfully!");
      navigate("/farmer/mycrops");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>Upload New Crop</h1>

        <div className="card" style={{ maxWidth: "600px", margin: "2rem 0" }}>
          <div className="card-header">
            <h3>Crop Details</h3>
          </div>
          <div className="card-body">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Crop Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Organic Tomatoes"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Quality, variety, harvest date, etc..."
                />
              </div>

              <div className="form-group">
                <label>Price per unit (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn"
                disabled={loading || !file}
                style={{ marginTop: "1.5rem" }}
              >
                {loading ? "Uploading..." : "Upload & Mint Trace Record"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
