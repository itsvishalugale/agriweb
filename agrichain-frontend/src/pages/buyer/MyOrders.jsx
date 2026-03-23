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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
                <Link
                  to="/buyer/marketplace"
                  className="btn"
                  style={{ marginTop: "1.5rem" }}
                >
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
                {orders.map((order) => (
                  <div key={order._id} className="card">
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <h3 style={{ marginBottom: "0.35rem" }}>
                            {order.crop?.name || "Unnamed Crop"}
                          </h3>
                          <small style={{ color: "#718096" }}>
                            Order ID: {order._id.substring(0, 8).toUpperCase()}
                          </small>
                        </div>
                        <span
                          className={`status-${order.status}`}
                          style={{ fontWeight: 600 }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.75rem 1.5rem",
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
                          {order.quantity} unit{order.quantity > 1 ? "s" : ""}
                        </div>
                        <div>
                          <strong>Total Amount:</strong>
                          <br />₹{order.totalPrice?.toLocaleString() || "—"}
                        </div>
                        <div>
                          <strong>Placed on:</strong>
                          <br />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/buyer/track/${order._id}`}
                        className="btn"
                        style={{
                          fontSize: "0.95rem",
                          padding: "0.6rem 1.2rem",
                        }}
                      >
                        View Trace & Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
