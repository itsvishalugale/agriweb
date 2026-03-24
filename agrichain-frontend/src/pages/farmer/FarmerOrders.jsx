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
  const [updatingId, setUpdatingId] = useState(null); // ✅ track loading per order

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS UPDATE =================
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await api.put(`/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ed8936";
      case "approved":
        return "#3182ce";
      case "shipped":
        return "#805ad5";
      case "delivered":
        return "#38a169";
      case "rejected":
        return "#e53e3e";
      default:
        return "#718096";
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
            {orders.map((order) => {
              const isUpdating = updatingId === order._id;

              return (
                <div key={order._id} className="card">
                  <div className="card-body">
                    {/* HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3>{order.crop?.name || "Crop"}</h3>

                      <span
                        style={{
                          background: getStatusColor(order.status),
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <p>Buyer: {order.buyer?.accountDetails?.name}</p>
                    <p>Email: {order.buyer?.email}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Total: ₹{order.totalPrice}</p>

                    <p style={{ fontSize: "0.85rem", color: "#718096" }}>
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* PENDING */}
                      {order.status === "pending" && (
                        <>
                          <button
                            className="btn"
                            disabled={isUpdating}
                            onClick={() => updateStatus(order._id, "approved")}
                          >
                            {isUpdating ? "Processing..." : "Approve"}
                          </button>

                          <button
                            className="btn"
                            style={{ background: "#e53e3e" }}
                            disabled={isUpdating}
                            onClick={() => updateStatus(order._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* APPROVED */}
                      {order.status === "approved" && (
                        <button
                          className="btn"
                          disabled={isUpdating}
                          onClick={() => updateStatus(order._id, "shipped")}
                        >
                          Mark as Shipped
                        </button>
                      )}

                      {/* SHIPPED */}
                      {order.status === "shipped" && (
                        <button
                          className="btn"
                          disabled={isUpdating}
                          onClick={() => updateStatus(order._id, "delivered")}
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {/* FINAL STATES */}
                      {(order.status === "delivered" ||
                        order.status === "rejected") && (
                        <span style={{ color: "#718096", fontSize: "0.9rem" }}>
                          No further actions
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
