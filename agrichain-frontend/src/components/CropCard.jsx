import { Link } from "react-router-dom";

export default function CropCard({ crop }) {
  return (
    <div className="card crop-card">
      <img
        src={`http://localhost:5000/uploads/${crop.imageFilename || "placeholder.jpg"}`}
        alt={crop.name}
        className="crop-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/320x220?text=No+Image";
        }}
      />

      <div className="crop-info">
        <h3 className="crop-name">{crop.name}</h3>

        <p>
          {crop.description?.substring(0, 90) || "No description"}
          {crop.description?.length > 90 ? "..." : ""}
        </p>

        <p className="crop-price">₹{crop.price.toLocaleString()}</p>

        {/* ✅ FIXED: now goes to product page */}
        <Link to={`/buyer/product/${crop._id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
