import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const farmerLinks = [
  { label: "Dashboard", path: "/farmer/dashboard" },
  { label: "Upload Crop", path: "/farmer/upload" },
  { label: "My Crops", path: "/farmer/mycrops" },
  { label: "Orders", path: "/farmer/orders" },
  { label: "Account", path: "/account" },
];

export default function TraceCrop() {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [trace, setTrace] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropRes, traceRes] = await Promise.all([
          api.get(`/crops/${id}`),
          api.get(`/crops/trace/${id}`),
        ]);
        setCrop(cropRes.data);
        setTrace(traceRes.data.traceHistory || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading trace...</div>;

  if (!crop) return <div>Crop not found</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar links={farmerLinks} />

      <main className="main-content">
        <h1>Trace — {crop.name}</h1>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <img
              src={`http://localhost:5000/uploads/${crop.imageFilename}`}
              alt={crop.name}
              style={{ width: "100%", borderRadius: "8px" }}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/400?text=No+Image")
              }
            />
          </div>

          <div style={{ flex: 2 }}>
            <div className="card">
              <div className="card-header">
                <h3>Trace History</h3>
              </div>
              <div className="card-body">
                {trace.length === 0 ? (
                  <p>No events yet.</p>
                ) : (
                  <ul style={{ listStyle: "none" }}>
                    {trace.map((event, i) => (
                      <li
                        key={i}
                        style={{
                          padding: "0.75rem 0",
                          borderBottom:
                            i < trace.length - 1 ? "1px solid #eee" : "none",
                        }}
                      >
                        <strong>{event.event}</strong>
                        <br />
                        <small>
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
