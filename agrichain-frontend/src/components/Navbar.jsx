import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        background: "#2f855a",
        color: "white",
        padding: "1rem 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          AgriChain Trace
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                style={{ color: "white", textDecoration: "none" }}
              >
                Dashboard
              </Link>
              <Link
                to="/account"
                style={{ color: "white", textDecoration: "none" }}
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/farmer/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                Farmer
              </Link>
              <Link
                to="/buyer/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                Buyer
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
