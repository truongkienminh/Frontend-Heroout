import React from "react";
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Building2, // Using Building2 for organizer/institution
  FileText, // For description/program list icon
  Users,
  CheckSquare, // Using CheckSquare for registered count icon
} from "lucide-react";

// --- Mock Data (Adjusted for this page) ---
const eventDetails = {
  id: 1,
  type: "HỘI THẢO",
  title: "Phòng chống tệ nạn xã hội trong môi trường học đường",
  dateDay: "20",
  dateMonth: "12", // For the large date display
  fullDate: "Thứ 6, 20 tháng 12, 2024",
  time: "08:00 - 17:00",
  duration: " (9 tiếng)",
  location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
  organizer: "Bộ Y tế & Bộ Giáo dục và Đào tạo",
  description:
    "Hội thảo tập trung vào các giải pháp phòng chống tệ nạn xã hội trong môi trường giáo dục, đặc biệt là vấn đề ma túy, bạo lực học đường và các hành vi có hại khác. Sự kiện sẽ có sự tham gia của các chuyên gia hàng đầu trong lĩnh vực giáo dục, y tế và xã hội học.",
  program: [
    { time: "08:00", activity: "Đăng ký và tiếp đón" },
    {
      time: "09:00",
      activity: "Phiên khai mạc - Tầm quan trọng của phòng chống tệ nạn xã hội",
    },
    {
      time: "10:30",
      activity: "Thảo luận nhóm: Giải pháp thực tiễn cho nhà trường",
    },
    { time: "14:00", activity: "Workshop: Kỹ năng nhận biết và can thiệp sớm" },
    // Add more program items
  ],
  registrationStats: {
    registered: 245,
    remaining: 55,
    total: 300,
  },
};

// --- EventRegistrationPage Component ---
const EventRegistration = () => {
  // State for form fields would go here in a real app

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600 mb-6 flex items-center gap-1">
        <a href="/su-kien" className="hover:underline">
          Sự kiện
        </a>
        <ChevronRight className="w-4 h-4" />
        <span>Đăng ký sự kiện</span>
      </div>
      {/* Main Content: Two Columns on Medium+ Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column: Event Details */}
        <div className="flex flex-col gap-6">
          {/* Event Header Card (Similar to Featured Event) */}
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
            {/* Date Block */}
            <div className="flex-shrink-0 w-full md:w-40 bg-green-500 flex flex-row md:flex-col items-center justify-center text-white p-4">
              <div className="text-4xl font-bold">{eventDetails.dateDay}</div>
              <div className="text-lg font-normal md:mt-1 md:ml-0 ml-2">{`TH${eventDetails.dateMonth}`}</div>
            </div>
            {/* Info Block */}
            <div className="p-4 flex-grow relative">
              {" "}
              {/* relative for the type label */}
              <div className="absolute top-4 md:top-2 left-4 md:left-auto md:right-4 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">
                {eventDetails.type}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6 md:mt-0 mb-3">
                {eventDetails.title}
              </h3>{" "}
              {/* Adjust top margin based on type label position */}
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />{" "}
                  {eventDetails.fullDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />{" "}
                  {eventDetails.time}
                  {eventDetails.duration}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />{" "}
                  {eventDetails.location}
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />{" "}
                  {eventDetails.organizer}
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Mô tả sự kiện
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {eventDetails.description}
            </p>
          </div>

          {/* Event Program */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Chương trình:
            </h4>
            <div className="space-y-3">
              {eventDetails.program.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  {/* Using FileText as a simple bullet/icon */}
                  <FileText className="w-4 h-4 flex-shrink-0 text-gray-400 mt-1" />
                  <div className="flex-grow">
                    <span className="font-semibold mr-2">{item.time}:</span>
                    {item.activity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Statistics */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Thông tin đăng ký
            </h4>
            <div className="flex justify-around items-center text-center">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-green-600">
                  {eventDetails.registrationStats.registered}
                </div>
                <div className="text-sm text-gray-600">Đã đăng ký</div>
              </div>
              {/* Separator line */}
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-amber-600">
                  {eventDetails.registrationStats.remaining}
                </div>
                <div className="text-sm text-gray-600">Còn lại</div>
              </div>
              {/* Separator line */}
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-gray-800">
                  {eventDetails.registrationStats.total}
                </div>
                <div className="text-sm text-gray-600">Tổng cộng</div>
              </div>
            </div>
            {/* Optional: Add a progress bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${
                    (eventDetails.registrationStats.registered /
                      eventDetails.registrationStats.total) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>{" "}
        {/* End Left Column */}
        {/* Right Column: Registration Form */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          {" "}
          {/* h-fit and sticky help keep it visible */}
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Đăng ký tham gia
          </h3>
          <form className="space-y-6">
            {/* Thông tin cá nhân */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="ho-ten-dem"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên đệm
                  </label>
                  <input
                    type="text"
                    id="ho-ten-dem"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue="Nguyễn Văn" // Example default value
                  />
                </div>
                <div>
                  <label
                    htmlFor="ten"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên
                  </label>
                  <input
                    type="text"
                    id="ten"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue="A" // Example default value
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="nguyenvanana@email.com" // Example default value
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="0123456789" // Example default value
                />
              </div>
            </div>

            {/* Thông tin tổ chức */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin tổ chức
              </h4>
              <div className="mb-4">
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên tổ chức/trường học
                </label>
                <input
                  type="text"
                  id="organization"
                  placeholder="Nhập tên tổ chức..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chức vụ/Vị trí
                </label>
                <input
                  type="text"
                  id="position"
                  placeholder="Nhập chức vụ..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin bổ sung
              </h4>
              <div className="mb-4">
                <label
                  htmlFor="special-requests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Yêu cầu ăn uống đặc biệt
                </label>
                <textarea
                  id="special-requests"
                  rows="3"
                  placeholder="Vui lòng cho biết nếu bạn có yêu cầu đặc biệt về ăn uống..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="questions"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Câu hỏi hoặc ghi chú
                </label>
                <textarea
                  id="questions"
                  rows="3"
                  placeholder="Bạn có câu hỏi nào về sự kiện không?"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agree-terms"
                  className="mt-1 mr-2 rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                  defaultChecked // Example default checked
                />
                <label htmlFor="agree-terms" className="text-sm text-gray-700">
                  Tôi đồng ý với các điều khoản và điều kiện tham gia sự kiện
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="receive-info"
                  className="mt-1 mr-2 rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                />
                <label htmlFor="receive-info" className="text-sm text-gray-700">
                  Tôi muốn nhận thông tin về các sự kiện tương lai
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button" // Use type="button" to prevent form submission if no onSubmit handler
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Đăng ký tham gia
              </button>
            </div>
          </form>
        </div>{" "}
        {/* End Right Column */}
      </div>{" "}
      {/* End Main Content Grid */}
      {/* Potential Footer section here */}
    </div>
  );
};

export default EventRegistration;
