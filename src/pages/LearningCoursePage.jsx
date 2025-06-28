import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Menu, ChevronRight, BookOpen, Play, Clock, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/axios';

const LearningCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const fetchChapters = async () => {
    try {
      const response = await api.get(`/chapters/course/${id}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw new Error('Không thể tải dữ liệu chương.');
    }
  };

  const handleConfirmCompletion = () => {
    // Add your completion logic here
    console.log('Chapter completed:', selectedChapter.title);
    // You can add API call to mark chapter as completed
    // Example: api.post(`/chapters/${selectedChapter.id}/complete`)
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChapters();
        if (!Array.isArray(data)) throw new Error('Dữ liệu không đúng định dạng');
        setChapters(data);
        if (data.length > 0) setSelectedChapter(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <span className="text-gray-700 font-medium text-lg">Đang tải chương...</span>
          <span className="text-gray-500 text-sm mt-1">Vui lòng chờ trong giây lát</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-red-50 to-pink-100 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Quay lại trang chủ</span>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Đóng sidebar"
            >
              <Menu className="w-5 h-5 text-blue-100 hover:text-white" />
            </button>
          </div>

          {/* Course Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Chương trình học</h2>
                <p className="text-sm text-gray-500">{chapters.length} chương</p>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <div 
                  key={chapter.id} 
                  className={`group cursor-pointer transition-all duration-200 ${
                    selectedChapter?.id === chapter.id 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                  } rounded-xl p-4`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Chapter Number */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    } transition-all duration-200`}>
                      {index + 1}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base leading-snug mb-2 ${
                        selectedChapter?.id === chapter.id 
                          ? 'text-blue-800' 
                          : 'text-gray-800 group-hover:text-blue-700'
                      } transition-colors duration-200`}>
                        {chapter.title}
                      </h3>
                      
                      {chapter.content && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {chapter.content.length > 80 
                            ? `${chapter.content.substring(0, 80)}...` 
                            : chapter.content
                          }
                        </p>
                      )}

                      {/* Chapter Meta */}
                      <div className="flex items-center mt-3 space-x-4">
                        {selectedChapter?.id === chapter.id && (
                          <div className="flex items-center text-xs text-blue-500 font-medium">
                            <Play className="w-3 h-3 mr-1" />
                            <span>Đang học</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className={`flex-shrink-0 ${
                      selectedChapter?.id === chapter.id ? 'text-blue-500' : 'text-gray-400'
                    } transition-colors duration-200`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Sidebar */}
      {!sidebarOpen && (
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6 shadow-lg">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-blue-50 rounded-xl transition-colors group"
            aria-label="Mở sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-3 hover:bg-blue-50 rounded-xl transition-colors group"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>
          <div className="bg-blue-100 rounded-xl p-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {selectedChapter ? selectedChapter.title : 'Chọn chương để bắt đầu học'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {selectedChapter ? 'Nội dung chi tiết chương' : 'Vui lòng chọn một chương từ sidebar'}
                </p>
              </div>
            </div>
            
            {selectedChapter && (
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Đang học
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedChapter ? (
            <div className="max-w-4xl mx-auto">
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-xl p-3 font-bold">
                    {chapters.findIndex(ch => ch.id === selectedChapter.id) + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedChapter.title}</h2>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Nội dung bài học
                </h3>
                
                {selectedChapter.content ? (
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50  p-6  ">
                      {selectedChapter.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Chương này chưa có nội dung.</p>
                  </div>
                )}
              </div>


            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chọn chương để bắt đầu</h3>
                <p className="text-gray-500">Vui lòng chọn một chương từ danh sách bên trái để xem nội dung.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Button - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleConfirmCompletion}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Check className="w-5 h-5 mr-2" />
          Xác nhận hoàn thành
        </button>
      </div>
    </div>
  );
};

export default LearningCoursePage;