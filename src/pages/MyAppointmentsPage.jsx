import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Video,
  ExternalLink,
  RefreshCw,
  Mail,
  XCircle,
} from "lucide-react";
import ApiService from "../services/apiService";
import { alertSuccess, alertFail } from "../hooks/useNotification";
import Breadcrumb from "../components/Breadcrumb";
import Swal from "sweetalert2";

const MyAppointmentsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState({});
  const [cancelling, setCancelling] = useState({});
  const [error, setError] = useState(null);

  // Fetch user's appointments
  const fetchAppointments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getMemberAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAppointments();
    }
  }, [isAuthenticated, user?.id]);

  // Handle check-in
  const handleCheckIn = async (appointmentId) => {
    try {
      setCheckingIn((prev) => ({ ...prev, [appointmentId]: true }));

      const response = await ApiService.checkInAppointment(appointmentId);

      if (response.checkedIn && response.meetingLink) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId
              ? {
                  ...apt,
                  checked_in: true,
                  meeting_link: response.meetingLink,
                }
              : apt
          )
        );

        alertSuccess("Check-in thành công! Link tham gia đã được tạo.");

        if (
          window.confirm("Bạn có muốn mở link tham gia ngay bây giờ không?")
        ) {
          window.open(response.meetingLink, "_blank");
        }
      }
    } catch (err) {
      alertFail(err.message || "Có lỗi xảy ra khi check-in");
      console.error("Check-in error:", err);
    } finally {
      setCheckingIn((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn hủy?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy lịch",
      cancelButtonText: "Giữ lại",
    });

    if (!result.isConfirmed) return;

    try {
      setCancelling((prev) => ({ ...prev, [appointmentId]: true }));

      const response = await ApiService.updateAppointmentStatus(
        appointmentId,
        "CANCELLED"
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "CANCELLED" } : apt
        )
      );

      alertSuccess("Hủy lịch hẹn thành công!");
    } catch (err) {
      alertFail(err.message || "Có lỗi xảy ra khi hủy lịch hẹn");
      console.error("Cancel appointment error:", err);
    } finally {
      setCancelling((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  // Format time helper
  const formatTime = (timeString) => {
    try {
      const parts = timeString.split(":");
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`; // Trả về "HH:mm"
      }
      console.warn("Định dạng thời gian không hợp lệ:", timeString);
      return timeString || "Chưa có thông tin"; // Trả về chuỗi gốc hoặc thông báo mặc định
    } catch (error) {
      console.error("Lỗi định dạng thời gian:", error);
      return timeString || "Chưa có thông tin"; // Trả về chuỗi gốc hoặc thông báo mặc định
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case "BOOKED":
        return {
          color: "bg-blue-100 text-blue-800",
          text: "Đã đặt",
          icon: Calendar,
        };
      case "CONSULTED":
        return {
          color: "bg-green-100 text-green-800",
          text: "Đã tư vấn",
          icon: CheckCircle,
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800",
          text: "Đã hủy",
          icon: AlertCircle,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          text: status,
          icon: AlertCircle,
        };
    }
  };

  // Check if appointment is today and within time range for check-in
  const canCheckIn = (appointment) => {
    if (appointment.status !== "BOOKED" || appointment.checked_in) {
      return false;
    }

    const appointmentDate = new Date(
      appointment.appointment_date || appointment.schedule?.date
    );
    const today = new Date();

    const isToday = appointmentDate.toDateString() === today.toDateString();

    if (!isToday) return false;

    const slotStart = appointment.schedule?.slot?.slot_start;
    if (!slotStart) return false;

    const [hours, minutes] = slotStart.split(":").map(Number);
    const appointmentTime = new Date(today);
    appointmentTime.setHours(hours, minutes, 0, 0);

    const currentTime = new Date();
    const timeDiff = appointmentTime.getTime() - currentTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return minutesDiff <= 15 && minutesDiff >= -60;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Vui lòng đăng nhập
          </h1>
          <p className="text-gray-600">
            Bạn cần đăng nhập để xem lịch hẹn của mình
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Lịch hẹn của tôi" },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Lịch hẹn của tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi các buổi tư vấn của bạn
              </p>
            </div>
            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải lịch hẹn...</p>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-red-500 mb-4">
                <AlertCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchAppointments}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : appointments.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chưa có lịch hẹn nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa đặt lịch tư vấn nào. Hãy đặt lịch với chuyên gia để
                nhận được sự hỗ trợ tốt nhất.
              </p>
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Đặt lịch tư vấn
              </a>
            </div>
          ) : (
            /* Appointments List */
            <div className="space-y-6">
              {appointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment.status);
                const StatusIcon = statusInfo.icon;
                const canCheckInNow = canCheckIn(appointment);

                return (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Appointment Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Tư vấn với{" "}
                                {appointment.consultant?.name || "Chuyên gia"}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {statusInfo.text}
                                </span>
                                {appointment.checked_in && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3" />
                                    Đã check-in
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {/* Date & Time */}
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                                <span className="font-medium">
                                  {formatDate(
                                    appointment.appointment_date ||
                                      appointment.schedule?.date
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                                <span>
                                  {formatTime(
                                    appointment.schedule?.slot?.slot_start
                                  ) || "Chưa có thông tin"}{" "}
                                  -{" "}
                                  {formatTime(
                                    appointment.schedule?.slot?.slot_end
                                  ) || "Chưa có thông tin"}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                                <span>Tư vấn trực tuyến</span>
                              </div>
                            </div>

                            {/* Consultant Info */}
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-700">
                                <User className="w-4 h-4 mr-2 text-emerald-600" />
                                <span>
                                  {appointment.consultant?.name ||
                                    "Đang cập nhật"}
                                </span>
                              </div>
                              {appointment.consultant?.field_of_study && (
                                <div className="flex items-center text-gray-700">
                                  <div className="w-4 h-4 mr-2" />
                                  <span className="text-sm text-emerald-600">
                                    {appointment.consultant.field_of_study}
                                  </span>
                                </div>
                              )}
                              {appointment.consultant?.email && (
                                <div className="flex items-center text-gray-700">
                                  <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                                  <span className="text-sm">
                                    {appointment.consultant.email}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {appointment.description && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 mb-1">
                                Ghi chú:
                              </h4>
                              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                {appointment.description}
                              </p>
                            </div>
                          )}

                          {/* Meeting Link - Only show for BOOKED appointments */}
                          {appointment.meeting_link &&
                            appointment.status === "BOOKED" && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  Link tham gia:
                                </h4>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <Video className="w-4 h-4 text-blue-600" />
                                  <a
                                    href={appointment.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                  >
                                    Tham gia cuộc họp
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}

                          {/* Completed consultation message */}
                          {appointment.status === "CONSULTED" && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-700 font-medium">
                                  Buổi tư vấn đã hoàn thành
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:w-48">
                          {/* Check-in Button - Only for BOOKED appointments */}
                          {appointment.status === "BOOKED" &&
                            !appointment.checked_in && (
                              <button
                                onClick={() => handleCheckIn(appointment.id)}
                                disabled={
                                  !canCheckInNow || checkingIn[appointment.id]
                                }
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                  canCheckInNow
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                                title={
                                  !canCheckInNow
                                    ? "Chỉ có thể check-in trong vòng 15 phút trước giờ hẹn"
                                    : "Check-in để lấy link tham gia"
                                }
                              >
                                {checkingIn[appointment.id] ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Đang xử lý...
                                  </>
                                ) : (
                                  <>
                                    <Video className="w-4 h-4" />
                                    Check-in
                                  </>
                                )}
                              </button>
                            )}

                          {/* Cancel Button - Only for BOOKED appointments */}
                          {appointment.status === "BOOKED" &&
                            !appointment.checked_in && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appointment.id)
                                }
                                disabled={cancelling[appointment.id]}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                  cancelling[appointment.id]
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                                title="Hủy lịch hẹn này"
                              >
                                {cancelling[appointment.id] ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Đang xử lý...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    Hủy lịch
                                  </>
                                )}
                              </button>
                            )}

                          {/* Join Meeting Button - Only for BOOKED appointments with meeting link */}
                          {appointment.meeting_link &&
                            appointment.status === "BOOKED" && (
                              <a
                                href={appointment.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                              >
                                <Video className="w-4 h-4" />
                                Tham gia
                              </a>
                            )}

                          {/* Appointment Details */}
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>ID: #{appointment.id}</p>
                            <p>
                              Tạo:{" "}
                              {new Date(
                                appointment.create_at
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
