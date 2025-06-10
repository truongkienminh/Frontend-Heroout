import React from "react";

import { Link } from "react-router-dom";

import {
  Search,
  Settings,
  Grid,
  List,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Monitor,
  Award,
  CalendarCheck,
} from "lucide-react";

const featuredEvent = {
  id: 1,
  type: "HỘI THẢO",
  title: "Phòng chống tệ nạn xã hội trong môi trường học đường",
  dateDay: "20",
  dateMonth: "12",
  fullDate: "20/12/2024",
  time: "08:00 - 17:00",
  location: "Trung tâm Hội nghị Quốc gia",
  attendees: "245/300 người tham gia",
};

const upcomingEvents = [
  {
    id: 2,
    type: "WORKSHOP",
    title: "Workshop kỹ năng tư vấn cho thanh niên",
    date: "22/12/2024",
    time: "14:00",
    location: "Online",
    price: "Miễn phí",
    iconType: "monitor",
    cardColorClass: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    type: "CỘNG ĐỒNG",
    title: 'Ngày hội "Cùng nhau nói không với tệ nạn xã hội"',
    date: "25/12/2024",
    time: "09:00 - 16:00",
    location: "Công viên Thống Nhất",
    price: "Miễn phí",
    iconType: "users",
    cardColorClass: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    type: "CUỘC THI",
    title: "Cuộc thi sáng tác poster tuyên truyền phòng chống ma túy",
    date: "30/12/2024",
    time: "Hạn nộp bài",
    prize: "Giải thưởng 50 triệu",
    price: "",
    iconType: "award",
    cardColorClass: "bg-red-100 text-red-800",
  },
];

const myEvents = [
  {
    id: 2,
    title: "Workshop kỹ năng tư vấn cho thanh niên",
    status: "Bạn đã đăng ký tham gia sự kiện này",
    date: "22/12/2024",
    time: "14:00",
    iconType: "calendar-check",
  },
];

const getLucideIcon = (type) => {
  switch (type) {
    case "monitor":
      return <Monitor className="w-10 h-10 text-blue-600" />;
    case "users":
      return <Users className="w-10 h-10 text-yellow-600" />;
    case "award":
      return <Award className="w-10 h-10 text-red-600" />;
    case "calendar-check":
      return <CalendarCheck className="w-6 h-6 text-green-600" />; // Smaller for my events
    // Default icons for details
    case "calendar":
      return <Calendar className="w-4 h-4 text-gray-400" />;
    case "clock":
      return <Clock className="w-4 h-4 text-gray-400" />;
    case "map-pin":
      return <MapPin className="w-4 h-4 text-gray-400" />;
    case "dollar-sign":
      return <DollarSign className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
};

const EventPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Sự kiện & Hoạt động
        </h2>
        <p className="text-base text-gray-600">
          Tham gia các sự kiện giáo dục và hoạt động cộng đồng về phòng chống tệ
          nạn xã hội
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="relative inline-block w-full md:w-auto">
          <button className="flex items-center justify-center md:justify-between gap-2 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
            Tất cả
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex border border-gray-300 rounded-md overflow-hidden w-full md:w-auto">
          <button className="p-2 bg-green-500 text-white focus:outline-none">
            <Grid className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Sự kiện nổi bật
        </h3>
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex-shrink-0 w-full md:w-40 bg-green-500 flex flex-row md:flex-col items-center justify-center text-white p-4">
            <div className="text-4xl font-bold">{featuredEvent.dateDay}</div>
            <div className="text-lg font-normal md:mt-1 md:ml-0 ml-2">{`TH${featuredEvent.dateMonth}`}</div>
          </div>

          <div className="p-4 flex-grow">
            <div className="text-xs font-bold text-amber-600 uppercase mb-1">
              {featuredEvent.type}
            </div>
            <h3>{featuredEvent.title}</h3>
            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center mb-2 gap-2">
                <Clock className="w-5 h-5 text-gray-400" /> {featuredEvent.time}
              </div>
              <div className="flex items-center mb-2 gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />{" "}
                {featuredEvent.location}
              </div>
              <div className="flex items-center mb-2 gap-2">
                <Users className="w-5 h-5 text-gray-400" />{" "}
                {featuredEvent.attendees}
              </div>
            </div>

            <Link
              to="/eventregistration"
              className="inline-block px-6 py-2 bg-green-500 text-white rounded-md text-base hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Sự kiện sắp diễn ra
        </h3>

        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-72 min-w-[288px] bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div
                className={`relative h-32 flex justify-center items-center ${
                  event.cardColorClass.split(" ")[0]
                }`}
              >
                {getLucideIcon(event.iconType)}
                <div
                  className={`absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-bold uppercase ${
                    event.cardColorClass.split(" ")[1]
                  }`}
                >
                  {event.type}
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col">
                <div className="text-base font-bold text-gray-800 mb-2">
                  {event.title}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center mb-1 gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> {event.date}
                  </div>
                  <div className="flex items-center mb-1 gap-2">
                    <Clock className="w-4 h-4 text-gray-400" /> {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center mb-1 gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />{" "}
                      {event.location}
                    </div>
                  )}
                  {event.prize && (
                    <div className="flex items-center mb-1 gap-2">
                      <Award className="w-4 h-4 text-gray-400" /> {event.prize}
                    </div>
                  )}
                  {event.price && (
                    <div className="flex items-center mb-1 gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />{" "}
                      {event.price}
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  {" "}
                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    {event.type === "CUỘC THI" ? "Tham gia" : "Đăng ký"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Sự kiện của tôi
        </h3>

        <div className="flex flex-col gap-4">
          {myEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden p-4 gap-4"
            >
              <div className="flex-shrink-0">
                {getLucideIcon(event.iconType)}
              </div>

              <div className="flex-grow flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-4 w-full">
                <div className="flex-grow">
                  <div className="text-base font-bold text-gray-800 mb-1">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {event.status}
                  </div>
                  <div className="text-sm text-gray-800 font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {event.date}, <Clock className="w-4 h-4 text-gray-400" />{" "}
                    {event.time}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 flex-shrink-0">
                  <button className="px-3 py-1.5 rounded-md text-sm border border-green-600 text-green-600 bg-transparent hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Xem chi tiết
                  </button>
                  <button className="px-3 py-1.5 rounded-md text-sm border border-red-600 text-red-600 bg-transparent hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600">
                    Hủy đăng ký
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
