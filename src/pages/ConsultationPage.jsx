import { Link } from "react-router-dom";
import { Video, Users, Calendar, Award } from "lucide-react";
import { useState, useEffect } from "react";
import ApiService from "../services/apiService";

const ConsultationPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultants using ApiService
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getConsultants();
        setConsultants(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Dịch vụ tư vấn chuyên nghiệp
          </h1>
          <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
            Nhận được sự hỗ trợ từ đội ngũ chuyên gia tâm lý và công tác xã hội
            có kinh nghiệm trong lĩnh vực phòng chống tệ nạn xã hội
          </p>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Hình thức tư vấn
            </h2>
            <p className="text-lg text-gray-600">
              Tư vấn trực tuyến qua Google Meet - tiện lợi và hiệu quả
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Online Consultation */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Tư vấn trực tuyến qua Google Meet
                </h3>
                <p className="text-gray-600 mb-6">
                  Kết nối với chuyên gia tư vấn từ bất kỳ đâu thông qua Google
                  Meet. Tiện lợi, bảo mật và hiệu quả.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span>Linh hoạt thời gian và địa điểm</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span>Bảo mật thông tin tuyệt đối</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span>Kết nối trực tuyến với các chuyên gia hàng đầu</span>
                  </div>
                </div>

                <Link
                  to="/booking"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-block"
                >
                  Đặt lịch ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Đội ngũ chuyên gia
            </h2>
            <p className="text-lg text-gray-600">
              Gặp gỡ các chuyên gia hàng đầu trong lĩnh vực tâm lý và công tác
              xã hội
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Đang tải danh sách chuyên gia...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Lỗi tải dữ liệu
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultants.map((consultant) => (
                <div
                  key={consultant.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        {consultant.avatar || consultant.name?.charAt(0) || "C"}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {consultant.name}
                      </h3>
                      <p className="text-emerald-600 font-medium mb-2">
                        {consultant.field_of_study}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {consultant.experience}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>{consultant.degree_level}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>{consultant.consultations || 0} buổi tư vấn</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex items-center mr-2">
                          <span className="text-yellow-500">★</span>
                        </div>
                        <span>{consultant.rating || 5.0}/5.0</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Chuyên môn:</p>
                      <div className="flex flex-wrap gap-1">
                        {consultant.specialties
                          ?.slice(0, 2)
                          .map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          )) || (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                            {consultant.field_of_study}
                          </span>
                        )}
                        {consultant.specialties?.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{consultant.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/consultants/${consultant.id}`}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Quy trình tư vấn
            </h2>
            <p className="text-lg text-gray-600">Đơn giản và hiệu quả</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                1. Đặt lịch hẹn
              </h3>
              <p className="text-gray-600">
                Chọn chuyên gia và thời gian phù hợp với lịch trình của bạn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                2. Tham gia buổi tư vấn
              </h3>
              <p className="text-gray-600">
                Trao đổi với chuyên gia về vấn đề và nhận được lời khuyên chuyên
                môn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                3. Theo dõi tiến trình
              </h3>
              <p className="text-gray-600">
                Nhận kế hoạch hỗ trợ và theo dõi tiến trình phục hồi
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultationPage;
