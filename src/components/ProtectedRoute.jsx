import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireStaffRole = false,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If requireStaffRole is true, check for admin/staff/consultant roles
  if (requireStaffRole) {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "STAFF" &&
        user.role !== "CONSULTANT")
    ) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  // For routes that don't require auth (like login, register)
  if (!requireAuth) {
    if (isAuthenticated && user) {
      // If user is admin/staff/consultant, redirect to dashboard
      if (
        user.role === "ADMIN" ||
        user.role === "STAFF" ||
        user.role === "CONSULTANT"
      ) {
        return <Navigate to="/dashboard" replace />;
      }
      // If user is member, redirect to home
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // For routes that require auth
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
