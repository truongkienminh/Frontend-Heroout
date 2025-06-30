import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, MapPin, Plus, Edit2, Trash2, Search, Filter, X, CheckCircle, Circle, UserCheck, UserX
} from 'lucide-react';
import api from '../../services/axios';

const StatBox = ({ title, value, color }) => (
  <div className="bg-white shadow-md border rounded-xl p-6 text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500 text-base mt-2">{title}</p>
  </div>
);

const StaffEvent = () => {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [editEventData, setEditEventData] = useState({
    title: '', description: '', location: '', startTime: '', endTime: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', location: '', startTime: '', endTime: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Participant modal state
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participantSearch, setParticipantSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'checkin', 'checkout'
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [checkedInParticipants, setCheckedInParticipants] = useState([]);
  const [checkedOutParticipants, setCheckedOutParticipants] = useState([]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const fetchAllParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const [registeredRes, checkedInRes, checkedOutRes] = await Promise.all([
        api.get(`/participations/${eventId}/registered`, { params: { eventId } }),
        api.get(`/participations/${eventId}/checked-in`, { params: { eventId } }),
        api.get(`/participations/${eventId}/checked-out`, { params: { eventId } }),
      ]);
      setRegisteredParticipants(registeredRes.data);
      setCheckedInParticipants(checkedInRes.data);
      setCheckedOutParticipants(checkedOutRes.data);
    } catch (error) {
      setRegisteredParticipants([]);
      setCheckedInParticipants([]);
      setCheckedOutParticipants([]);
      console.error('Lỗi khi lấy danh sách người tham gia:', error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Derived values
  const totalCheckin = events.reduce((sum, e) =>
    sum + (e.participants?.filter(p => p.checkedIn)?.length || 0), 0);
  const totalCheckout = events.reduce((sum, e) =>
    sum + (e.participants?.filter(p => p.checkedOut)?.length || 0), 0);
  const totalParticipants = events.reduce((sum, e) =>
    sum + (e.participants?.length || 0), 0);
  const attendanceRate = totalParticipants
    ? `${Math.round((totalCheckin / totalParticipants) * 100)}%`
    : '0%';

  // Handlers
  const handleEditClick = (event) => {
    setEventToEdit(event);
    setEditEventData({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      startTime: event.startTime ? event.startTime.slice(0, 16) : '',
      endTime: event.endTime ? event.endTime.slice(0, 16) : ''
    });
  };

  const handleManageParticipants = (event) => {
    setSelectedEvent(event);
    setShowParticipantModal(true);
    setParticipantSearch('');
    setActiveTab('all');
    fetchAllParticipants(event.id);
  };

  const handleCreateEvent = async () => {
    try {
      const response = await api.post('/events', {
        ...newEvent,
        participants: []
      });
      setEvents(prev => [...prev, response.data]);
      setShowModal(false);
      setNewEvent({ title: '', description: '', location: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    setEventToDelete(null);
    if (!id) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!eventToEdit) return;
    try {
      const response = await api.put(`/events/${eventToEdit.id}`, {
        ...eventToEdit,
        ...editEventData
      });
      setEvents(prev =>
        prev.map(ev => (ev.id === eventToEdit.id ? response.data : ev))
      );
      setEventToEdit(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
    }
  };

  const handleCheckIn = async (participantId) => {
    try {
      await api.put(`/participations/participations/${participantId}/checkin`);
      if (selectedEvent) {
        await fetchAllParticipants(selectedEvent.id);
      }
    } catch (error) {
      console.error('Lỗi khi check-in:', error);
    }
  };

  const handleCheckOut = async (participantId) => {
    try {
      await api.put(`/participations/participations/${participantId}/checkout`);
      if (selectedEvent) {
        await fetchAllParticipants(selectedEvent.id);
      }
    } catch (error) {
      console.error('Lỗi khi check-out:', error);
    }
  };

  // Filter participants based on search and tab
  const getFilteredParticipants = () => {
    if (!selectedEvent) return [];
    const search = participantSearch.toLowerCase();
    if (activeTab === 'all') {
      return registeredParticipants.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(search)) ||
          (p.email && p.email.toLowerCase().includes(search)) ||
          (p.accountName && p.accountName.toLowerCase().includes(search)) ||
          (p.accountGmail && p.accountGmail.toLowerCase().includes(search))
      );
    }
    if (activeTab === 'checkin') {
      return checkedInParticipants.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(search)) ||
          (p.email && p.email.toLowerCase().includes(search)) ||
          (p.accountName && p.accountName.toLowerCase().includes(search)) ||
          (p.accountGmail && p.accountGmail.toLowerCase().includes(search))
      );
    }
    if (activeTab === 'checkout') {
      return checkedOutParticipants.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(search)) ||
          (p.email && p.email.toLowerCase().includes(search)) ||
          (p.accountName && p.accountName.toLowerCase().includes(search)) ||
          (p.accountGmail && p.accountGmail.toLowerCase().includes(search))
      );
    }
    return [];
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Delete Event Modal */}
      {eventToDelete && (
        <ModalConfirmDelete
          event={eventToDelete}
          onCancel={() => setEventToDelete(null)}
          onConfirm={() => handleDeleteEvent(eventToDelete.id)}
        />
      )}

      {/* Create Event Modal */}
      {showModal && (
        <ModalEventForm
          title="Tạo sự kiện mới"
          eventData={newEvent}
          setEventData={setNewEvent}
          onCancel={() => setShowModal(false)}
          onSubmit={handleCreateEvent}
          submitLabel="Tạo sự kiện"
        />
      )}

      {/* Edit Event Modal */}
      {eventToEdit && (
        <ModalEventForm
          title="Chỉnh sửa sự kiện"
          eventData={editEventData}
          setEventData={setEditEventData}
          onCancel={() => setEventToEdit(null)}
          onSubmit={handleUpdateEvent}
          submitLabel="Lưu thay đổi"
        />
      )}

      {/* Participant Management Modal */}
      {showParticipantModal && selectedEvent && (
        <ModalParticipants
          event={selectedEvent}
          loading={loadingParticipants}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          participantSearch={participantSearch}
          setParticipantSearch={setParticipantSearch}
          getFilteredParticipants={getFilteredParticipants}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onClose={() => setShowParticipantModal(false)}
          registeredParticipants={registeredParticipants}
          checkedInParticipants={checkedInParticipants}
          checkedOutParticipants={checkedOutParticipants}
        />
      )}

      {/* Dashboard */}
      <h1 className="text-3xl font-bold text-gray-800">Event Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatBox title="Tổng sự kiện" value={events.length} color="text-blue-600" />
        <StatBox title="Tổng lượt check-in" value={totalCheckin} color="text-green-600" />
        <StatBox title="Tổng lượt check-out" value={totalCheckout} color="text-red-600" />
        <StatBox title="Tỷ lệ tham dự" value={attendanceRate} color="text-yellow-600" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">Quản lý Sự kiện</h2>
          <p className="text-gray-500 text-base">Tổ chức và theo dõi các sự kiện của bạn</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:opacity-90"
        >
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-white border rounded-xl px-5 py-3 shadow-sm text-base font-medium">
          <Filter size={18} />
          Tất cả
        </button>
      </div>

      {/* Event Table - Đã sửa */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sự kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian kết thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event, index) => (
                <tr
                  key={event.id}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleManageParticipants(event)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.startTime?.slice(0, 16).replace('T', '  ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.endTime?.slice(0, 16).replace('T', '  ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      title="Chỉnh sửa"
                      onClick={e => { e.stopPropagation(); handleEditClick(event); }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                      onClick={e => { e.stopPropagation(); setEventToDelete(event); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Modal: Confirm Delete
function ModalConfirmDelete({ event, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa sự kiện</h2>
        <p className="mb-6">
          Bạn có chắc muốn xóa sự kiện <span className="font-semibold">{event.title}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal: Create/Edit Event
function ModalEventForm({ title, eventData, setEventData, onCancel, onSubmit, submitLabel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 relative shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tiêu đề"
            className="p-3 border rounded-lg"
            value={eventData.title}
            onChange={e => setEventData({ ...eventData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Địa điểm"
            className="p-3 border rounded-lg"
            value={eventData.location}
            onChange={e => setEventData({ ...eventData, location: e.target.value })}
          />
          <input
            type="datetime-local"
            className="p-3 border rounded-lg"
            value={eventData.startTime}
            onChange={e => setEventData({ ...eventData, startTime: e.target.value })}
          />
          <input
            type="datetime-local"
            className="p-3 border rounded-lg"
            value={eventData.endTime}
            onChange={e => setEventData({ ...eventData, endTime: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Mô tả sự kiện"
          className="w-full p-3 border rounded-lg mb-4"
          rows={3}
          value={eventData.description}
          onChange={e => setEventData({ ...eventData, description: e.target.value })}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal: Participants
function ModalParticipants({
  event,
  loading,
  activeTab,
  setActiveTab,
  participantSearch,
  setParticipantSearch,
  getFilteredParticipants,
  onCheckIn,
  onCheckOut,
  onClose,
  registeredParticipants,
  checkedInParticipants,
  checkedOutParticipants
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Quản lý Người tham gia</h2>
            <p className="text-blue-100 mt-1">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6">
          {/* Search */}
          <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 mb-6">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="flex-grow outline-none bg-transparent text-base"
              value={participantSearch}
              onChange={e => setParticipantSearch(e.target.value)}
            />
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              color="blue"
              icon={<Users size={18} className="inline mr-2" />}
              label={`Đã đăng ký (${registeredParticipants.length})`}
            />
            <TabButton
              active={activeTab === 'checkin'}
              onClick={() => setActiveTab('checkin')}
              color="green"
              icon={<UserCheck size={18} className="inline mr-2" />}
              label={`Check-in (${checkedInParticipants.length})`}
            />
            <TabButton
              active={activeTab === 'checkout'}
              onClick={() => setActiveTab('checkout')}
              color="red"
              icon={<UserX size={18} className="inline mr-2" />}
              label={`Check-out (${checkedOutParticipants.length})`}
            />
          </div>
          {/* List */}
          <div className="relative max-h-96 overflow-y-auto">
            {/* Overlay loading khi đang tải */}
            {loading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            )}
            <div className={loading ? "opacity-50 pointer-events-none" : ""}>
              {getFilteredParticipants().length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">
                    {participantSearch
                      ? 'Không tìm thấy người tham gia nào'
                      : 'Chưa có người tham gia nào'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredParticipants().map((participant) => (
                    <ParticipantItem
                      key={participant.id}
                      participant={participant}
                      onCheckIn={onCheckIn}
                      onCheckOut={onCheckOut}
                      activeTab={activeTab}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Button
function TabButton({ active, onClick, color, icon, label }) {
  const colorClass = active
    ? `border-${color}-500 text-${color}-600`
    : 'border-transparent text-gray-500 hover:text-gray-700';
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-base border-b-2 transition-colors ${colorClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

// Participant Item
function ParticipantItem({ participant, onCheckIn, onCheckOut, activeTab }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {participant.accountName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Tên:</span> {participant.accountName || '-'}
          </p>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Email:</span> {participant.accountGmail || '-'}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${participant.checkedIn
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
              }`}>
            </span>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${participant.checkedOut
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-500'
              }`}>
            </span>
          </div>
        </div>
      </div>
      {/* Nút Check-in/Check-out theo tab */}
      <div className="flex items-center gap-3">
        {activeTab === 'all' && !participant.checkedIn && (
          <button
            onClick={() => onCheckIn(participant.id)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Check-in
          </button>
        )}
        {activeTab === 'checkin' && !participant.checkedOut && (
          <button
            onClick={() => onCheckOut(participant.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Check-out
          </button>
        )}
        {/* Tab checkout không có nút */}
      </div>
    </div>
  );
}

export default StaffEvent;