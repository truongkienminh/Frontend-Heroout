import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Calendar,
  FileText,
  BookOpen,
  TrendingUp,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  User,
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ApiService from "../../services/apiService";

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCourses: 0,
    totalEvents: 0,
    totalBlogs: 0,
    totalAppointments: 0,
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [memberStats, setMemberStats] = useState({
    byGender: [],
    byStatus: [],
  });
  const [eventStats, setEventStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data concurrently
      const [
        accountsResponse,
        coursesResponse,
        eventsResponse,
        blogsResponse,
        appointmentsResponse,
      ] = await Promise.allSettled([
        ApiService.getAllAccounts(),
        ApiService.getCourses(),
        ApiService.getEvents(),
        ApiService.getBlogs(),
        ApiService.getAppointments(),
      ]);

      // Process accounts data
      let accounts = [];
      if (accountsResponse.status === "fulfilled") {
        accounts = accountsResponse.value || [];
      }

      // Filter members and get recent ones
      const members = accounts.filter(
        (account) => account.role && account.role.toLowerCase() === "member"
      );

      // Get 3 most recent members (highest IDs)
      const sortedMembers = members
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 3);

      // Calculate member statistics
      const genderStats = calculateGenderStats(members);
      const statusStats = calculateStatusStats(members);

      // Process events data
      let events = [];
      if (eventsResponse.status === "fulfilled") {
        events = eventsResponse.value || [];
      }

      // Calculate event statistics
      const eventStatsData = calculateEventStats(events);

      // Set stats
      setStats({
        totalMembers: members.length,
        totalCourses:
          coursesResponse.status === "fulfilled"
            ? coursesResponse.value?.length || 0
            : 0,
        totalEvents:
          eventsResponse.status === "fulfilled"
            ? eventsResponse.value?.length || 0
            : 0,
        totalBlogs:
          blogsResponse.status === "fulfilled"
            ? blogsResponse.value?.length || 0
            : 0,
        totalAppointments:
          appointmentsResponse.status === "fulfilled"
            ? appointmentsResponse.value?.length || 0
            : 0,
      });

      setRecentMembers(sortedMembers);
      setMemberStats({
        byGender: genderStats,
        byStatus: statusStats,
      });
      setEventStats(eventStatsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const calculateGenderStats = (members) => {
    const genderCount = members.reduce((acc, member) => {
      const gender = member.gender || "UNKNOWN";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderCount).map(([gender, count]) => ({
      label:
        gender === "MALE"
          ? "Nam"
          : gender === "FEMALE"
          ? "Nữ"
          : "Chưa xác định",
      count,
      color:
        gender === "MALE"
          ? "bg-blue-500"
          : gender === "FEMALE"
          ? "bg-pink-500"
          : "bg-gray-500",
    }));
  };

  const calculateStatusStats = (members) => {
    const statusCount = members.reduce((acc, member) => {
      const status = member.status || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      label:
        status === "ACTIVE"
          ? "Hoạt động"
          : status === "INACTIVE"
          ? "Không hoạt động"
          : "Chưa xác định",
      count,
      color:
        status === "ACTIVE"
          ? "bg-green-500"
          : status === "INACTIVE"
          ? "bg-red-500"
          : "bg-gray-500",
    }));
  };

  const calculateEventStats = (events) => {
    const now = new Date();
    const eventsByStatus = events.reduce((acc, event) => {
      let status = "upcoming";

      if (event.startDate && event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        if (now > endDate) {
          status = "completed";
        } else if (now >= startDate && now <= endDate) {
          status = "ongoing";
        }
      }

      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return [
      {
        label: "Đang diễn ra",
        count: eventsByStatus.ongoing || 0,
        color: "bg-green-500",
        icon: CheckCircle,
      },
      {
        label: "Sắp diễn ra",
        count: eventsByStatus.upcoming || 0,
        color: "bg-blue-500",
        icon: Clock,
      },
      {
        label: "Đã kết thúc",
        count: eventsByStatus.completed || 0,
        color: "bg-gray-500",
        icon: AlertCircle,
      },
    ];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  const getGenderDisplay = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Chưa xác định";
    }
  };

  const statsCards = [
    {
      title: "Tổng số thành viên",
      value: stats.totalMembers,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Khóa học",
      value: stats.totalCourses,
      icon: GraduationCap,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Sự kiện",
      value: stats.totalEvents,
      icon: Calendar,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Lịch tư vấn",
      value: stats.totalAppointments,
      icon: BookOpen,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Quản lý
        </h1>
        <p className="text-gray-600">
          Tổng quan hệ thống - {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
            Thành viên mới nhất
          </h2>
          <div className="space-y-4">
            {recentMembers.length > 0 ? (
              recentMembers.map((member, index) => (
                <div
                  key={member.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-medium text-lg">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {member.name || "Chưa cập nhật tên"}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">
                            {member.email || "Không có email"}
                          </span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{getGenderDisplay(member.gender)}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{formatDate(member.dateOfBirth)}</span>
                        </div>
                        {member.address && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">{member.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ID: {member.id}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Chưa có thành viên nào
              </p>
            )}
          </div>
        </div>

        {/* Member Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Thống kê thành viên
          </h2>

          {/* Gender Statistics */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Phân bố theo giới tính
            </h3>
            <div className="space-y-3">
              {memberStats.byGender.map((stat, index) => {
                const total = memberStats.byGender.reduce(
                  (sum, s) => sum + s.count,
                  0
                );
                const percentage = total > 0 ? (stat.count / total) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-4 h-4 ${stat.color} rounded-full`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {stat.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Statistics */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Trạng thái hoạt động
            </h3>
            <div className="space-y-3">
              {memberStats.byStatus.map((stat, index) => {
                const total = memberStats.byStatus.reduce(
                  (sum, s) => sum + s.count,
                  0
                );
                const percentage = total > 0 ? (stat.count / total) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-4 h-4 ${stat.color} rounded-full`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {stat.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Tổng cộng:</strong> {stats.totalMembers} thành viên đã
              đăng ký
            </p>
          </div>

          {/* Event Statistics */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-600" />
              Thống kê sự kiện
            </h3>
            <div className="space-y-3">
              {eventStats.map((stat, index) => {
                const total = eventStats.reduce((sum, s) => sum + s.count, 0);
                const percentage = total > 0 ? (stat.count / total) * 100 : 0;
                const IconComponent = stat.icon;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent
                        className={`w-4 h-4 ${stat.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                        {stat.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {stats.totalEvents > 0 && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Tổng cộng:</strong> {stats.totalEvents} sự kiện
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;