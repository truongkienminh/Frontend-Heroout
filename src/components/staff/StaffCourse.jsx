import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Eye, Plus, Trash2, Pencil, X, BookOpen, ChevronRight } from 'lucide-react';
import api from '../../services/axios';

const StaffCourse = () => {
  // ...existing state...
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup chapter state
  const [showChapter, setShowChapter] = useState(false);
  const [chapterCourse, setChapterCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterLoading, setChapterLoading] = useState(false);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    objectives: '',
    overview: '',
    ageGroup: '',
    chapters: [{ title: '', content: '' }],
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
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...newCourse.chapters];
    updatedChapters[index][field] = value;
    setNewCourse({ ...newCourse, chapters: updatedChapters });
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
        chapters: [{ title: '', content: '' }],
      });
    } catch (error) {
      console.error('Tạo khóa học thất bại:', error);
    }
  };




  // Delete course
  const handleDeleteCourse = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Xóa khóa học thất bại:', error);
    }
  };

  const handleShowChapters = async (course) => {
    setChapterCourse(course);
    setShowChapter(true);
    setChapterLoading(true);
    try {
      const res = await api.get(`/chapters/course/${course.id}`);
      setChapters(res.data || []);
    } catch (error) {
      setChapters([]);
    } finally {
      setChapterLoading(false);
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
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 to-emerald-600 text-white rounded-lg hover:bg-blue-700 transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 relative">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                onClick={() => setShowCreate(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white">Tạo khóa học mới</h2>
              <p className="text-blue-100 mt-1">Điền thông tin để tạo khóa học của bạn</p>
            </div>

            {/* Form Content */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <form id="course-form" onSubmit={handleCreateCourse} className="p-8 space-y-6">
                {/* Course Title */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Tên khóa học *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên khóa học..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả ngắn gọn về khóa học..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300 resize-none"
                  />
                </div>

                {/* Objectives and Overview Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mục tiêu
                    </label>
                    <input
                      type="text"
                      name="objectives"
                      value={newCourse.objectives}
                      onChange={handleInputChange}
                      placeholder="Mục tiêu học tập..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Tổng quan
                    </label>
                    <input
                      type="text"
                      name="overview"
                      value={newCourse.overview}
                      onChange={handleInputChange}
                      placeholder="Tổng quan về khóa học..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Age Group */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Nhóm tuổi
                  </label>
                  <select
                    name="ageGroup"
                    value={newCourse.ageGroup}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    <option value="">-- Chọn nhóm tuổi --</option>
                    <option value="CHILDREN">Trẻ em (CHILDREN)</option>
                    <option value="TEENAGERS">Thiếu niên (TEENAGERS)</option>
                    <option value="YOUNG_ADULTS">Thanh niên (YOUNG_ADULTS)</option>
                    <option value="ADULTS">Người lớn (ADULTS)</option>
                    <option value="SENIORS">Người cao tuổi (SENIORS)</option>
                  </select>
                </div>

                {/* Chapters Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Chương trình học
                    </label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {newCourse.chapters.length} chương
                    </span>
                  </div>

                  <div className="space-y-4">
                    {newCourse.chapters.map((chapter, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 transition-all duration-200">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </div>
                            <span className="text-sm font-semibold text-gray-800">Chương {index + 1}</span>
                          </div>
                          {newCourse.chapters.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...newCourse.chapters];
                                updated.splice(index, 1);
                                setNewCourse({ ...newCourse, chapters: updated });
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
                              title="Xóa chương"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Tiêu đề chương..."
                            value={chapter.title}
                            onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:borblue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
                          />
                          <textarea
                            placeholder="Nội dung chi tiết của chương..."
                            value={chapter.content}
                            onChange={(e) => handleChapterChange(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNewCourse({
                        ...newCourse,
                        chapters: [...newCourse.chapters, { title: '', content: '' }],
                      })
                    }
                    className="w-full border-2 border-dashed border-blue-300 rounded-xl py-4 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm chương mới
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Actions - Always Visible */}
            <div className="border-t bg-gray-50 px-8 py-4 flex justify-end space-x-4 shadow-lg">
              <button
                type="button"
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 flex items-center"
                onClick={() => setShowCreate(false)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleCreateCourse}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tạo khóa học
              </button>
            </div>
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
                <tr
                  key={course.id}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleShowChapters(course)}
                >
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
                    {course.ageGroup || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.totalEnrollment || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.createdDate || (course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                      onClick={e => { e.stopPropagation(); handleDeleteCourse(course.id); }}
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

      {/* Chapter Popup */}
      {showChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 to-emerald-600 px-8 py-6 relative">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                onClick={() => setShowChapter(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-xl p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">Danh sách chương</h2>
                  <p className="text-blue-100 mt-1 text-lg font-medium">{chapterCourse?.title}</p>
                  {chapterCourse?.content && (
                    <div className="mt-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <span className="block text-white font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mô tả khóa học:
                      </span>
                      <p className="text-blue-50 whitespace-pre-line leading-relaxed">{chapterCourse.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="p-8">
                {chapterLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <span className="mt-4 text-gray-600 font-medium">Đang tải danh sách chương...</span>
                  </div>
                ) : chapters.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có chương nào</h3>
                    <p className="text-gray-500">Khóa học này chưa có chương nào được tạo.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chapter Statistics */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-3 mr-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Tổng quan khóa học</h3>
                            <p className="text-gray-600">Thông tin chi tiết về các chương</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{chapters.length}</div>
                          <div className="text-sm text-gray-500">Chương</div>
                        </div>
                      </div>
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-6">
                      {chapters.map((chapter, idx) => (
                        <div
                          key={chapter.id}
                          className="group border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            {/* Chapter Number Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                                {idx + 1}
                              </div>
                            </div>

                            {/* Chapter Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                                  Chương {idx + 1}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                              </div>

                              <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-200">
                                {chapter.title}
                              </h3>

                              <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center mb-3">
                                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="font-semibold text-gray-700">Nội dung chương:</span>
                                </div>

                                {chapter.content && chapter.content.length > 0 ? (
                                  <div className="text-gray-700 leading-relaxed whitespace-pre-line p-4 ">
                                    {chapter.content}
                                  </div>
                                ) : (
                                  <div className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Chương này chưa có nội dung
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCourse;