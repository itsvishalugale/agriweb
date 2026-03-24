import { Link } from "react-router-dom";

export default function CropCard({ crop, role, onDelete, onEdit }) {
  // ✅ Safe checks
  const isOrdered = crop?.available === false;
  const imageUrl = crop?.imageFilename
    ? `http://localhost:5000/uploads/${crop.imageFilename}`
    : "https://via.placeholder.com/320x220?text=No+Image";

  return (
    <div className="card crop-card" style={{ position: "relative" }}>
      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={crop?.name || "Crop"}
        className="crop-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/320x220?text=No+Image";
        }}
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
          <Link to={`/buyer/product/${crop._id}`} className="btn">
            View Details
          </Link>
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
            {/* VIEW */}
            <Link to={`/farmer/product/${crop._id}`} className="btn">
              View
            </Link>

            {/* EDIT */}
            <button
              className="btn"
              style={{ background: "#3182ce" }}
              onClick={() => onEdit && onEdit(crop)}
            >
              Edit
            </button>

            {/* DELETE */}
            <button
              className="btn"
              style={{
                background: isOrdered ? "#a0aec0" : "#e53e3e",
                cursor: isOrdered ? "not-allowed" : "pointer",
              }}
              disabled={isOrdered}
              title={
                isOrdered
                  ? "Cannot delete: Crop already ordered"
                  : "Delete crop"
              }
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
