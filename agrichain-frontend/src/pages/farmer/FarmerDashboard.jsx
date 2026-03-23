import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload New Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "My Orders", path: "/farmer/orders" },
  { label: "Account Settings", path: "/account" },
];

export default function FarmerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>Welcome back, {user?.accountDetails?.name || "Farmer"}!</h1>
        <p style={{ margin: "1rem 0 2rem", color: "#718096" }}>
          Manage your crops, view orders, and track traceability from here.
        </p>

        <div className="grid" style={{ marginTop: "2rem" }}>
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-body">
              <p style={{ marginBottom: "1.5rem" }}>
                Start by uploading a new crop or checking your recent orders.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="/farmer/upload" className="btn">
                  Upload Crop
                </a>
                <a
                  href="/farmer/mycrops"
                  className="btn"
                  style={{ background: "#2b6cb0" }}
                >
                  View My Crops
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              <p>No recent activity to show yet.</p>
              <small style={{ color: "#718096" }}>
                Orders and crop updates will appear here.
              </small>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
