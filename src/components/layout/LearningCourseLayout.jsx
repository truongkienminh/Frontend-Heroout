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

  // Mock API functions - thay thế bằng API thực tế
  const fetchCourseSections = async () => {
    try {
      // Giả lập API call
      const response = await fetch('/api/course/sections');
      if (!response.ok) throw new Error('Failed to fetch course sections');
      return await response.json();
    } catch (error) {
      // Mock data khi API không có sẵn
      return {
        sections: [
          {
            id: 'section1',
            title: 'Giới thiệu về ma túy',
            order: 1,
            status: 'active',
            lessons: [
              {
                id: 'lesson1',
                title: 'Khái niệm cơ bản về ma túy',
                duration: '10 phút',
                completed: true,
                type: 'video'
              },
              {
                id: 'lesson2',
                title: 'Phân loại các loại ma túy',
                duration: '15 phút',
                completed: false,
                type: 'reading'
              },
              {
                id: 'lesson3',
                title: 'Tác hại đối với sức khỏe',
                duration: '12 phút',
                completed: false,
                type: 'video'
              },
              {
                id: 'lesson4',
                title: 'Dấu hiệu nhận biết người nghiện',
                duration: '8 phút',
                completed: false,
                type: 'interactive'
              }
            ]
          },
          {
            id: 'section2',
            title: 'Tác hại của ma túy',
            order: 2,
            status: 'active',
            lessons: [
              {
                id: 'lesson5',
                title: 'Tác hại đối với cơ thể',
                duration: '20 phút',
                completed: false,
                type: 'video'
              },
              {
                id: 'lesson6',
                title: 'Tác hại đối với tinh thần',
                duration: '18 phút',
                completed: false,
                type: 'reading'
              },
              {
                id: 'lesson7',
                title: 'Ảnh hưởng đến gia đình và xã hội',
                duration: '25 phút',
                completed: false,
                type: 'case_study'
              }
            ]
          },
          {
            id: 'section3',
            title: 'Bài Kiểm Tra',
            order: 3,
            status: 'active',
            lessons: [
              {
                id: 'quiz1',
                title: 'Kiểm tra kiến thức cơ bản',
                duration: '15 phút',
                completed: false,
                type: 'quiz',
                questions: 10
              },
              {
                id: 'quiz2',
                title: 'Bài kiểm tra tổng hợp',
                duration: '30 phút',
                completed: false,
                type: 'final_exam',
                questions: 20
              }
            ]
          }
        ]
      };
    }
  };

  const updateLessonProgress = async (lessonId, completed) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to update lesson progress');
      return await response.json();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      // Cập nhật local state khi API không có sẵn
      setCourseSections(prev => 
        prev.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, completed } : lesson
          )
        }))
      );
    }
  };

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseSections();
        setCourseSections(data.sections);
        
        // Mở rộng section đầu tiên và chọn bài học đầu tiên
        if (data.sections.length > 0) {
          const firstSection = data.sections[0];
          setExpandedSections({ [firstSection.id]: true });
          if (firstSection.lessons.length > 0) {
            setActiveLesson(firstSection.lessons[0].id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson.id);
    // Đánh dấu bài học đã xem
    if (!lesson.completed) {
      updateLessonProgress(lesson.id, true);
    }
  };

  

  const getSectionStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'locked':
      default:
        return 'bg-gray-300';
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
          <p className="text-gray-600">Có lỗi xảy ra: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen ? (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Đóng sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Nội dung khóa học</h2>
              </div>

              {courseSections.map((section) => (
                <div key={section.id} className="mb-4">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 ${getSectionStatusColor(section.status)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {section.order}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{section.title}</h3>
                        <p className="text-sm text-gray-500">
                          {section.lessons.length} {section.id === 'section3' ? 'bài kiểm tra' : 'bài học'}
                        </p>
                      </div>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections[section.id] && (
                    <div className="ml-9 mt-2 space-y-2">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className={`w-full p-3 text-left rounded-lg transition-colors ${
                            activeLesson === lesson.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                section.id === 'section3' 
                                  ? 'bg-orange-100' 
                                  : 'bg-blue-100'
                              }`}>
                                {section.id === 'section3' ? (
                                  <FileText className="w-3 h-3 text-orange-600" />
                                ) : (
                                  <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{lesson.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {lesson.duration}
                                  {lesson.questions && ` • ${lesson.questions} câu hỏi`}
                                </p>
                              </div>
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
        </div>
      ) : (
        /* Collapsed sidebar */
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Mở sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">📚</span>
            <span className="text-gray-700">Phòng ngừa ma túy cơ bản</span>
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Bài {courseSections.reduce((acc, section) => acc + section.lessons.filter(l => l.completed).length, 0)}/
                {courseSections.reduce((acc, section) => acc + section.lessons.length, 0)}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">NV</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LearningCourseLayout;