import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import {
  CheckCircle,
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  User,
  Clock,
  Lock,
} from "lucide-react";
import GoogleMeetInfo from "../components/GoogleMeetInfo";
import ApiService from "../services/apiService";
import { alertFail } from "../hooks/useNotification";

const ConsultantDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin chuyên gia
        const consultantData = await ApiService.getConsultant(id);
        console.log("Consultant Data:", consultantData);
        setConsultant(consultantData);
        setError(null);

        // Lấy lịch hẹn của chuyên gia
        try {
          const consultantSchedules = await ApiService.getConsultantSchedules(
            consultantData.consultant_id
          );
          console.log("Consultant Schedules:", consultantSchedules);
          // Lọc bỏ các lịch có slot không hợp lệ
          const validSchedules = consultantSchedules.filter((schedule) => {
            const isValid =
              schedule.slot &&
              schedule.slot.slotStart &&
              schedule.slot.slotEnd &&
              typeof schedule.slot.slotStart === "string" &&
              typeof schedule.slot.slotEnd === "string";
            if (!isValid) {
              console.warn(
                `Invalid schedule ID ${schedule.id} with slot:`,
                schedule.slot
              );
            }
            return isValid;
          });
          setSchedules(validSchedules || []);
        } catch (error) {
          console.error("Error fetching schedule data:", error);
          setSchedules([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching consultant:", err);
        alertFail("Không thể tải thông tin chuyên gia");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") {
      console.warn("Invalid time string:", timeStr);
      return "N/A";
    }
    return timeStr; // Đã được định dạng thành "HH:MM" trong ApiService
  };

  const isScheduleBooked = (schedule) => {
    if (schedule.hasOwnProperty("bookedStatus")) {
      return schedule.bookedStatus; // True nếu đã đặt, false nếu chưa đặt
    }
    console.warn(
      "Schedule",
      schedule.id,
      "no bookedStatus field, assuming available"
    );
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin chuyên gia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Chuyên gia không tồn tại"}
          </h1>
          <Link
            to="/consultation"
            className="text-emerald-600 hover:text-emerald-700"
          >
            ← Quay lại danh sách chuyên gia
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "schedule", label: "Lịch hẹn" },
  ];

  // Group schedules by date
  const groupSchedulesByDate = (schedules) => {
    const grouped = {};
    schedules.forEach((schedule) => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate(schedules);

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tư vấn", href: "/consultation" },
          { label: consultant.name, truncate: true },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 bg-emerald-600 text-white rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {consultant.avatar || consultant.name?.charAt(0) || "C"}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {consultant.name}
              </h1>
              <p className="text-xl text-emerald-600 font-medium mb-3">
                {consultant.fieldOfStudy}
              </p>
              <p className="text-gray-600 mb-4">{consultant.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {consultant.rating || 5.0}
                  </div>
                  <div className="text-sm text-gray-600">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {consultant.consultations || 0}
                  </div>
                  <div className="text-sm text-gray-600">Buổi tư vấn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {consultant.experience || "5+"}
                  </div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {consultant.specialties?.length || 1}
                  </div>
                  <div className="text-sm text-gray-600">Chuyên môn</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {consultant.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={`/booking/${consultant.id}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center block"
              >
                Đặt lịch tư vấn online
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{consultant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{consultant.phone || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{consultant.address || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>
                        {consultant.gender === "MALE"
                          ? "Nam"
                          : consultant.gender === "FEMALE"
                          ? "Nữ"
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                    {consultant.dateOfBirth && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-emerald-600" />
                        <span>
                          {new Date(consultant.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Building className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{consultant.organization}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Chứng chỉ & Bằng cấp
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {consultant.degreeLevel}
                          </h4>
                          <p className="text-gray-600">
                            {consultant.organization}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Chuyên ngành: {consultant.fieldOfStudy}
                          </p>
                          <div className="text-sm text-gray-500">
                            {consultant.issuedDate && (
                              <p>
                                Cấp:{" "}
                                {new Date(
                                  consultant.issuedDate
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                            {consultant.expiryDate && (
                              <p>
                                Hết hạn:{" "}
                                {new Date(
                                  consultant.expiryDate
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Kinh nghiệm & Chuyên môn
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">
                      <strong>Kinh nghiệm:</strong> {consultant.experience}
                    </p>
                    <p className="text-gray-700">
                      <strong>Số buổi tư vấn đã thực hiện:</strong>{" "}
                      {consultant.consultations} buổi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Lịch hẹn khả dụng
                </h3>

                <div className="mb-6">
                  <GoogleMeetInfo />
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Khung giờ khả dụng
                  </h4>
                  {Object.keys(groupedSchedules).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedSchedules)
                        .sort(([a], [b]) => new Date(a) - new Date(b))
                        .map(([date, schedules]) => (
                          <div key={date}>
                            <h5 className="text-md font-semibold text-gray-800 mb-3">
                              {new Date(date).toLocaleDateString("vi-VN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {schedules.map((schedule) => {
                                const isBooked = isScheduleBooked(schedule);
                                const slotStart = schedule.slot?.slotStart;
                                const slotEnd = schedule.slot?.slotEnd;
                                return (
                                  <div
                                    key={schedule.id}
                                    className={`p-3 border rounded-lg text-center ${
                                      isBooked
                                        ? "border-gray-300 bg-gray-100 opacity-60"
                                        : "border-gray-200 bg-white"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center">
                                      {isBooked ? (
                                        <Lock className="w-4 h-4 mr-1 text-gray-500" />
                                      ) : (
                                        <Clock className="w-4 h-4 mr-1 text-emerald-600" />
                                      )}
                                      <span
                                        className={`font-medium ${
                                          isBooked
                                            ? "text-gray-500"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {formatTime(slotStart)} -{" "}
                                        {formatTime(slotEnd)}
                                      </span>
                                    </div>
                                    {isBooked && (
                                      <div className="text-xs text-red-500 mt-1">
                                        Đã được đặt
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Hiện tại không có khung giờ nào khả dụng.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    to={`/booking/${consultant.id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                  >
                    Đặt lịch tư vấn
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDetailPage;
