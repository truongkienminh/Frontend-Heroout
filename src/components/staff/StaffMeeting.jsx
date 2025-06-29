import { useState } from "react";
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
  Trash2, // Keeping Trash2 for the "Đã Hủy" stats card icon
  // Removed Video, ExternalLink, Copy, Play
} from "lucide-react";

// --- Mock Data and Lookups ---

// Lookup data for clients (accounts)
const accounts = [
  {
    accountId: "acc-1",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
  },
  {
    accountId: "acc-2",
    name: "Lê Thị C",
    phone: "0987654321",
    email: "lethic@email.com",
  },
  {
    accountId: "acc-3",
    name: "Hoàng Minh E",
    phone: "0369852147",
    email: "hoangminhe@email.com",
  },
  {
    accountId: "acc-4",
    name: "Trần Văn G",
    phone: "0147258369",
    email: "tranvang@email.com",
  },
  {
    accountId: "acc-5",
    name: "Phạm Thị K",
    phone: "0909112233",
    email: "phamthik@email.com",
  },
  {
    accountId: "acc-6",
    name: "Võ Văn L",
    phone: "0918776655",
    email: "vovanl@email.com",
  },
];

// Lookup data for consultants
const consultants = [
  { consultantId: "con-1", name: "Dr. Trần Thị B" },
  { consultantId: "con-2", name: "Dr. Phạm Văn D" },
  { consultantId: "con-3", name: "Dr. Nguyễn Thị F" },
  { consultantId: "con-4", name: "Dr. Lê Thị H" },
  { consultantId: "con-5", name: "Dr. Bùi Văn M" },
];

// Mock data for online consultation meetings with new statuses
const meetings = [
  {
    id: 1,
    accountId: "acc-1",
    consultantId: "con-1",
    DateTime: "2024-12-20T09:00:00",
    SlotId: "slot-1",
    Status: "booked", // Changed from 'confirmed'
    Description: "Tư vấn về stress và anxiety",
  },
  {
    id: 2,
    accountId: "acc-2",
    consultantId: "con-2",
    DateTime: "2024-12-20T14:30:00",
    SlotId: "slot-2",
    Status: "booked", // Changed from 'pending'
    Description: "Tư vấn về vấn đề gia đình",
  },
  {
    id: 3,
    accountId: "acc-3",
    consultantId: "con-3",
    DateTime: "2024-12-21T10:15:00",
    SlotId: "slot-3",
    Status: "booked", // Changed from 'ongoing' - assuming ongoing means it was booked/upcoming
    Description: "Tư vấn về depression",
  },
  {
    id: 4,
    accountId: "acc-4",
    consultantId: "con-4",
    DateTime: "2024-12-19T16:00:00",
    SlotId: "slot-1",
    Status: "consulted", // Changed from 'completed'
    Description: "Tư vấn về burnout syndrome",
  },
  {
    id: 5,
    accountId: "acc-5",
    consultantId: "con-1",
    DateTime: "2024-12-22T09:30:00",
    SlotId: "slot-2",
    Status: "cancelled", // Changed from 'pending' for example
    Description: "Khách hàng báo bận đột xuất",
  },
  {
    id: 6,
    accountId: "acc-6",
    consultantId: "con-5",
    DateTime: "2024-12-22T11:00:00",
    SlotId: "slot-3",
    Status: "booked", // Changed from 'confirmed'
    Description: "Tư vấn về sự nghiệp",
  },
  {
    id: 7,
    accountId: "acc-1",
    consultantId: "con-2",
    DateTime: "2024-12-18T10:00:00",
    SlotId: "slot-1",
    Status: "consulted",
    Description: "Tái khám",
  },
];

// Helper function to find account details by accountId
const getAccountById = (id) => accounts.find((acc) => acc.accountId === id);

// Helper function to find consultant details by consultantId
const getConsultantById = (id) =>
  consultants.find((con) => con.consultantId === id);

const StaffMeeting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false); // State for add modal

  const getStatusColor = (status) => {
    switch (status) {
      case "booked": // Đã Đặt
        return "bg-yellow-100 text-yellow-800"; // Using yellow for pending/booked
      case "consulted": // Đã Tư Vấn
        return "bg-green-100 text-green-800"; // Using green for completed
      case "cancelled": // Đã Hủy
        return "bg-red-100 text-red-800"; // Using red for cancelled
      default:
        return "bg-gray-100 text-gray-800"; // Fallback
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "booked":
        return "Đã Đặt";
      case "consulted":
        return "Đã Tư Vấn";
      case "cancelled":
        return "Đã Hủy";
      default:
        return status; // Show the raw status if unknown
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const account = getAccountById(meeting.accountId);
    const consultant = getConsultantById(meeting.consultantId);

    const clientName = account ? account.name : "";
    const consultantName = consultant ? consultant.name : "";

    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultantName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || meeting.Status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Helper to format DateTime
  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "N/A", time: "N/A" };
    try {
      const dateObj = new Date(isoString);
      const date = dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const time = dateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { date, time };
    } catch (error) {
      console.error("Error formatting date:", isoString, error);
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý buổi tư vấn
        </h1>
        {/* Adjusted title */}
        <p className="text-gray-600">Quản lý các buổi tư vấn đã lên lịch</p>
        {/* Adjusted description */}
      </div>

      {/* Stats Cards (Adjusted labels and icons for new statuses) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Today (Placeholder) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">3</p>{" "}
              {/* Hardcoded count for today */}
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        {/* Card 2: Booked */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Đặt</p>
              <p className="text-2xl font-bold text-yellow-600">4</p>{" "}
              {/* Hardcoded count for 'booked' */}
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />{" "}
            {/* Clock icon for scheduled */}
          </div>
        </div>
        {/* Card 3: Cancelled */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Hủy</p>
              <p className="text-2xl font-bold text-red-600">1</p>{" "}
              {/* Hardcoded count for 'cancelled' */}
            </div>
            <Trash2 className="w-8 h-8 text-red-600" />{" "}
            {/* Trash2 icon for cancelled */}
          </div>
        </div>
        {/* Card 4: Consulted */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã Tư Vấn</p>
              <p className="text-2xl font-bold text-green-600">2</p>{" "}
              {/* Hardcoded count for 'consulted' */}
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter (Updated options) */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="booked">Đã Đặt</option>
                <option value="consulted">Đã Tư Vấn</option>
                <option value="cancelled">Đã Hủy</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tư vấn viên
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
              {filteredMeetings.map((meeting) => {
                const account = getAccountById(meeting.accountId);
                const consultant = getConsultantById(meeting.consultantId);
                const { date, time } = formatDateTime(meeting.DateTime);

                return (
                  <tr key={meeting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {account ? account.name : "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account ? account.phone : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {consultant ? consultant.name : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{date}</div>
                      <div className="text-sm text-gray-500">
                        {time} ({meeting.SlotId})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          meeting.Status
                        )}`}
                      >
                        {getStatusText(meeting.Status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {meeting.Description}
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (Hardcoded values) */}
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
              <span className="font-medium">{filteredMeetings.length}</span> của{" "}
              <span className="font-medium">{meetings.length}</span> kết quả
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

      {/* Add Modal Placeholder (Can implement a modal component here) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-8 bg-white rounded-lg shadow-xl">
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
