import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { CheckCircle, Mail, Building } from "lucide-react";
import GoogleMeetInfo from "../components/GoogleMeetInfo";

const ConsultantDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [slots, setSlots] = useState([]);

  // Fetch consultant from API
  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        setLoading(true);

        // Fetch all consultants (vì endpoint single consultant không hoạt động)
        const response = await fetch(
          "https://684482e971eb5d1be0337d19.mockapi.io/consultants"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch consultants");
        }

        const allConsultants = await response.json();

        // Tìm consultant theo ID
        const foundConsultant = allConsultants.find(
          (c) => c.id === Number.parseInt(id)
        );

        if (!foundConsultant) {
          throw new Error("Consultant not found");
        }

        setConsultant(foundConsultant);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching consultant:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchScheduleData = async (consultantId) => {
      try {
        // Fetch schedules
        const schedulesResponse = await fetch(
          "https://684db8e765ed08713916f5be.mockapi.io/schedule"
        );
        if (schedulesResponse.ok) {
          const allSchedules = await schedulesResponse.json();
          const consultantSchedules = allSchedules.filter(
            (s) => s.consultant_id === Number.parseInt(consultantId)
          );
          setSchedules(consultantSchedules);
        }
        // Fetch slots
        const slotsResponse = await fetch(
          "https://684db8e765ed08713916f5be.mockapi.io/slot"
        );
        if (slotsResponse.ok) {
          const allSlots = await slotsResponse.json();
          setSlots(allSlots);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    if (id) {
      fetchConsultant();
      fetchScheduleData(id);
    }
  }, [id]);

  // Loading state
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

  // Error state
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
    // { id: "reviews", label: "Đánh giá" },
  ];

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
        {/* Consultant Header */}
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
                {consultant.field_of_study}
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
                )) || (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                    {consultant.field_of_study}
                  </span>
                )}
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

        {/* Tabs */}
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
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Thông tin liên hệ
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{consultant.email}</span>
                    </div>
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
                    {consultant.certifications?.map((cert, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {cert.name}
                            </h4>
                            <p className="text-gray-600">{cert.organization}</p>
                            <p className="text-sm text-gray-500">
                              Cấp:{" "}
                              {new Date(cert.issued).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              - Hết hạn:{" "}
                              {new Date(cert.expiry).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    )) || (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              Chứng chỉ {consultant.degree_level}
                            </h4>
                            <p className="text-gray-600">
                              {consultant.organization}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cấp:{" "}
                              {new Date(
                                consultant.issued_date
                              ).toLocaleDateString("vi-VN")}
                              {consultant.expiry_date &&
                                ` - Hết hạn: ${new Date(
                                  consultant.expiry_date
                                ).toLocaleDateString("vi-VN")}`}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Lịch hẹn khả dụng
                </h3>

                {/* GoogleMeetInfo component */}
                <div className="mb-6">
                  <GoogleMeetInfo />
                </div>

                {/* Schedule Information */}
                {schedules.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Thông tin lịch làm việc
                    </h4>
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="bg-gray-50 rounded-lg p-4 mb-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Thời gian:</span>
                            <p className="font-medium">
                              {new Date(schedule.start_date).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              -{" "}
                              {new Date(schedule.end_date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Lặp lại:</span>
                            <p className="font-medium">
                              {schedule.recurrence === "weekly"
                                ? "Hàng tuần"
                                : schedule.recurrence}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Available Slots */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Khung giờ khả dụng
                  </h4>
                  {slots.filter(
                    (slot) =>
                      schedules.some((s) => s.id === slot.schedule_id) &&
                      !slot.is_booked
                  ).length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {slots
                        .filter(
                          (slot) =>
                            schedules.some((s) => s.id === slot.schedule_id) &&
                            !slot.is_booked
                        )
                        .slice(0, 6) // Show first 6 available slots
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="text-sm">
                              <p className="font-medium text-gray-800">
                                {new Date(slot.slot_start).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                              <p className="text-gray-600">
                                {new Date(slot.slot_start).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(slot.slot_end).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
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

                {/* Book Appointment Button */}
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

            {/* Reviews Tab */}
            {/* {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Đánh giá từ khách hàng
                </h3>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDetailPage;
