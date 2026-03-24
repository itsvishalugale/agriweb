import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import "./FarmerProduct.css";

const farmerLinks = [
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function FarmerProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "" });

  useEffect(() => {
    fetchCrop();
  }, [id]);

  const fetchCrop = async () => {
    try {
      const res = await api.get(`/crops/${id}`);
      setCrop(res.data);
      setFormData({
        name: res.data.name,
        price: res.data.price,
      });
    } catch {
      alert("Failed to load crop");
    } finally {
      setLoading(false);
    }
  };

  const isOrdered = crop?.available === false;

  // DELETE
  const handleDelete = async () => {
    if (!window.confirm("Delete this crop?")) return;

    try {
      await api.delete(`/crops/${id}`);
      alert("Crop deleted");
      navigate("/farmer/mycrops");
    } catch {
      alert("Delete failed");
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const res = await api.put(`/crops/${id}`, {
        name: formData.name,
        price: Number(formData.price),
      });

      setCrop(res.data.crop);
      setEditing(false);
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!crop) return <p className="error">Crop not found</p>;

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>{crop.name}</h1>

        <div className="product-container">
          {/* IMAGE */}
          <div className="product-image">
            <img
              src={`http://localhost:5000/uploads/${crop.imageFilename}`}
              alt={crop.name}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image")
              }
            />
          </div>

          {/* DETAILS */}
          <div className="product-details">
            <p>
              <strong>Description:</strong> {crop.description}
            </p>
            <p>
              <strong>Price:</strong> ₹{crop.price}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={isOrdered ? "status-ordered" : "status-active"}>
                {isOrdered ? "Ordered" : "Available"}
              </span>
            </p>

            {/* ACTION BUTTONS */}
            <div className="actions">
              <button className="btn edit" onClick={() => setEditing(true)}>
                Edit
              </button>

              <button
                className="btn delete"
                disabled={isOrdered}
                onClick={handleDelete}
              >
                {isOrdered ? "Locked" : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editing && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Crop</h2>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Crop Name"
              />

              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Price"
              />

              <div className="modal-actions">
                <button className="btn" onClick={handleUpdate}>
                  Save
                </button>

                <button
                  className="btn cancel"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
