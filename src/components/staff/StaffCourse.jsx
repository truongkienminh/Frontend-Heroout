import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Eye, Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../services/axios';

const StaffCourse = () => {
  // ...existing state...
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    objectives: '',
    overview: '',
    ageGroup: '',
  });

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editCourse, setEditCourse] = useState({
    id: '',
    title: '',
    description: '',
    objectives: '',
    overview: '',
    ageGroup: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data || []);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    {
      title: "Tổng khóa học",
      value: courses.length
    },
    {
      title: "Tổng đăng ký",
      value: courses.reduce((sum, c) => sum + (c.students || 0), 0),
      color: "text-blue-600"
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', newCourse);
      const res = await api.get('/courses');
      setCourses(res.data || []);
      setShowCreate(false);
      setNewCourse({
        title: '',
        description: '',
        objectives: '',
        overview: '',
        ageGroup: '',
      });
    } catch (error) {
      alert('Tạo khóa học thất bại!');
    }
  };

  // Edit course
  const handleEditCourse = (course) => {
    setEditCourse({
      id: course.id,
      title: course.title,
      description: course.description,
      objectives: course.objectives,
      overview: course.overview,
      ageGroup: course.ageGroup,
    });
    setShowEdit(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${editCourse.id}`, {
        title: editCourse.title,
        description: editCourse.description,
        objectives: editCourse.objectives,
        overview: editCourse.overview,
        ageGroup: editCourse.ageGroup,
      });
      const res = await api.get('/courses');
      setCourses(res.data || []);
      setShowEdit(false);
    } catch (error) {
      alert('Cập nhật khóa học thất bại!');
    }
  };

  // Delete course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      alert('Xóa khóa học thất bại!');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600 text-lg">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
        <div className="flex items-center space-x-4">
          {/* Create Course Button */}
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Tạo khóa học</span>
          </button>
          {/* Search and Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowCreate(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900">Tạo khóa học mới</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu</label>
                <input
                  type="text"
                  name="objectives"
                  value={newCourse.objectives}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng quan</label>
                <input
                  type="text"
                  name="overview"
                  value={newCourse.overview}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm tuổi</label>
                <input
                  type="text"
                  name="ageGroup"
                  value={newCourse.ageGroup}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-3 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowCreate(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowEdit(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900">Chỉnh sửa khóa học</h2>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
                <input
                  type="text"
                  name="title"
                  value={editCourse.title}
                  onChange={handleEditInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={editCourse.description}
                  onChange={handleEditInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu</label>
                <input
                  type="text"
                  name="objectives"
                  value={editCourse.objectives}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng quan</label>
                <input
                  type="text"
                  name="overview"
                  value={editCourse.overview}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm tuổi</label>
                <input
                  type="text"
                  name="ageGroup"
                  value={editCourse.ageGroup}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-3 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowEdit(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <div className={`text-3xl font-bold ${stat.color || 'text-gray-900'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* ...existing card code... */}
          </div>
        ))}
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhóm tuổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course, index) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(course.duration || "") + (course.lessons ? ` • ${course.lessons} bài học` : "")}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.ageGroup || NULL}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.totalEnrollmentCourse || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.createdDate || (course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700" title="Sửa" onClick={() => handleEditCourse(course)}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                      onClick={() => handleDeleteCourse(course.id)}
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

export default StaffCourse;