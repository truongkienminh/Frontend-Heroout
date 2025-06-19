import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, MapPin, Plus, Edit2, Trash2, Search, Filter
} from 'lucide-react';
import api from '../../services/axios';

const StaffEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const totalCheckin = events.reduce((sum, e) => (
    sum + (e.participants?.filter(p => p.checkedIn)?.length || 0)
  ), 0);

  const totalCheckout = NaN; // Thay bằng dữ liệu thực nếu có
  const totalParticipants = events.reduce((sum, e) => sum + (e.participants?.length || 0), 0);
  const attendanceRate = totalParticipants ? `${Math.round((totalCheckin / totalParticipants) * 100)}%` : '0%';

  if (loading) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Dashboard */}
      <h1 className="text-3xl font-bold text-gray-800">Event Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatBox title="Tổng sự kiện" value={events.length} color="text-blue-600" />
        <StatBox title="Tổng lượt check-in" value={totalCheckin} color="text-green-600" />
        <StatBox title="Tổng lượt check-out" value={isNaN(totalCheckout) ? 'NaN' : totalCheckout} color="text-red-600" />
        <StatBox title="Tỷ lệ tham dự" value={attendanceRate} color="text-yellow-600" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">Quản lý Sự kiện</h2>
          <p className="text-gray-500 text-base">Tổ chức và theo dõi các sự kiện của bạn</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:opacity-90">
          <Plus size={18} className="inline mr-2" />
          Tạo Sự kiện
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center flex-grow bg-white border rounded-xl px-6 py-3 shadow-md">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            className="flex-grow outline-none text-base"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border rounded-xl px-5 py-3 shadow-sm text-base font-medium">
          <Filter size={18} />
          Tất cả
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => {
          const total = event.participants?.length || 0;
          const checked = event.participants?.filter(p => p.checkedIn).length || 0;

          return (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 border relative min-h-[260px]">
              {/* Top border gradient */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl" />

              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <div className="flex gap-3">
                  <Edit2 size={18} className="text-blue-500 cursor-pointer" />
                  <Trash2 size={18} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              <p className="text-gray-500 text-base mb-4">{event.description}</p>

              <div className="space-y-3 text-base text-gray-600">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  {event.startTime?.slice(0, 16).replace('T', ' lúc ')}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  {event.location}
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-gray-400" />
                  {total} người tham gia
                </div>
              </div>

              {/* Check-in status */}
              

              <button className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-base font-semibold hover:opacity-90">
                Quản lý Người tham gia
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ title, value, color }) => (
  <div className="bg-white shadow-md border rounded-xl p-6 text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500 text-base mt-2">{title}</p>
  </div>
);

export default StaffEvent;
