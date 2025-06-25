// src/pages/EventDetail.js
import { useEffect, useState } from "react";
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

  // State for user participation
  const [userParticipation, setUserParticipation] = useState(null);
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(false);

  // Function to check user's participation status using /api/participations
  const checkUserParticipation = async (eventId, accountId) => {
    if (!accountId || !eventId) {
      console.warn("Missing accountId or eventId:", { accountId, eventId });
      return;
    }

    setIsCheckingParticipation(true);
    try {
      const response = await api.get(`/participations`);
      console.log("Participation API response:", response.data);

      const parsedEventId = Number.parseInt(eventId, 10);
      const parsedAccountId = Number.parseInt(accountId, 10);

      const eventParticipations = response.data.filter(
        (participation) =>
          (participation.eventId === parsedEventId ||
            participation.eventId === eventId) &&
          (participation.accountId === parsedAccountId ||
            participation.accountId === accountId) &&
          ["REGISTERED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(
            participation.status
          )
      );

      if (eventParticipations.length > 0) {
        const participation = eventParticipations[0];
        console.log("Found participation:", participation);
        setUserParticipation(participation);

        if (
          ["REGISTERED", "CHECKED_IN", "CHECKED_OUT"].includes(
            participation.status
          )
        ) {
          setRegistrationStatus("already_registered");
          setRegistrationMessage(getStatusMessage(participation.status));
        } else if (participation.status === "CANCELLED") {
          setRegistrationStatus(null);
          setRegistrationMessage("");
        }
      } else {
        console.log(
          "No participation found for eventId:",
          eventId,
          "and accountId:",
          accountId
        );
        setUserParticipation(null);
        setRegistrationStatus(null);
        setRegistrationMessage("");
      }
    } catch (err) {
      console.error("Error checking user participation:", err);
      setUserParticipation(null);
      setRegistrationStatus(null);
      setRegistrationMessage("");
    } finally {
      setIsCheckingParticipation(false);
    }
  };

  // Helper function to get status message
  const getStatusMessage = (status) => {
    switch (status) {
      case "REGISTERED":
        return "Bạn đã đăng ký sự kiện này.";
      case "CHECKED_IN":
        return "Bạn đã check-in sự kiện này.";
      case "CHECKED_OUT":
        return "Bạn đã hoàn thành sự kiện này.";
      case "CANCELLED":
        return "Bạn đã hủy đăng ký sự kiện này.";
      default:
        return "Bạn đã đăng ký sự kiện này.";
    }
  };

  // useEffect to fetch event details and check participation
  useEffect(() => {
    if (!id || authLoading) {
      if (!id && !authLoading) {
        setError(new Error("Không có ID sự kiện được cung cấp."));
        setIsLoading(false);
      }
      return;
    }

    setUserParticipation(null);
    setRegistrationStatus(null);
    setRegistrationMessage("");

    const fetchEventDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/events/${id}`);

        if (response.data) {
          setEvent(response.data);

          if (user?.id) {
            await checkUserParticipation(id, user.id);
          }
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
  }, [id, authLoading, user?.id]);

  // Function to handle registration button click
  const handleRegisterClick = async () => {
    const accountId = user?.id;

    if (!accountId) {
      setRegistrationStatus("needs_login");
      setRegistrationMessage("Bạn cần đăng nhập để đăng ký sự kiện.");
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    setIsRegistering(true);
    setRegistrationStatus(null);
    setRegistrationMessage("");
    setUserParticipation(null); // Reset userParticipation khi bắt đầu đăng ký

    try {
      const payload = {
        accountId: accountId,
        eventId: Number.parseInt(id, 10),
        status: "REGISTERED",
      };
      console.log("Attempting registration with payload:", payload);

      const response = await api.post("/participations", payload);
      console.log("Registration API response:", response.data);

      setRegistrationStatus("success");
      setRegistrationMessage("Đăng ký sự kiện thành công!");

      await checkUserParticipation(id, accountId);
    } catch (err) {
      console.error("Error during event registration:", err);
      setRegistrationStatus("error");

      if (err.response) {
        if (err.response.status === 409) {
          setRegistrationMessage("Bạn đã đăng ký sự kiện này trước đó.");
          setRegistrationStatus("already_registered");
          await checkUserParticipation(id, accountId);
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
      setIsRegistering(false);
    }
  };

  // Combine loading states
  const overallLoading = isLoading || authLoading;

  // Logic to show registration button
  const showRegisterButton =
    !isRegistering &&
    !isCheckingParticipation &&
    registrationStatus !== "success" &&
    registrationStatus !== "already_registered" &&
    (!userParticipation || userParticipation.status === "CANCELLED");

  console.log("showRegisterButton check:", {
    isRegistering,
    isCheckingParticipation,
    registrationStatus,
    userParticipation,
    showRegisterButton,
  });

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
        </div>

        {/* Registration Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Đăng ký tham gia
          </h3>

          {/* Show loading state while checking participation */}
          {isCheckingParticipation && (
            <div className="p-3 mb-4 text-sm rounded-lg bg-gray-100 text-gray-600">
              Đang kiểm tra trạng thái đăng ký...
            </div>
          )}

          {/* Unified status message */}
          {(registrationStatus || userParticipation) && (
            <div
              className={`p-3 mb-4 text-sm rounded-lg ${
                registrationStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : registrationStatus === "already_registered" ||
                    (userParticipation &&
                      ["REGISTERED", "CHECKED_IN", "CHECKED_OUT"].includes(
                        userParticipation.status
                      ))
                  ? "bg-blue-100 text-blue-800"
                  : registrationStatus === "needs_login"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
              role="alert"
            >
              {registrationMessage ||
                (userParticipation &&
                  getStatusMessage(userParticipation.status)) ||
                "Lỗi không xác định"}
              {userParticipation &&
                userParticipation.status === "CHECKED_IN" &&
                userParticipation.checkInTime && (
                  <div className="mt-1 text-xs">
                    Thời gian check-in:{" "}
                    {formatDateTime(userParticipation.checkInTime)}
                  </div>
                )}
              {userParticipation &&
                userParticipation.status === "CHECKED_OUT" &&
                userParticipation.checkOutTime && (
                  <div className="mt-1 text-xs">
                    Thời gian check-out:{" "}
                    {formatDateTime(userParticipation.checkOutTime)}
                  </div>
                )}
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

          {/* Show re-register button for cancelled registrations */}
          {userParticipation &&
            userParticipation.status === "CANCELLED" &&
            !isRegistering && (
              <button
                onClick={handleRegisterClick}
                disabled={isRegistering}
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Đăng ký lại
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
