import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account", path: "/account" },
];

// ✅ Order steps
const steps = ["pending", "approved", "shipped", "delivered"];

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [traceHistory, setTraceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.get("/orders/my");
        const foundOrder = ordersRes.data.find((o) => o._id === id);
        if (!foundOrder) throw new Error("Order not found");

        setOrder(foundOrder);

        if (foundOrder.crop?._id) {
          const traceRes = await api.get(`/crops/trace/${foundOrder.crop._id}`);
          setTraceHistory(traceRes.data.traceHistory || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="main-content">Loading...</div>;

  if (error || !order) {
    return (
      <div className="main-content">
        <h2>Error</h2>
        <p>{error || "Order not found"}</p>
      </div>
    );
  }

  // ✅ Current progress index
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>Track Order #{order._id.substring(0, 8).toUpperCase()}</h1>

        {/* ✅ TRACKING PROGRESS UI */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="card-header">
            <h3>Order Progress</h3>
          </div>

          <div className="card-body">
            <div className="tracking-container">
              {steps.map((step, index) => (
                <div key={step} className="step">
                  <div
                    className={`circle ${
                      index <= currentStepIndex ? "active" : ""
                    }`}
                  >
                    {index <= currentStepIndex ? "✓" : ""}
                  </div>

                  <p className={index <= currentStepIndex ? "active-text" : ""}>
                    {step.toUpperCase()}
                  </p>

                  {index !== steps.length - 1 && (
                    <div
                      className={`line ${
                        index < currentStepIndex ? "active-line" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            marginTop: "2rem",
          }}
        >
          {/* LEFT SIDE */}
          <div style={{ flex: 1, minWidth: "340px" }}>
            <div className="card">
              <div className="card-header">
                <h3>Order Summary</h3>
              </div>
              <div className="card-body">
                <p>
                  <strong>Crop:</strong> {order.crop?.name || "—"}
                </p>
                <p>
                  <strong>Farmer:</strong>{" "}
                  {order.farmer?.accountDetails?.name || "—"}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.totalPrice?.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Placed:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* IMAGE */}
            {order.crop?.imageFilename && (
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <div className="card-header">
                  <h3>Crop Image</h3>
                </div>
                <img
                  src={`http://localhost:5000/uploads/${order.crop.imageFilename}`}
                  alt={order.crop.name}
                  style={{ width: "100%", display: "block" }}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image")
                  }
                />
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ flex: 2, minWidth: "340px" }}>
            <div className="card">
              <div className="card-header">
                <h3>Trace History</h3>
              </div>
              <div className="card-body">
                {traceHistory.length === 0 ? (
                  <p>No trace events yet.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {traceHistory.map((event, i) => (
                      <li
                        key={i}
                        style={{
                          padding: "1rem 0",
                          borderBottom:
                            i < traceHistory.length - 1
                              ? "1px solid #e2e8f0"
                              : "none",
                        }}
                      >
                        <strong>{event.event}</strong>
                        <br />
                        <small style={{ color: "#718096" }}>
                          {new Date(event.timestamp).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
