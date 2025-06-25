import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

const CourseCard = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center py-10 text-gray-600 text-lg">Đang tải...</div>;

  // Lọc courses theo searchTerm (không phân biệt hoa thường)
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course, index) => (
          <CourseCardItem key={course.id} course={course} delay={index * 100} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10">Không tìm thấy khóa học phù hợp.</div>
      )}
    </div>
  );
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
      onClick={handleCardClick}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Thanh đầu card */}
      <div className="w-full bg-gradient-to-r from-emerald-500 to-green-600 h-12 px-6 flex items-center justify-between rounded-t-xl">
  <span className="text-white text-sm font-semibold uppercase tracking-wide">Khóa học</span>
</div>


      {/* Nội dung card */}
      <div className="p-5 pt-5 pb-6 flex flex-col h-full">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{course.title}</h3>

        {course.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{course.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <span>Nhóm tuổi: {course.ageGroup}</span>
          <span className="text-xs text-gray-400">
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Nút đăng ký full width và bo góc đáy */}
        <button
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};




export { CourseCard };
