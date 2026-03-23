import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account", path: "/account" },
];

export default function BuyerProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await api.get(`/crops/${id}`);
        setCrop(res.data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [id]);

  const handleOrder = async () => {
    try {
      const res = await api.post("/orders/place", {
        // ✅ FIXED
        cropId: crop._id,
        quantity: 1,
      });

      alert("Order placed successfully!");
      navigate(`/buyer/track/${res.data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;
  if (error || !crop)
    return <div className="main-content">{error || "Product not found"}</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>{crop.name}</h1>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <img
              src={`http://localhost:5000/uploads/${crop.imageFilename}`}
              alt={crop.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>

          <div style={{ flex: 2 }}>
            <div className="card">
              <div className="card-body">
                <p>
                  <strong>Description:</strong> {crop.description}
                </p>
                <p>
                  <strong>Price:</strong> ₹{crop.price}
                </p>

                <button className="btn" onClick={handleOrder}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
