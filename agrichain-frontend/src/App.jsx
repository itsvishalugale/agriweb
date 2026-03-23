import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Auth
import FarmerLogin from "./pages/auth/FarmerLogin";
import BuyerLogin from "./pages/auth/BuyerLogin";
import FarmerRegister from "./pages/auth/FarmerRegister";
import BuyerRegister from "./pages/auth/BuyerRegister";

// Farmer
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import UploadCrop from "./pages/farmer/UploadCrop";
import MyCrops from "./pages/farmer/MyCrops";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import TraceCrop from "./pages/farmer/TraceCrop";

// Buyer
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Marketplace from "./pages/buyer/Marketplace";
import Cart from "./pages/buyer/Cart";
import MyOrders from "./pages/buyer/MyOrders";
import TrackOrder from "./pages/buyer/TrackOrder";
import BuyerProduct from "./pages/buyer/BuyerProduct";

// Shared
import Account from "./pages/Account";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Auth */}
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/farmer/register" element={<FarmerRegister />} />
          <Route path="/buyer/register" element={<BuyerRegister />} />
          {/* Farmer */}

          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/upload"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <UploadCrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/mycrops"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <MyCrops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/trace/:id"
            element={
              <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                <TraceCrop />
              </ProtectedRoute>
            }
          />
          {/* Buyer */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/marketplace"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/cart"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/track/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/product/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerProduct />
              </ProtectedRoute>
            }
          />
          {/* Shared */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/farmer/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
