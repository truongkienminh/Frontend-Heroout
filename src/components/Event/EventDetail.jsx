// src/pages/EventDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  DollarSign,
  Users,
  ArrowLeft,
} from "lucide-react";

import api from "../../services/axios"; // Your axios instance
import { useAuth } from "../../contexts/AuthContext"; // Import the useAuth hook

// Re-use date formatting helper
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    const optionsDate = { year: "numeric", month: "numeric", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: false };
    const formattedDate = date.toLocaleDateString("vi-VN", optionsDate);
    const formattedTime = date.toLocaleTimeString("vi-VN", optionsTime);
    return `${formattedDate}, ${formattedTime}`;
  } catch (e) {
    console.error("Error formatting date:", isoString, e);
    return "Invalid Date";
  }
};

// Re-use icon helper
const getLucideIcon = (type) => {
  switch (type) {
    case "calendar":
      return <Calendar className="w-5 h-5 text-gray-600" />;
    case "clock":
      return <Clock className="w-5 h-5 text-gray-600" />;
    case "map-pin":
      return <MapPin className="w-5 h-5 text-gray-600" />;
    case "users":
      return <Users className="w-5 h-5 text-gray-600" />;
    case "dollar":
      return <DollarSign className="w-5 h-5 text-gray-600" />;
    case "award":
      return <Award className="w-5 h-5 text-gray-600" />;
    default:
      return null;
  }
};

const EventDetail = () => {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const navigate = useNavigate(); // Hook for navigation
  const { user, isLoading: authLoading } = useAuth(); // Use the auth hook to get user info

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for registration
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'success', 'error', 'already_registered', 'needs_login'
  const [registrationMessage, setRegistrationMessage] = useState("");

  // Add a state to track if the user is already registered (optional, requires another API call)
  // For simplicity now, we'll rely on the registration API's response (like 409 Conflict)

  useEffect(() => {
    // Check if id is available and auth state is resolved (not loading)
    if (!id || authLoading) {
      // If auth is still loading, wait for it. If id is missing, show error immediately.
      if (!id && !authLoading) {
        // Only set error if not loading and id is missing
        setError(new Error("Không có ID sự kiện được cung cấp."));
        setIsLoading(false); // Stop main loading if ID is missing
      }
      return; // Exit useEffect if auth is loading or id is missing
    }

    const fetchEventDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/events/${id}`);

        if (response.data) {
          setEvent(response.data);
          // Optional: After fetching event, check if current user is already registered
          // You would need another API endpoint for this, e.g., /api/participations/check?eventId=...&accountId=...
          // If they are, setRegistrationStatus('already_registered') and hide the button.
        } else {
          setError(new Error("Không tìm thấy dữ liệu sự kiện."));
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching event detail:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError(new Error("Sự kiện không tồn tại."));
          } else {
            setError(
              new Error(`Lỗi khi tải chi tiết sự kiện: ${err.response.status}`)
            );
          }
        } else if (err.request) {
          setError(
            new Error(
              "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng."
            )
          );
        } else {
          setError(new Error(`Lỗi: ${err.message}`));
        }
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [id, authLoading]); // Depend on 'id' and 'authLoading'

  // Function to handle registration button click
  const handleRegisterClick = async () => {
    // Get accountId directly from the user object provided by useAuth
    const accountId = user?.id;

    if (!accountId) {
      // Handle case where user is not logged in or accountId is missing
      setRegistrationStatus("needs_login"); // Set specific status for needing login
      setRegistrationMessage("Bạn cần đăng nhập để đăng ký sự kiện.");
      // Optionally, redirect to login page, preserving the current location
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    setIsRegistering(true);
    setRegistrationStatus(null); // Clear previous status
    setRegistrationMessage(""); // Clear previous message

    try {
      const payload = {
        accountId: accountId, // Use the account ID from the auth context
        eventId: parseInt(id, 10), // Ensure eventId is the correct type if API expects number
        status: "REGISTERED", // Use the required status value
      };
      console.log("Attempting registration with payload:", payload); // Log payload for debugging

      // Assume the API returns 2xx status on success.
      // A 409 Conflict status might indicate already registered.
      const response = await api.post("/participations", payload);

      console.log("Registration API response:", response.data); // Log response

      // Assuming success if the request doesn't throw an error and status is 2xx
      setRegistrationStatus("success");
      setRegistrationMessage("Đăng ký sự kiện thành công!");
    } catch (err) {
      console.error("Error during event registration:", err);
      setRegistrationStatus("error");

      if (err.response) {
        if (err.response.status === 409) {
          // Assuming 409 is for already registered
          setRegistrationMessage("Bạn đã đăng ký sự kiện này trước đó.");
          setRegistrationStatus("already_registered");
        } else if (err.response.data && err.response.data.message) {
          setRegistrationMessage(
            `Lỗi khi đăng ký: ${err.response.data.message}`
          );
        } else {
          setRegistrationMessage(
            `Lỗi khi đăng ký sự kiện: ${err.response.status}`
          );
        }
      } else if (err.request) {
        setRegistrationMessage(
          "Không nhận được phản hồi từ máy chủ khi đăng ký."
        );
      } else {
        setRegistrationMessage(`Lỗi khi đăng ký: ${err.message}`);
      }
    } finally {
      setIsRegistering(false); // Always reset loading state
    }
  };

  // Combine loading states: component is loading if fetching event OR auth is loading
  const overallLoading = isLoading || authLoading;

  if (overallLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">
          Đang tải chi tiết sự kiện...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-lg mb-4">Lỗi: {error.message}</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-green-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!event) {
    // This case should ideally be caught by the error state now
    return (
      <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-gray-600 text-lg mb-4">
          Không tìm thấy sự kiện.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-green-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const startTimeFormatted = formatDateTime(event.startTime);
  const endTimeFormatted = formatDateTime(event.endTime);

  const startDate = startTimeFormatted.split(",")[0];
  const startTime = startTimeFormatted.split(",")[1]?.trim();
  const endTime = event.endTime ? endTimeFormatted.split(",")[1]?.trim() : null;

  // Determine if the registration button should be shown
  const showRegisterButton =
    !isRegistering &&
    registrationStatus !== "success" &&
    registrationStatus !== "already_registered";

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-green-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách sự kiện
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {event.title}
        </h1>

        <div className="mb-6 text-gray-700 leading-relaxed">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Mô tả</h3>
          <p>{event.description || "Không có mô tả."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Thời gian
            </h3>
            <div className="text-gray-700">
              <div className="flex items-center mb-2 gap-2">
                {getLucideIcon("calendar")}
                <span>
                  Ngày: <span className="font-medium">{startDate}</span>
                </span>
              </div>
              <div className="flex items-center mb-2 gap-2">
                {getLucideIcon("clock")}
                <span>
                  Thời gian: <span className="font-medium">{startTime}</span>{" "}
                  {endTime && `- ${endTime}`}
                </span>
              </div>
            </div>
          </div>

          {event.location && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Địa điểm
              </h3>
              <div className="flex items-center text-gray-700 gap-2">
                {getLucideIcon("map-pin")}
                <span>{event.location}</span>
              </div>
            </div>
          )}

          {/* Add more fields here based on potential future API expansion */}
        </div>

        {/* Registration Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Đăng ký tham gia
          </h3>

          {/* Registration Status Messages */}
          {registrationStatus && registrationMessage && (
            <div
              className={`p-3 mb-4 text-sm rounded-lg ${
                registrationStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : registrationStatus === "already_registered"
                  ? "bg-blue-100 text-blue-800"
                  : registrationStatus === "needs_login"
                  ? "bg-yellow-100 text-yellow-800" // Different style for login needed
                  : "bg-red-100 text-red-800" // Default error style
              }`}
              role="alert"
            >
              {registrationMessage}
            </div>
          )}

          {/* Registration Button */}
          {showRegisterButton && (
            <button
              onClick={handleRegisterClick}
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white rounded-md text-lg font-semibold
                  ${
                    isRegistering
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              {isRegistering ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
