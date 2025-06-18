import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, Edit2, Trash2, UserCheck, UserX, Search, Filter } from 'lucide-react';

const StaffEvent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Hội thảo Công nghệ 2025',
      description: 'Hội thảo về các xu hướng công nghệ mới nhất',
      date: '2025-07-15',
      time: '09:00',
      location: 'Trung tâm Hội nghị Quốc gia',
      participants: [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', checkedIn: false },
        { id: 2, name: 'Trần Thị B', email: 'b@email.com', checkedIn: true },
        { id: 3, name: 'Lê Văn C', email: 'c@email.com', checkedIn: false }
      ]
    },
    {
      id: 2,
      name: 'Workshop Marketing Digital',
      description: 'Khóa học thực hành về marketing số',
      date: '2025-07-20',
      time: '14:00',
      location: 'Coworking Space ABC',
      participants: [
        { id: 4, name: 'Phạm Văn D', email: 'd@email.com', checkedIn: true },
        { id: 5, name: 'Hoàng Thị E', email: 'e@email.com', checkedIn: false }
      ]
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'participants'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: ''
  });

  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' or 'checkout'

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      location: ''
    });
  };

  // CRUD Operations
  const createEvent = () => {
    const newEvent = {
      id: Date.now(),
      ...formData,
      participants: []
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    resetForm();
  };

  const updateEvent = () => {
    setEvents(events.map(event =>
      event.id === selectedEvent.id
        ? { ...event, ...formData }
        : event
    ));
    setShowModal(false);
    resetForm();
    setSelectedEvent(null);
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  // Participant Management
  const addParticipant = () => {
    if (!newParticipant.name || !newParticipant.email) return;

    const participant = {
      id: Date.now(),
      ...newParticipant,
      checkedIn: false
    };

    setEvents(events.map(event =>
      event.id === selectedEvent.id
        ? { ...event, participants: [...event.participants, participant] }
        : event
    ));

    setNewParticipant({ name: '', email: '' });
  };

  const removeParticipant = (eventId, participantId) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, participants: event.participants.filter(p => p.id !== participantId) }
        : event
    ));
  };

  // Check-in/Check-out
  const toggleCheckIn = (eventId, participantId) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? {
          ...event,
          participants: event.participants.map(participant =>
            participant.id === participantId
              ? { ...participant, checkedIn: !participant.checkedIn }
              : participant
          )
        }
        : event
    ));
  };

  // Modal handlers
  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location
    });
    setModalType('edit');
    setShowModal(true);
  };

  const openParticipantsModal = (event) => {
    setSelectedEvent(event);
    setModalType('participants');
    setShowModal(true);
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'upcoming') return matchesSearch && new Date(event.date) >= new Date();
    if (filterStatus === 'past') return matchesSearch && new Date(event.date) < new Date();

    return matchesSearch;
  });

  // Get event statistics
  const getEventStats = (event) => {
    const checkedIn = event.participants.filter(p => p.checkedIn).length;
    const total = event.participants.length;
    return { checkedIn, total };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Event Dashboard</h2>
        {/* Tổng quan toàn bộ sự kiện */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredEvents.length}</p>
            <p className="text-sm text-gray-500 mt-1">Tổng sự kiện</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredEvents.reduce((total, event) => total + getEventStats(event).checkedIn, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Tổng lượt check-in</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {filteredEvents.reduce((total, event) => total + getEventStats(event).checkedOut, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Tổng lượt check-out</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {(() => {
                const totalParticipants = filteredEvents.reduce((sum, event) => sum + getEventStats(event).total, 0);
                const totalCheckIn = filteredEvents.reduce((sum, event) => sum + getEventStats(event).checkedIn, 0);
                return totalParticipants ? `${Math.round((totalCheckIn / totalParticipants) * 100)}%` : '0%';
              })()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Tỷ lệ tham dự</p>
          </div>
        </div>

        {/* Header */}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý Sự kiện</h1>
              <p className="text-gray-600">Tổ chức và theo dõi các sự kiện của bạn</p>
            </div>
            <button
              onClick={openCreateModal}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Tạo Sự kiện
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                <option value="all">Tất cả</option>
                <option value="upcoming">Sắp tới</option>
                <option value="past">Đã qua</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map(event => {
            const stats = getEventStats(event);
            const isUpcoming = new Date(event.date) >= new Date();

            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className={`h-2 ${isUpcoming ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}></div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{event.name}</h3>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={16} className="text-blue-500" />
                      <span className="text-sm">{event.date} lúc {event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={16} className="text-red-500" />
                      <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users size={16} className="text-green-500" />
                      <span className="text-sm">
                        {stats.total} người tham gia
                      </span>
                    </div>
                  </div>

                  {/* Check-in Stats */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tình trạng check-in</span>
                      <span className="text-sm text-gray-600">{stats.checkedIn}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: stats.total > 0 ? `${(stats.checkedIn / stats.total) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => openParticipantsModal(event)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Quản lý Người tham gia
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalType === 'create' && 'Tạo Sự kiện Mới'}
                {modalType === 'edit' && 'Chỉnh sửa Sự kiện'}
                {modalType === 'participants' && `Quản lý Người tham gia - ${selectedEvent?.name}`}
              </h2>
            </div>

            <div className="p-6">
              {(modalType === 'create' || modalType === 'edit') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên sự kiện</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên sự kiện"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                      placeholder="Mô tả sự kiện"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Địa điểm tổ chức"
                    />
                  </div>
                </div>
              )}

              {modalType === 'participants' && selectedEvent && (
                <div className="space-y-6">
                  {/* Add Participant */}
                  {/* Stats Today */}
                  <div className="bg-white border rounded-xl p-5 space-y-4">
                    <h2 className="font-semibold text-gray-800 text-base">DashBoard</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedEvent.participants.filter(p => p.checkedIn).length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Tổng check-in</p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {selectedEvent.participants.filter(p => p.checkedIn && p.checkedOut).length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Tổng check-out</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedEvent.participants.filter(p => p.checkedIn && !p.checkedOut).length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Hiện tại có mặt</p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {Math.round((selectedEvent.participants.filter(p => p.checkedIn).length / selectedEvent.participants.length) * 100) || 0}%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Tỷ lệ tham dự</p>
                      </div>
                    </div>
                  </div>


                  {/* Tab Navigation */}


                  <div className="flex space-x-6 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('checkin')}
                      className={`relative pb-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'checkin' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      <UserCheck size={16} />
                      Check-in ({selectedEvent.participants.filter(p => !p.checkedIn).length})
                      {activeTab === 'checkin' && (
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black" />
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('checkout')}
                      className={`relative pb-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'checkout' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      <UserX size={16} />
                      Check-out ({selectedEvent.participants.filter(p => p.checkedIn).length})
                      {activeTab === 'checkout' && (
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black" />
                      )}
                    </button>
                  </div>




                  {/* Check-in Tab */}
                  {activeTab === 'checkin' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-lg">Danh sách chưa check-in</h3>
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedEvent.participants.filter(p => !p.checkedIn).length} người
                        </div>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedEvent.participants.filter(p => !p.checkedIn).map(participant => (
                          <div key={participant.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                                <span className="text-orange-700 font-medium text-sm">
                                  {participant.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{participant.name}</p>
                                <p className="text-sm text-gray-600">{participant.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCheckIn(selectedEvent.id, participant.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                              >
                                <UserCheck size={16} />
                                Check-in
                              </button>
                              <button
                                onClick={() => removeParticipant(selectedEvent.id, participant.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa người tham gia"
                              >

                              </button>
                            </div>
                          </div>
                        ))}
                        {selectedEvent.participants.filter(p => !p.checkedIn).length === 0 && (
                          <div className="text-center py-12">
                            <div className="text-green-400 mb-4">
                              <UserCheck size={64} className="mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg">Tất cả đã check-in!</p>
                            <p className="text-gray-400 text-sm mt-2">Không còn ai cần check-in</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Check-out Tab */}
                  {activeTab === 'checkout' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-lg">Danh sách đã check-in</h3>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedEvent.participants.filter(p => p.checkedIn).length} người
                        </div>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedEvent.participants.filter(p => p.checkedIn).map(participant => (
                          <div key={participant.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                                <span className="text-green-700 font-medium text-sm">
                                  {participant.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{participant.name}</p>
                                <p className="text-sm text-gray-600">{participant.email}</p>
                              </div>
                              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                Đã check-in
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCheckIn(selectedEvent.id, participant.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                              >
                                <UserX size={16} />
                                Check-out
                              </button>
                              <button
                                onClick={() => removeParticipant(selectedEvent.id, participant.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa người tham gia"
                              >

                              </button>
                            </div>
                          </div>
                        ))}
                        {selectedEvent.participants.filter(p => p.checkedIn).length === 0 && (
                          <div className="text-center py-12">
                            <div className="text-orange-400 mb-4">
                              <UserX size={64} className="mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg">Chưa có ai check-in!</p>
                            <p className="text-gray-400 text-sm mt-2">Hãy chuyển sang tab Check-in để bắt đầu</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Đóng
              </button>
              {(modalType === 'create' || modalType === 'edit') && (
                <button
                  onClick={modalType === 'create' ? createEvent : updateEvent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  {modalType === 'create' ? 'Tạo' : 'Cập nhật'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffEvent;