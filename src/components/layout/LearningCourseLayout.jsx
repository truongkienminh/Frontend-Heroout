import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu, ArrowLeft, Loader2, Play, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningCourseLayout = ({ children }) => {
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courseSections, setCourseSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseSections = async () => {
    try {
      const response = await fetch('https://684c6fd0ed2578be881ecef7.mockapi.io/chapter');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching course sections:', error);
      throw new Error('Không thể tải dữ liệu khóa học. Vui lòng kiểm tra kết nối mạng.');
    }
  };

  const updateLessonProgress = async (lessonId, completed) => {
    try {
      // Tìm lesson và section chứa lesson đó
      let targetSectionId = null;
      let targetLesson = null;
      
      for (const section of courseSections) {
        const lesson = section.lessons?.find(l => l.id === lessonId);
        if (lesson) {
          targetSectionId = section.id;
          targetLesson = lesson;
          break;
        }
      }

      if (!targetSectionId || !targetLesson) {
        throw new Error('Không tìm thấy bài học');
      }

      // Cập nhật trạng thái completed trong state local trước
      setCourseSections(prev =>
        prev.map(section => ({
          ...section,
          lessons: section.lessons?.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed } : lesson
          ) || []
        }))
      );

      // Có thể thêm API call để cập nhật trên server nếu cần
      // const response = await fetch(`https://684c6fd0ed2578be881ecef7.mockapi.io/chapter/${targetSectionId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...section,
      //     lessons: updatedLessons
      //   }),
      // });

    } catch (error) {
      console.error('Error updating lesson progress:', error);
      // Rollback nếu có lỗi
      setCourseSections(prev =>
        prev.map(section => ({
          ...section,
          lessons: section.lessons?.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: !completed } : lesson
          ) || []
        }))
      );
    }
  };

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCourseSections();
        
        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu không đúng định dạng');
        }

        setCourseSections(data);

        // Tự động mở section đầu tiên và chọn lesson đầu tiên
        if (data.length > 0) {
          const firstSection = data[0];
          setExpandedSections({ [firstSection.id]: true });
          
          if (firstSection.lessons && firstSection.lessons.length > 0) {
            setActiveLesson(firstSection.lessons[0].id);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson.id);
    if (!lesson.completed) {
      updateLessonProgress(lesson.id, true);
    }
  };

  const getSectionStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'locked':
      default: return 'bg-gray-300';
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <FileText className="w-3 h-3 text-orange-600" />;
      case 'video':
      case 'reading':
      case 'interactive':
      case 'case_study':
      default:
        return <Play className="w-3 h-3 text-blue-600 fill-blue-600" />;
    }
  };

  const getLessonIconBackground = (type) => {
    switch (type) {
      case 'quiz':
        return 'bg-orange-100';
      default:
        return 'bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Đang tải khóa học...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600 mb-2">Có lỗi xảy ra:</p>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Tính toán số bài học đã hoàn thành và tổng số bài học
  const completedLessons = courseSections.reduce((acc, section) => {
    return acc + (section.lessons?.filter(l => l.completed).length || 0);
  }, 0);
  
  const totalLessons = courseSections.reduce((acc, section) => {
    return acc + (section.lessons?.length || 0);
  }, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen ? (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Đóng sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Nội dung khóa học</h2>
            {courseSections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 ${getSectionStatusColor(section.status)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {section.order}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.lessons?.length || 0} {section.title?.includes('Kiểm Tra') ? 'bài kiểm tra' : 'bài học'}
                      </p>
                    </div>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections[section.id] && section.lessons && (
                  <div className="ml-9 mt-2 space-y-2">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${activeLesson === lesson.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getLessonIconBackground(lesson.type)}`}>
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{lesson.title}</h4>
                            <p className="text-xs text-gray-500">
                              {lesson.duration}
                              {lesson.questions && ` • ${lesson.questions} câu hỏi`}
                              
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
          <button 
            onClick={toggleSidebar} 
            className="p-1 hover:bg-gray-100 rounded transition-colors" 
            aria-label="Mở sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">📚</span>
            <span className="text-gray-700">Phòng ngừa ma túy cơ bản</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Bài {completedLessons} / {totalLessons}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">NV</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};

export default LearningCourseLayout;