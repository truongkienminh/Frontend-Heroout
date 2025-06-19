import { useState } from "react"
import {
  Calendar,
  Clock,
  User,
  Video,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Play,
} from "lucide-react"

const StaffMeeting = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data for online consultation meetings
  const meetings = [
    {
      id: 1,
      clientName: "Nguyễn Văn A",
      consultantName: "Dr. Trần Thị B",
      date: "2024-12-20",
      time: "09:00",
      duration: "60 phút",
      status: "confirmed",
      phone: "0123456789",
      email: "nguyenvana@email.com",
      notes: "Tư vấn về stress và anxiety",
      meetLink: "https://meet.google.com/abc-defg-hij",
      meetId: "abc-defg-hij",
    },
    {
      id: 2,
      clientName: "Lê Thị C",
      consultantName: "Dr. Phạm Văn D",
      date: "2024-12-20",
      time: "14:30",
      duration: "45 phút",
      status: "pending",
      phone: "0987654321",
      email: "lethic@email.com",
      notes: "Tư vấn về vấn đề gia đình",
      meetLink: "",
      meetId: "",
    },
    {
      id: 3,
      clientName: "Hoàng Minh E",
      consultantName: "Dr. Nguyễn Thị F",
      date: "2024-12-21",
      time: "10:15",
      duration: "90 phút",
      status: "ongoing",
      phone: "0369852147",
      email: "hoangminhe@email.com",
      notes: "Tư vấn về depression",
      meetLink: "https://meet.google.com/xyz-uvwx-yz",
      meetId: "xyz-uvwx-yz",
    },
    {
      id: 4,
      clientName: "Trần Văn G",
      consultantName: "Dr. Lê Thị H",
      date: "2024-12-19",
      time: "16:00",
      duration: "60 phút",
      status: "completed",
      phone: "0147258369",
      email: "tranvang@email.com",
      notes: "Tư vấn về burnout syndrome",
      meetLink: "https://meet.google.com/def-ghij-klm",
      meetId: "def-ghij-klm",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "ongoing":
        return "Đang diễn ra"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const copyMeetLink = (link) => {
    navigator.clipboard.writeText(link)
    // You can add a toast notification here
alert("Đã copy link Google Meet!")
  }

  const generateMeetLink = (meetingId) => {
    // In real app, this would call an API to create Google Meet
    const newLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`
    alert(`Đã tạo link Google Meet: ${newLink}`)
    // Update the meeting with new link
  }

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.consultantName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || meeting.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tư vấn trực tuyến</h1>
        <p className="text-gray-600">Quản lý các buổi tư vấn trực tuyến qua Google Meet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </div>
            <Play className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">24</p>
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

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

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
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Google Meet
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
              {filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{meeting.clientName}</div>
                        <div className="text-sm text-gray-500">{meeting.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{meeting.consultantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{meeting.date}</div>
                    <div className="text-sm text-gray-500">
                      {meeting.time} ({meeting.duration})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}
                    >
                      {getStatusText(meeting.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {meeting.meetLink ? (
                      <div className="flex items-center space-x-2">
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Video className="w-4 h-4" />
                          <span className="text-sm">Vào phòng</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => copyMeetLink(meeting.meetLink)}
className="text-gray-400 hover:text-gray-600"
                          title="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => generateMeetLink(meeting.id)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Tạo link</span>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{meeting.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" title="Thêm tùy chọn">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{" "}
              <span className="font-medium">97</span> kết quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
<button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Trước
              </button>
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
    </div>
  )
}

export default StaffMeeting
