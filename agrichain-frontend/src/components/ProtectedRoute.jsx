import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );

  if (!user) {
    return <Navigate to="/buyer/login" replace />; // ✅ better default
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}
