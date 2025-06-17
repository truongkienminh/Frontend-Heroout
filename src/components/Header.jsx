import React, { useState, useEffect } from "react"; // Import useEffect and useState
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  Bell,
  // Assume lucide-react is installed: npm install lucide-react
} from "lucide-react";
import HeroOutLogo from "../assets/heroout.jpg";
import api from "../services/axios"; // Import your configured axios instance
// import { toast } from 'react-toastify'; // Optional: If you want to show fetch errors

// Remove the mock getCurrentUser function
// const getCurrentUser = () => {
//   // Giả lập user đã đăng nhập
//   return {
//     id: 1,
//     name: "Nguyễn Văn An",
//     email: "nguyenvanan@email.com",
//     role: "Member",
//     profile_pic: null,
//   };
// };

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null); // State to hold fetched user data
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  // Use useEffect to fetch user data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    // *** IMPORTANT ASSUMPTION: userId is stored in localStorage during login ***
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      const fetchUserData = async () => {
        try {
          setIsLoading(true); // Start loading
          // Call the API endpoint with the user ID
          const response = await api.get(`/api/account/${id}`, {
            headers: {
              // Include the Authorization header with the token
              Authorization: `Bearer ${token}`, // Assuming Bearer token scheme
            },
          });
          setCurrentUserData(response.data); // Set the fetched user data
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          // Optionally handle specific errors, e.g., token expired (401)
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            // Token is invalid or expired, clear storage and force re-login
            localStorage.removeItem("token");
            localStorage.removeItem("id"); // Clear the userId too
            setCurrentUserData(null); // Clear state
            // toast.error("Your session has expired. Please login again."); // Optional toast
            // navigate('/login'); // Optionally redirect to login immediately
          }
          // Clear user data on any fetch error to prevent displaying stale/incorrect info
          setCurrentUserData(null);
        } finally {
          setIsLoading(false); // Stop loading regardless of success or failure
        }
      };

      fetchUserData(); // Execute the fetch function
    } else {
      // No token or userId, user is not logged in
      setIsLoading(false); // Not loading user data
      setCurrentUserData(null); // Ensure user data state is null
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id"); // Also remove the stored userId
    setCurrentUserData(null); // Clear the user data state
    navigate("/login"); // Use navigate hook for redirection
  };

  const getInitials = (name) => {
    // Handle case where name might be undefined or null while loading
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img
                src={HeroOutLogo}
                alt="Herodout Logo"
                style={{ width: 100, height: 80, objectFit: "contain" }}
              />
            </Link>
          </div>

          {/* Navigation links - remain the same */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/blogs"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/courses"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Khóa học
            </Link>
            <Link
              to="/event"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sự kiện
            </Link>
            <Link
              to="/consultation"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Tư vấn
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {/* Conditional rendering based on loading state and user data */}
            {isLoading ? (
              // Show a loading indicator or null while fetching
              <div className="text-gray-500">Loading...</div> // Replace with a spinner or skeleton if desired
            ) : currentUserData ? (
              // User is logged in and data is available
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {currentUserData.profile_pic ? ( // Use currentUserData
                    <img
                      src={currentUserData.profile_pic || "/placeholder.svg"}
                      alt={currentUserData.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {getInitials(currentUserData.name)}{" "}
                      {/* Use currentUserData */}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {currentUserData.name} {/* Use currentUserData */}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUserData.role}
                    </p>{" "}
                    {/* Use currentUserData */}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {currentUserData.profile_pic ? ( // Use currentUserData
                          <img
                            src={
                              currentUserData.profile_pic || "/placeholder.svg"
                            }
                            alt={currentUserData.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">
                            {getInitials(currentUserData.name)}{" "}
                            {/* Use currentUserData */}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {currentUserData.name} {/* Use currentUserData */}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentUserData.email} {/* Use currentUserData */}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile" // Consider making this dynamic like `/profile/${currentUserData.id}`
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Hồ sơ cá nhân
                      </Link>

                      <Link
                        to="/my-appointments"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Lịch hẹn của tôi
                      </Link>

                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Thông báo
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Cài đặt
                      </Link>

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md font-medium transition-colors"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
