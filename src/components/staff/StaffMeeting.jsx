import { useState, useEffect, useMemo } from "react";
import api from "../api"; // Import the configured axios instance
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";

// --- NO MORE MOCK DATA ACCOUNTS AND CONSULTANTS ---

const StaffMeeting = () => {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]); // State to store schedules
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false); // State for add modal

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAppointmentsAndSchedules = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const [appointmentsResponse, schedulesResponse] = await Promise.all([
          api.get("/appointment"),
          api.get("/schedules"),
        ]);

        setAppointments(appointmentsResponse.data);
        setSchedules(schedulesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Check for 401 error which is handled by the interceptor
        if (err.response?.status !== 401) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        }
        // The 401 error is handled by the axios interceptor for redirection
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsAndSchedules();
  }, []); // Empty dependency array means this runs once on mount

  // --- Helper to map scheduleId to slot times ---
  // Using useMemo to create the slot lookup map efficiently
  const slotLookup = useMemo(() => {
    const lookup = {};
    schedules.forEach((schedule) => {
      if (schedule.slot) {
        lookup[schedule.id] = {
          slotStart: schedule.slot.slotStart,
          slotEnd: schedule.slot.slotEnd,
        };
      }
    });
    return lookup;
  }, [schedules]); // Recreate if schedules data changes

  // --- Status Helper Functions (Updated for API uppercase status) ---
  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED": // API Status
        return "bg-yellow-100 text-yellow-800";
      case "CONSULTED": // API Status
        return "bg-green-100 text-green-800";
      case "CANCELLED": // API Status
        return "bg-red-100 text-red-800";
      // Add other potential API statuses if needed
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "BOOKED":
        return "Đã Đặt";
      case "CONSULTED":
        return "Đã Tư Vấn";
      case "CANCELLED":
        return "Đã Hủy";
      default:
        return status; // Show the raw status if unknown
    }
  };

  // --- Filtering Logic (Adjusted search since names are not available) ---
  // Search will now only work on Appointment ID, Schedule ID, Status, Description
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search now checks IDs, Status, Description
      const matchesSearch =
        String(appointment.id).includes(searchTerm) ||
        String(appointment.accountId).includes(searchTerm) || // Search Account ID
        String(appointment.consultantId).includes(searchTerm) || // Search Consultant ID
        String(appointment.scheduleId).includes(searchTerm) || // Search Schedule ID
        appointment.status.toLowerCase().includes(searchTerm.toLowerCase()) || // Search Status text
        (appointment.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // Search Description

      const matchesFilter =
        filterStatus === "all" ||
        appointment.status === filterStatus.toUpperCase(); // Compare with uppercase API status

      return matchesSearch && matchesFilter;
    });
  }, [appointments, searchTerm, filterStatus]); // Re-filter when appointments, search, or filter changes

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    // Assuming appointmentDate is used for "Today" count
    const totalToday = appointments.filter(
      (appt) => appt.appointmentDate === today
    ).length;
    const bookedCount = appointments.filter(
      (appt) => appt.status === "BOOKED"
    ).length;
    const cancelledCount = appointments.filter(
      (appt) => appt.status === "CANCELLED"
    ).length;
    const consultedCount = appointments.filter(
      (appt) => appt.status === "CONSULTED"
    ).length;

    return { totalToday, bookedCount, cancelledCount, consultedCount };
  }, [appointments]); // Recalculate stats when appointments data changes

  // --- Helper to format Date and Time from appointment date and schedule slot ---
  const formatDateAndTime = (appointmentDate, scheduleId) => {
    if (!appointmentDate || !scheduleId)
      return { date: "N/A", time: "N/A", slotId: "N/A" };

    const slot = slotLookup[scheduleId];
    if (!slot) return { date: "N/A", time: "N/A", slotId: scheduleId }; // Schedule not found

    try {
      // Combine date string and time string
      // Note: Combining date and time like this assumes they are in the same timezone or UTC.
      // For reliable date/time handling, especially across timezones,
      // consider using a library like `date-fns` or `moment.js`.
      // Assuming YYYY-MM-DD and HH:MM:SS format which works with new Date() if using T separator
      const dateTimeString = `${appointmentDate}T${slot.slotStart}`;
      const dateObj = new Date(dateTimeString);

      // Check if dateObj is valid
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date/time combination:", dateTimeString);
        return {
          date: "Invalid Date",
          time: "Invalid Time",
          slotId: scheduleId,
        };
      }

      const date = dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const time = dateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return { date, time, slotId: scheduleId }; // Using scheduleId as slot identifier
    } catch (error) {
      console.error(
        "Error formatting date/time:",
        appointmentDate,
        scheduleId,
        error
      );
      return { date: "Error", time: "Error", slotId: scheduleId };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý buổi tư vấn
        </h1>
        <p className="text-gray-600">Quản lý các buổi tư vấn đã lên lịch</p>
      </div>

      {/* Stats Cards (Using calculated stats) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Today */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalToday}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        {/* Card 2: Booked */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Đặt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.bookedCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        {/* Card 3: Cancelled */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Hủy</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelledCount}
              </p>
            </div>
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
        </div>
        {/* Card 4: Consulted */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Tư Vấn</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.consultedCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search (Updated placeholder) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..." // Generic search placeholder
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter (Updated options for API status values) */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="BOOKED">Đã Đặt</option> {/* Match API value */}
                <option value="CONSULTED">Đã Tư Vấn</option>{" "}
                {/* Match API value */}
                <option value="CANCELLED">Đã Hủy</option>{" "}
                {/* Match API value */}
              </select>
            </div>
          </div>

          {/* Add Button (Modal not implemented, but button/state kept) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm buổi tư vấn</span>
          </button>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Updated header */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Khách hàng
                </th>
                {/* Updated header */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Tư vấn viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian / Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                // NO MORE getAccountById or getConsultantById calls here
                const { date, time, slotId } = formatDateAndTime(
                  appointment.appointmentDate,
                  appointment.scheduleId
                );

                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    {/* Displaying Account ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ID: {appointment.accountId}
                          </div>
                          {/* Phone number removed as it's not available */}
                          {/* <div className="text-sm text-gray-500">N/A</div> */}
                        </div>
                      </div>
                    </td>
                    {/* Displaying Consultant ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ID: {appointment.consultantId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{date}</div>
                      <div className="text-sm text-gray-500">
                        {time} (Slot {slotId})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {appointment.description || "Không có ghi chú"}{" "}
                        {/* Display placeholder if null */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa"
                          // Add onClick handler here
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                          // Add onClick handler here
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Thêm tùy chọn"
                          // Add onClick handler here
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAppointments.length === 0 && !isLoading && !error && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy buổi tư vấn nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (Still hardcoded) */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">{filteredAppointments.length}</span>{" "}
              của <span className="font-medium">{appointments.length}</span> kết
              quả
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Trước
              </button>
              {/* Example pagination numbers - would be dynamic in a real app */}
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Thêm buổi tư vấn mới</h2>
            {/* Add your form elements here */}
            <p>Form thêm buổi tư vấn sẽ ở đây.</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMeeting;
