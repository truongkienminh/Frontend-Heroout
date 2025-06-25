import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const MemberProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is admin, staff, or consultant, redirect to dashboard
  if (
    isAuthenticated &&
    user &&
    (user.role === "ADMIN" ||
      user.role === "STAFF" ||
      user.role === "CONSULTANT")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default MemberProtectedRoute;
