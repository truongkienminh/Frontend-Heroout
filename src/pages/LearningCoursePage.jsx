import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningCoursePage = () => {
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState({ section1: true });
  const [activeLesson, setActiveLesson] = useState('lesson1');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const lessons = [
    {
      id: 'lesson1',
      title: 'Khái niệm cơ bản về ma túy',
      duration: '10 phút',
      completed: true,
    },
    {
      id: 'lesson2',
      title: 'Phân loại các loại ma túy',
      duration: '15 phút',
      completed: false,
    },
    {
      id: 'lesson3',
      title: 'Tác hại đối với sức khỏe',
      duration: '12 phút',
      completed: false,
    },
  ];

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

              {/* Section 1 */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('section1')}
                  className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Giới thiệu về ma túy</h3>
                      <p className="text-sm text-gray-500">4 bài học</p>
                    </div>
                  </div>
                  {expandedSections.section1 ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.section1 && (
                  <div className="ml-9 mt-2 space-y-2">
                    {lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          activeLesson === lesson.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                lesson.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">{lesson.title}</h4>
                              <p className="text-xs text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          {lesson.completed ? (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          ) : activeLesson !== lesson.id ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-3 h-3 border border-gray-300 rounded"></div>
                            </div>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2 */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('section2')}
                  className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Tác hại của ma túy</h3>
                      <p className="text-sm text-gray-500">3 bài học</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
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
          {/* Khi sidebar đóng thì nút menu đã có bên cạnh sidebar rồi, nên đây bạn có thể bỏ hoặc giữ tùy thích */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">📚</span>
            <span className="text-gray-700">Phòng ngừa ma túy cơ bản</span>
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Bài 1/10</span>
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
          <h1 className="text-2xl font-semibold text-gray-800">Nội dung bài học đang được phát triển...</h1>
        </div>
      </div>
    </div>
  );
};

export default LearningCoursePage;
