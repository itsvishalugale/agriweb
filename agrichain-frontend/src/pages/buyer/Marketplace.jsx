import { useState, useEffect } from "react";
import api from "../../services/api";
import CropCard from "../../components/CropCard";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account", path: "/account" },
];

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await api.get("/crops/available");
      setCrops(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>Crop Marketplace</h1>
        <p style={{ marginBottom: "2rem", color: "#718096" }}>
          Browse fresh produce directly from farmers with full traceability.
        </p>

        {loading ? (
          <p>Loading available crops...</p>
        ) : crops.length === 0 ? (
          <p>No crops available at the moment.</p>
        ) : (
          <div className="grid">
            {crops.map((crop) => (
              <CropCard
                key={crop._id}
                crop={crop}
                role="buyer" // ✅ IMPORTANT FIX
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
