import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function BuyerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>Welcome, {user?.accountDetails?.name || "Buyer"}!</h1>
        <p style={{ margin: "1rem 0 2rem", color: "#718096" }}>
          Discover fresh, traceable produce directly from farmers across India.
        </p>

        <div className="grid" style={{ marginTop: "2rem" }}>
          <div className="card">
            <div className="card-header">
              <h3>Quick Start</h3>
            </div>
            <div className="card-body">
              <p style={{ marginBottom: "1.5rem" }}>
                Browse the marketplace or check your recent purchases.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="/buyer/marketplace" className="btn">
                  Explore Marketplace
                </a>
                <a
                  href="/buyer/orders"
                  className="btn"
                  style={{ background: "#2b6cb0" }}
                >
                  View My Orders
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Your Activity</h3>
            </div>
            <div className="card-body">
              <p>No recent purchases yet.</p>
              <small style={{ color: "#718096" }}>
                When you place orders, they will appear here along with
                traceability info.
              </small>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Why AgriChain Trace?</h3>
            </div>
            <div className="card-body">
              <ul style={{ paddingLeft: "1.2rem", lineHeight: "1.7" }}>
                <li>Full traceability from farm to your table</li>
                <li>Direct connection with verified farmers</li>
                <li>QR-based crop history verification</li>
                <li>Secure & transparent transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
