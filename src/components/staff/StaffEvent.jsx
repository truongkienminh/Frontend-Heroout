import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, MapPin, Plus, Edit2, Trash2, Search, Filter, X, CheckCircle, Circle, UserCheck, UserX
} from 'lucide-react';
import api from '../../services/axios';

const StaffEvent = () => {
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [checkedInParticipants, setCheckedInParticipants] = useState([]);

  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventToEdit, setEventToEdit] = useState(null);
  const [editEventData, setEditEventData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });

  // Participant management states
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participantSearch, setParticipantSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'checkin', 'checkout'

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
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!showParticipantModal || !selectedEvent) return;

      setLoadingParticipants(true);
      try {
        if (activeTab === 'all') {
          const response = await api.get('/participations/registered', {
            params: { eventId: selectedEvent.id }
          });
          setRegisteredParticipants(response.data);
        } else if (activeTab === 'checkin') {
          const response = await api.get('/participations/checked-in', {
            params: { eventId: selectedEvent.id }
          });
          setCheckedInParticipants(response.data);
        } 
        
      } catch (error) {
        if (activeTab === 'all') setRegisteredParticipants([]);
        if (activeTab === 'checkin') setCheckedInParticipants([]);
        
        console.error('Lỗi khi lấy danh sách người tham gia:', error);
      } finally {
        setLoadingParticipants(false);
      }
    };
    fetchParticipants();
  }, [showParticipantModal, activeTab, selectedEvent]);

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

  const totalCheckin = events.reduce((sum, e) => (
    sum + (e.participants?.filter(p => p.checkedIn)?.length || 0)
  ), 0);

  const totalCheckout = events.reduce((sum, e) => (
    sum + (e.participants?.filter(p => p.checkedOut)?.length || 0)
  ), 0);

  const totalParticipants = events.reduce((sum, e) => sum + (e.participants?.length || 0), 0);
  const attendanceRate = totalParticipants ? `${Math.round((totalCheckin / totalParticipants) * 100)}%` : '0%';

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
      const response = await api.put(`/events/${selectedEvent.id}/participants/${participantId}/checkin`);
      setEvents(prev =>
        prev.map(ev => (ev.id === selectedEvent.id ? response.data : ev))
      );
      setSelectedEvent(response.data);
    } catch (error) {
      console.error('Lỗi khi check-in:', error);
    }
  };

  const handleCheckOut = async (participantId) => {
    try {
      const response = await api.put(`/events/${selectedEvent.id}/participants/${participantId}/checkout`);
      setEvents(prev =>
        prev.map(ev => (ev.id === selectedEvent.id ? response.data : ev))
      );
      setSelectedEvent(response.data);
    } catch (error) {
      console.error('Lỗi khi check-out:', error);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter participants based on search and tab
  const getFilteredParticipants = () => {
  if (!selectedEvent) return [];

  if (activeTab === 'all') {
    return registeredParticipants.filter(participant =>
      participant.name?.toLowerCase().includes(participantSearch.toLowerCase()) ||
      participant.email?.toLowerCase().includes(participantSearch.toLowerCase())
    );
  }
  if (activeTab === 'checkin') {
    return checkedInParticipants.filter(participant =>
      participant.name?.toLowerCase().includes(participantSearch.toLowerCase()) ||
      participant.email?.toLowerCase().includes(participantSearch.toLowerCase())
    );
  }
 

  return [];
};

  if (loading) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Delete Event Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa sự kiện</h2>
            <p className="mb-6">Bạn có chắc muốn xóa sự kiện <span className="font-semibold">{eventToDelete.title}</span>?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteEvent(eventToDelete.id)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tạo sự kiện mới</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Tiêu đề"
                className="p-3 border rounded-lg"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Địa điểm"
                className="p-3 border rounded-lg"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <input
                type="datetime-local"
                className="p-3 border rounded-lg"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
              <input
                type="datetime-local"
                className="p-3 border rounded-lg"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Mô tả sự kiện"
              className="w-full p-3 border rounded-lg mb-4"
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tạo sự kiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {eventToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chỉnh sửa sự kiện</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Tiêu đề"
                className="p-3 border rounded-lg"
                value={editEventData.title}
                onChange={e => setEditEventData({ ...editEventData, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Địa điểm"
                className="p-3 border rounded-lg"
                value={editEventData.location}
                onChange={e => setEditEventData({ ...editEventData, location: e.target.value })}
              />
              <input
                type="datetime-local"
                className="p-3 border rounded-lg"
                value={editEventData.startTime}
                onChange={e => setEditEventData({ ...editEventData, startTime: e.target.value })}
              />
              <input
                type="datetime-local"
                className="p-3 border rounded-lg"
                value={editEventData.endTime}
                onChange={e => setEditEventData({ ...editEventData, endTime: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Mô tả sự kiện"
              className="w-full p-3 border rounded-lg mb-4"
              rows={3}
              value={editEventData.description}
              onChange={e => setEditEventData({ ...editEventData, description: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEventToEdit(null)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participant Management Modal */}
      {showParticipantModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div>
                <h2 className="text-2xl font-bold">Quản lý Người tham gia</h2>
                <p className="text-blue-100 mt-1">{selectedEvent.title}</p>
              </div>
              <button
                onClick={() => setShowParticipantModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Search Bar */}
              <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 mb-6">
                <Search size={20} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  className="flex-grow outline-none bg-transparent text-base"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 font-medium text-base border-b-2 transition-colors ${activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Users size={18} className="inline mr-2" />
                  Đã đăng ký ({selectedEvent.participants?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('checkin')}
                  className={`px-6 py-3 font-medium text-base border-b-2 transition-colors ${activeTab === 'checkin'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <UserCheck size={18} className="inline mr-2" />
                  Check-in ({selectedEvent.participants?.filter(p => p.checkedIn && !p.checkedOut)?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`px-6 py-3 font-medium text-base border-b-2 transition-colors ${activeTab === 'checkout'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <UserX size={18} className="inline mr-2" />
                  Check-out ({selectedEvent.participants?.filter(p => p.checkedOut)?.length || 0})
                </button>
              </div>

              {/* Participants List */}
              <div className="max-h-96 overflow-y-auto">
                {loadingParticipants ? (
                  <div className="text-center py-12 text-gray-500">Đang tải danh sách...</div>
                ) : getFilteredParticipants().length === 0 ? (
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
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {participant.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-base">
                              {participant.name || 'Không có tên'}
                            </h4>
                            <p className="text-gray-500 text-sm">{participant.email}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${participant.checkedIn
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {participant.checkedIn ? <CheckCircle size={12} /> : <Circle size={12} />}
                                Check-in: {participant.checkedIn ? 'Đã vào' : 'Chưa vào'}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${participant.checkedOut
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {participant.checkedOut ? <CheckCircle size={12} /> : <Circle size={12} />}
                                Check-out: {participant.checkedOut ? 'Đã ra' : 'Chưa ra'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {!participant.checkedIn ? (
                            <button
                              onClick={() => handleCheckIn(participant.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              Check-in
                            </button>
                          ) : (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              ✓ Đã vào
                            </span>
                          )}

                          {participant.checkedIn && !participant.checkedOut ? (
                            <button
                              onClick={() => handleCheckOut(participant.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                              Check-out
                            </button>
                          ) : participant.checkedOut ? (
                            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                              ✓ Đã ra
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                              Chưa vào
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Tổng: {selectedEvent.participants?.length || 0} người |
                  Check-in: {selectedEvent.participants?.filter(p => p.checkedIn)?.length || 0} |
                  Check-out: {selectedEvent.participants?.filter(p => p.checkedOut)?.length || 0}
                </div>
                <button
                  onClick={() => setShowParticipantModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
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
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:opacity-90"
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

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => {
          const total = event.participants?.length || 0;
          const checked = event.participants?.filter(p => p.checkedIn).length || 0;

          return (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 border relative min-h-[260px]">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl" />

              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <div className="flex gap-3">
                  <Edit2
                    size={18}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditClick(event)}
                  />
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={() => setEventToDelete(event)}
                  />
                </div>
              </div>

              <p className="text-gray-500 text-base mb-4">{event.description}</p>

              <div className="space-y-3 text-base text-gray-600">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  {event.startTime?.slice(0, 16).replace('T', ' lúc ')}
                  {event.endTime &&
                    <>
                      <span className="mx-1 text-gray-400">-</span>
                      {event.endTime.slice(0, 16).replace('T', ' lúc ')}
                    </>
                  }
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  {event.location}
                </div>
              </div>

              <button
                onClick={() => handleManageParticipants(event)}
                className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-base font-semibold hover:opacity-90"
              >
                Quản lý Người tham gia
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatBox = ({ title, value, color }) => (
  <div className="bg-white shadow-md border rounded-xl p-6 text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500 text-base mt-2">{title}</p>
  </div>
);

export default StaffEvent;