import React from 'react';
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  FileText, 
  Plus,
  UserPlus,
  AlertCircle,
  TrendingUp
} from 'lucide-react';


const StaffDashboard = () => {
  const stats = [
    {
      title: 'Tổng thành viên',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      subtitle: '+45 thành viên mới tuần này'
    },
    {
      title: 'Khóa học hoạt động',
      value: '24',
      subtitle: 'Tổng số khóa học'
    },
    {
      title: 'Lịch hẹn chưa diễn ra',
      value: '18',
      changeType: 'urgent',
      subtitle: 'Cần xử lý trong hôm nay'
    },
    {
      title: 'Chương trình cộng đồng',
      value: '8',
      subtitle: 'Đang diễn ra'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Quản lý</h1>
        <p className="text-gray-600">Tổng quan hệ thống - 15 tháng 12, 2024</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              {stat.changeType === 'urgent' && (
                <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">
                  URGENT
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-3xl font-bold ${
                stat.changeType === 'urgent' ? 'text-red-600' : 'text-gray-900'
              }`}>
                {stat.value}
              </span>
              {stat.change && (
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Tạo khảo sát</p>
              <p className="text-sm text-gray-500">Mẫu đánh giá mới</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Thành viên mới đăng ký: Nguyễn Văn F</p>
              <p className="text-sm text-gray-500">5 phút trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;