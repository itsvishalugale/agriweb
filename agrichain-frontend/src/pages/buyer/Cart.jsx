import { useState } from "react";
import Sidebar from "../../components/Sidebar";

const buyerLinks = [
  /* same as above */
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "My Cart", path: "/buyer/cart" },
  { label: "My Orders", path: "/buyer/orders" },
  { label: "Account", path: "/account" },
];

export default function Cart() {
  const [cart] = useState([]); // ← replace with real cart logic

  return (
    <div className="dashboard-layout">
      <Sidebar links={buyerLinks} />

      <main className="main-content">
        <h1>My Cart</h1>

        {cart.length === 0 ? (
          <div style={{ margin: "3rem 0", textAlign: "center" }}>
            <p>Your cart is empty.</p>
            <a
              href="/buyer/marketplace"
              className="btn"
              style={{ marginTop: "1.5rem" }}
            >
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div>
            {/* list cart items */}
            <button className="btn" style={{ marginTop: "2rem" }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
