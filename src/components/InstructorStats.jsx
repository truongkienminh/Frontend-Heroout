import React, { useState } from 'react';
import { Play, Star, Users, Clock, BookOpen, Award, CheckCircle } from 'lucide-react';

const InstructorStats = () => {
  return (
    <div className="space-y-6">
      {/* Giảng viên */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Giảng viên</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">TS</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">TS. Nguyễn Thị Mai</h4>
            <p className="text-sm text-gray-600 mb-2">Chuyên gia tâm lý học</p>
            <div className="flex items-center mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">4.9</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Chuyên gia với hơn 15 năm kinh nghiệm trong lĩnh vực tâm lý học và tư vấn phòng chống tệ nạn xã hội.
            </p>
          </div>
        </div>
      </div>

      {/* Thống kê khóa học */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Thống kê khóa học</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng thời lượng</span>
            <span className="font-medium">1.3 giờ</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số bài học</span>
            <span className="font-medium">7 bài</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Cấp độ</span>
            <span className="font-medium">Cơ bản</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Chứng chỉ</span>
            <span className="font-medium text-green-600">Có</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorStats;