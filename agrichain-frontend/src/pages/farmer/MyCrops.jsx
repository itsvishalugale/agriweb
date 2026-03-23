import { useState, useEffect } from "react";
import api from "../../services/api";
import CropCard from "../../components/CropCard";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  /* same */
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get("/crops/my");
        setCrops(res.data);
      } catch (err) {
        setError("Failed to load your crops");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>My Crops</h1>

        {loading && <p>Loading your crops...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            {crops.length === 0 ? (
              <p style={{ margin: "2rem 0", color: "#718096" }}>
                You haven't uploaded any crops yet.
              </p>
            ) : (
              <div className="grid">
                {crops.map((crop) => (
                  <CropCard key={crop._id} crop={crop} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
