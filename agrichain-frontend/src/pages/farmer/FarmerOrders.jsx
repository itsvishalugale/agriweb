import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>My Orders (Received)</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders received yet.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div className="card-body">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h3>{order.crop?.name}</h3>
                    <span className={`status-${order.status}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <p>Buyer: {order.buyer?.accountDetails?.name}</p>
                  <p>Email: {order.buyer?.email}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total: ₹{order.totalPrice}</p>

                  <p style={{ fontSize: "0.9rem", color: "#718096" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {order.status === "pending" && (
                      <>
                        <button
                          className="btn"
                          onClick={() => updateStatus(order._id, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          className="btn"
                          style={{ background: "red" }}
                          onClick={() => updateStatus(order._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === "approved" && (
                      <button
                        className="btn"
                        onClick={() => updateStatus(order._id, "shipped")}
                      >
                        Ship
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button
                        className="btn"
                        onClick={() => updateStatus(order._id, "delivered")}
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
