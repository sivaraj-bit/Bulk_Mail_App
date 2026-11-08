
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const location = useLocation();

    // Check authentication
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Only Admin can access Create Admin
    if (
        location.pathname === "/create-admin" &&
        role !== "Admin"
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
