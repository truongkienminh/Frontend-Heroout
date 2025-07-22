import React from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Calendar,
  Lightbulb,
} from "lucide-react";

// Dữ liệu giả lập (mock data).
// Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API hoặc state.
const riskData = {
  score: 78,
  riskLevel: "Cao", // Có thể là "Thấp", "Trung bình", "Cao"
  recommendation:
    "Mức độ căng thẳng của bạn đang ở ngưỡng cao. Chúng tôi khuyến nghị bạn nên tham khảo một buổi tư vấn với chuyên gia để tìm hiểu các chiến lược đối phó hiệu quả. Đồng thời, hãy thử các bài tập thư giãn và đảm bảo ngủ đủ giấc.",
  takenAt: "2024-10-26T10:30:00Z",
};

// Hàm helper để lấy style dựa trên mức độ rủi ro
const getRiskLevelStyles = (level) => {
  switch (level.toLowerCase()) {
    case "cao":
      return {
        icon: <ShieldAlert className="h-16 w-16 text-red-500" />,
        textColor: "text-red-500",
        bgColor: "bg-red-100",
        borderColor: "border-red-500",
        title: "Mức Độ Rủi Ro Cao",
      };
    case "trung bình":
      return {
        icon: <Shield className="h-16 w-16 text-yellow-500" />,
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-100",
        borderColor: "border-yellow-500",
        title: "Mức Độ Rủi Ro Trung Bình",
      };
    case "thấp":
      return {
        icon: <ShieldCheck className="h-16 w-16 text-green-500" />,
        textColor: "text-green-500",
        bgColor: "bg-green-100",
        borderColor: "border-green-500",
        title: "Mức Độ Rủi Ro Thấp",
      };
    default:
      return {
        icon: <Shield className="h-16 w-16 text-gray-500" />,
        textColor: "text-gray-500",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-500",
        title: "Chưa Xác Định",
      };
  }
};

function RiskLevelPage() {
  const { score, riskLevel, recommendation, takenAt } = riskData;
  const styles = getRiskLevelStyles(riskLevel);

  // Format lại ngày tháng cho dễ đọc
  const formattedDate = new Date(takenAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Phần tiêu đề */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Kết Quả Đánh Giá Nguy Cơ
          </h1>

          <p className="text-gray-500 mt-2">
            Dưới đây là phân tích từ bài khảo sát Eassist của bạn.
          </p>
        </div>

        {/* Phần thẻ kết quả chính */}
        <div
          className={`rounded-lg p-6 border-2 ${styles.borderColor} ${styles.bgColor}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">{styles.icon}</div>
            <div className="text-center md:text-left">
              <h2 className={`text-2xl font-bold ${styles.textColor}`}>
                {styles.title}
              </h2>
              <p className="text-gray-600 mt-1">
                Dựa trên các câu trả lời của bạn, hệ thống đã ghi nhận kết quả.
              </p>
            </div>
          </div>
        </div>

        {/* Phần chi tiết */}
        <div className="space-y-6">
          {/* Điểm số */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-lg p-2">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Điểm số của bạn
              </h3>
              <p className="text-3xl font-bold text-blue-600">{score} / 100</p>
              <p className="text-sm text-gray-500">
                Điểm số càng cao thể hiện mức độ rủi ro càng lớn.
              </p>
            </div>
          </div>

          {/* Khuyến nghị */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-emerald-500 bg-emerald-100 rounded-lg p-2">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Khuyến nghị từ Eassist
              </h3>
              <p className="text-gray-600 leading-relaxed">{recommendation}</p>
            </div>
          </div>

          {/* Ngày thực hiện */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-lg p-2">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Ngày thực hiện
              </h3>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="text-center pt-4 border-t border-gray-200">
          <button
            className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            onClick={() => alert("Chuyển đến trang tư vấn!")} // Thay bằng hành động thật, ví dụ: navigate('/consultation')
          >
            Tìm kiếm Chuyên gia Tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}

export default RiskLevelPage;
