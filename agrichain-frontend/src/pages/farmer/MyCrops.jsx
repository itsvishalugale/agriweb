import { useState, useEffect } from "react";
import api from "../../services/api";
import CropCard from "../../components/CropCard";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Modal state
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await api.get("/crops/my");
      setCrops(res.data);
    } catch {
      alert("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (cropId) => {
    const confirmDelete = window.confirm("Delete this crop?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/crops/${cropId}`);
      setCrops((prev) => prev.filter((c) => c._id !== cropId));
    } catch {
      alert("Delete failed");
    }
  };

  // ================= EDIT OPEN =================
  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      price: crop.price,
    });
  };

  // ================= EDIT SAVE =================
  const handleUpdate = async () => {
    if (!formData.name || !formData.price) {
      alert("All fields required");
      return;
    }

    try {
      const res = await api.put(`/crops/${editingCrop._id}`, {
        name: formData.name,
        price: Number(formData.price),
      });

      setCrops((prev) =>
        prev.map((c) => (c._id === editingCrop._id ? res.data.crop : c)),
      );

      setEditingCrop(null); // close modal
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>My Crops</h1>

        {loading ? (
          <p>Loading...</p>
        ) : crops.length === 0 ? (
          <p>No crops found</p>
        ) : (
          <div className="grid">
            {crops.map((crop) => (
              <CropCard
                key={crop._id}
                crop={crop}
                role="farmer"
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        {editingCrop && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Crop</h2>

              <input
                type="text"
                placeholder="Crop Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
                <button className="btn" onClick={handleUpdate}>
                  Save
                </button>

                <button
                  className="btn"
                  style={{ background: "gray" }}
                  onClick={() => setEditingCrop(null)}
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
