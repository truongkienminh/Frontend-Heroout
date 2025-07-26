import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";
import { decodeJWT, isTokenExpired } from "../utils/jwtUtils";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("userData");

      if (!token) {
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired, logging out...");
        logout();
        setLoading(false);
        return;
      }

      // If we have stored user data, use it
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }

      // If no stored user data, try to get from API using user ID from token
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.userId) {
        try {
          const response = await api.get(`account/${decodedToken.userId}`);
          if (response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem("userData", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Failed to get user info from API:", error);
          logout();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("login", credentials);
      const { token, ...userData } = response.data;

      if (!token) {
        return {
          success: false,
          error: "Token không được trả về từ server",
        };
      }

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      // Set user data (excluding token)
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      const rawMessage =
        error.response?.data?.message || error.response?.data || "";
      const normalized = rawMessage.toLowerCase();

      let errorMessage = "Đăng nhập thất bại";

      // Kiểm tra nếu có từ khóa 'vô hiệu hóa'
      if (
        normalized.includes("vô hiệu hóa") ||
        normalized.includes("inactive")
      ) {
        errorMessage =
          "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("register", userData);
      const newUserData = response.data;
      return { success: true, user: newUserData };
    } catch (error) {
      console.error("Registration failed:", error);

      return {
        success: false,

        error: error.response?.data || "Đăng ký thất bại. Vui lòng thử lại.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
