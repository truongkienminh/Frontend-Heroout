import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage = () => {
  const { user } = useAuth(); // Lấy user từ context
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get(`/courses/not-started`, {
          params: user?.id ? { accountId: user.id } : {}
        });
        setCourses(res.data || []);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        if (!user || !user.id) {
          setMyCourses([]);
          return;
        }
        const res = await api.get(`/courses/in-progress`, {
          params: { accountId: user.id }
        });
        setMyCourses(res.data || []);
      } catch (error) {
        setMyCourses([]);
      }
    };
    fetchMyCourses();
  }, [user]);


  // Lọc courses theo searchTerm (không phân biệt hoa thường)
  const filteredCourses = courses.filter(course =>
    (course.title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );


  // Tính toán carousel
  const coursesPerSlide = 3;
  const totalSlides = Math.ceil(filteredCourses.length / coursesPerSlide);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalSlides - 1;

  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const CourseCardItem = ({ course, delay }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    const handleCardClick = () => {
      navigate(`/coursedetail/${course.id}`);
    };

    return (
      <div
        className={`rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-[1.01] 
    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {/* Header icon section - matching the image */}
        <div className="w-full bg-gradient-to-r from-blue-100 to-indigo-100 h-24 flex items-center justify-center rounded-t-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 flex flex-col">
          {/* Title - larger and bolder */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>

          {/* Description - gray text */}
          <p className="text-gray-600 text-base mb-6">{course.description}</p>

          {/* Event details with icons */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-sm">
                {course.ageGroup}
              </span>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-sm">
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : ''}
              </span>
            </div>
          </div>

          {/* Button - matching the blue style */}
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleCardClick}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Khóa học</h1>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Course Carousel */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">Đang tải...</div>
        ) : (
          <div className="relative">
            {/* Carousel Container with Side Navigation */}
            <div className="flex items-center">
              {/* Left Navigation Button */}
              <button
                onClick={handlePrevious}
                disabled={!canGoPrev}
                className={`p-3 rounded-full border-2 transition-all duration-200 mr-4 flex-shrink-0 ${canGoPrev
                  ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Carousel Content */}
              <div className="flex-1 overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }, (_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {filteredCourses
                          .slice(slideIndex * coursesPerSlide, (slideIndex + 1) * coursesPerSlide)
                          .map((course, index) => (
                            <CourseCardItem
                              key={course.id}
                              course={course}
                              delay={(slideIndex * coursesPerSlide + index) * 100}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Navigation Button */}
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`p-3 rounded-full border-2 transition-all duration-200 ml-4 flex-shrink-0 ${canGoNext
                  ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center text-gray-500 py-10">Không tìm thấy khóa học phù hợp.</div>
            )}
          </div>
        )}

        {/* My Courses Section */}
        <div className="mb-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Khóa học của tôi</h2>
          {myCourses.length === 0 ? (
            <div className="text-gray-500">Bạn chưa có khóa học nào đang học.</div>
          ) : (
            myCourses.map((course) => {
              // Giả sử API trả về các trường: title, progress, completedLessons, totalLessons
              const percent = course.progress || Math.round(((course.completedChapter || 0) / (course.totalChapter || 1)) * 100);
              return (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center px-6 py-4 mb-6 max-w-full">
                  {/* Image placeholder */}
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mr-5">
                    <span className="text-blue-500 font-semibold text-xs">IMG</span>
                  </div>
                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 text-base truncate">{course.title}</div>
                        <div className="text-gray-500 text-sm mt-1">
                          {percent}% hoàn thành • Bài {course.completedChapter || 0}/{course.totalChapter || 0}
                        </div>
                      </div>
                      <button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
                        onClick={() => window.location.href = `/learningcourse/${course.id}`}
                      >
                        Tiếp tục
                      </button>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;