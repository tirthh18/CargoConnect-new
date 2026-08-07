import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import UserDashboard from "./pages/user/Dashboard";
import PlaceOrder from "./pages/user/PlaceOrder";
import OrderHistory from "./pages/user/OrderHistory";
import AboutUs from "./pages/user/AboutUs";
import AdminDashboard from "./pages/admin/Dashboard";
import FindRoutes from "./pages/admin/FindRoutes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route path="/user" element={<ProtectedRoute role="user"/>}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="placeorder" element={<PlaceOrder />} />
        <Route path="orders-history" element={<OrderHistory />} />
        <Route path="about-us" element={<AboutUs />} />
      </Route>


      <Route path="/admin"element={<ProtectedRoute role="admin"></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="routes" element={<FindRoutes />} />

        {/* <Route path="users" element={<Users />} /> */}
      </Route> 

      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
