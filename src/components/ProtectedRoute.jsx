import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for non-authenticated users only (like login/register) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to home page or dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
