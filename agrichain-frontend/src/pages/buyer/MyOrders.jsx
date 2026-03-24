import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account", path: "/account" },
];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // ✅ loading per order

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  // ================= CANCEL ORDER =================
  const handleCancel = async (orderId) => {
    const confirm = window.confirm("Cancel this order?");
    if (!confirm) return;

    try {
      setUpdatingId(orderId);

      await api.delete(`/orders/${orderId}/cancel`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
    } catch {
      alert("Cancel failed");
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
      case "cancelled":
        return "#718096";
      default:
        return "#718096";
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>My Orders</h1>

        {loading && <p style={{ margin: "3rem 0" }}>Loading your orders...</p>}

        {error && (
          <p className="error-message" style={{ margin: "2rem 0" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <div style={{ margin: "3rem 0", textAlign: "center" }}>
                <p>You haven't placed any orders yet.</p>
                <Link to="/buyer/marketplace" className="btn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
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
                            marginBottom: "1rem",
                          }}
                        >
                          <div>
                            <h3>{order.crop?.name || "Crop"}</h3>
                            <small style={{ color: "#718096" }}>
                              Order ID:{" "}
                              {order._id.substring(0, 8).toUpperCase()}
                            </small>
                          </div>

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
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.75rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <div>
                            <strong>Farmer:</strong>
                            <br />
                            {order.farmer?.accountDetails?.name || "—"}
                          </div>

                          <div>
                            <strong>Quantity:</strong>
                            <br />
                            {order.quantity}
                          </div>

                          <div>
                            <strong>Total:</strong>
                            <br />₹{order.totalPrice?.toLocaleString()}
                          </div>

                          <div>
                            <strong>Date:</strong>
                            <br />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <Link
                            to={`/buyer/track/${order._id}`}
                            className="btn"
                          >
                            Track Order
                          </Link>

                          {/* CANCEL BUTTON */}
                          {(order.status === "pending" ||
                            order.status === "approved") && (
                            <button
                              className="btn"
                              style={{ background: "#e53e3e" }}
                              disabled={isUpdating}
                              onClick={() => handleCancel(order._id)}
                            >
                              {isUpdating ? "Cancelling..." : "Cancel"}
                            </button>
                          )}

                          {/* FINAL STATE */}
                          {(order.status === "shipped" ||
                            order.status === "delivered") && (
                            <span style={{ color: "#718096" }}>
                              Cannot cancel
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
