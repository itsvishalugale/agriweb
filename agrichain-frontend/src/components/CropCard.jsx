import { Link } from "react-router-dom";

export default function CropCard({ crop, role, onDelete, onEdit }) {
  const isOrdered = crop?.available === false;

  const imageUrl = crop?.imageFilename
    ? `http://localhost:5000/uploads/${crop.imageFilename}`
    : "https://via.placeholder.com/320x220?text=No+Image";

  // ================= QUICK BUY =================
  const handleQuickBuy = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cropId: crop._id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error();

      alert("✅ Order placed successfully!");
    } catch {
      alert("❌ Order failed");
    }
  };

  return (
    <div className="card crop-card" style={{ position: "relative" }}>
      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={crop?.name || "Crop"}
        className="crop-image"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/320x220?text=No+Image")
        }
      />

      {/* CONTENT */}
      <div className="crop-info">
        <h3 className="crop-name">{crop?.name || "Unnamed Crop"}</h3>

        <p>
          {crop?.description
            ? crop.description.substring(0, 90) +
              (crop.description.length > 90 ? "..." : "")
            : "No description available"}
        </p>

        <p className="crop-price">
          ₹{crop?.price ? crop.price.toLocaleString() : "0"}
        </p>

        {/* ================= BUYER ================= */}
        {role === "buyer" && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link to={`/buyer/product/${crop._id}`} className="btn">
              View Details
            </Link>

            <button
              className="btn"
              style={{ background: "#38a169" }}
              onClick={handleQuickBuy}
            >
              Quick Buy
            </button>
          </div>
        )}

        {/* ================= FARMER ================= */}
        {role === "farmer" && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <Link to={`/farmer/product/${crop._id}`} className="btn">
              View
            </Link>

            <button
              className="btn"
              style={{ background: "#3182ce" }}
              onClick={() => onEdit && onEdit(crop)}
            >
              Edit
            </button>

            <button
              className="btn"
              style={{
                background: isOrdered ? "#a0aec0" : "#e53e3e",
                cursor: isOrdered ? "not-allowed" : "pointer",
              }}
              disabled={isOrdered}
              onClick={() => !isOrdered && onDelete && onDelete(crop._id)}
            >
              {isOrdered ? "Locked" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
