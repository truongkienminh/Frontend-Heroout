import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User, Star, Play, BookOpen, Clock, Award, Users } from 'lucide-react';

// Reusable Card component with entrance animation
const Card = ({ children, className = "", delay = 0, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-700 hover:shadow-xl hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Badge component with hover effects
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    basic: "bg-[#16a34a] text-white hover:bg-[#15803d]",
    advanced: "bg-[#fef3c7] text-yellow-800 hover:bg-[#fde68a]",
    expert: "bg-[#FECACA] text-red-800 hover:bg-[#FCA5A5]",
    default: "bg-green-100 text-green-800 hover:bg-green-200"
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 transform hover:scale-110 ${variants[variant] || variants.default
      }`}>
      {children}
    </span>
  );
};

const CourseCard = () => {
  const courses = [
    {
      id: 1,
      title: "Phòng ngừa ma túy cơ bản",
      description: "Khóa học giúp hiểu rõ về tác hại của ma túy và cách phòng ngừa hiệu quả.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop",
      students: 1234,
      rating: 4.8,
      level: "CƠ BẢN",
      levelColor: "basic"
    },
    {
      id: 2,
      title: "Tư vấn và hỗ trợ cộng đồng",
      description: "Kỹ năng tư vấn và hỗ trợ người có nguy cơ sử dụng ma túy.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      students: 856,
      rating: 4.9,
      level: "NÂNG CAO",
      levelColor: "advanced"
    },
    {
      id: 3,
      title: "Phục hồi và tái hòa nhập",
      description: "Hỗ trợ quá trình phục hồi và tái hòa nhập cộng đồng.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      students: 432,
      rating: 4.7,
      level: "CHUYÊN SÂU",
      levelColor: "expert"
    }
  ];

  return (
    <>
      {courses.map((course, index) => (
        <CourseCardItem key={course.id} course={course} delay={index * 200} />
      ))}
    </>
  );
};

const CourseCardItem = ({ course, delay }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    navigate(`/coursedetail/${course.id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Ngăn event bubbling
    // Xử lý đăng ký khóa học ở đây
    console.log(`Đăng ký khóa học: ${course.title}`);
  };

  return (
    <Card delay={delay} className="group" onClick={handleCardClick}>
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
          <Badge variant={course.levelColor}>{course.level}</Badge>
        </div>
        <div className="absolute top-3 right-3 transform transition-all duration-300 opacity-0 group-hover:opacity-100">

        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">{course.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500 group-hover:text-green-600 transition-colors duration-300">
            <Users className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
            <span>{course.students.toLocaleString()}</span>
          </div>

          <div className="flex items-center">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-all duration-300 ${star <= Math.floor(course.rating)
                    ? 'text-yellow-400 fill-current scale-100'
                    : 'text-gray-300 scale-75'
                    } group-hover:scale-110`}
                  style={{ transitionDelay: `${star * 50}ms` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors duration-300">
              {course.rating}
            </span>
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleButtonClick}
        >
          <span className="transition-transform duration-300 hover:translate-x-1">
            Đăng ký
          </span>
        </button>
      </div>
    </Card>
  );
};

const ProgressCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const myCourses = [
    {
      id: 1,
      title: "Phòng ngừa ma túy cơ bản",
      description: "Khóa học giúp hiểu rõ về tác hại của ma túy và cách phòng ngừa hiệu quả.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop",
      students: "1,234",
      rating: 4.8,
      progress: 60,
      currentLesson: 6,
      totalLessons: 10,
      category: "CƠ BẢN",
      categoryColor: "basic"
    },
    {
      id: 2,
      title: "Kỹ năng giao tiếp hiệu quả",
      description: "Kỹ năng tư vấn và hỗ trợ người có nguy cơ sử dụng ma túy trong cộng đồng.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      students: "856",
      rating: 4.9,
      progress: 75,
      currentLesson: 8,
      totalLessons: 12,
      category: "NÂNG CAO",
      categoryColor: "advanced"
    }
  ];

  return (
    <div className="space-y-3">
      {myCourses.map((course, index) => (
        <ProgressCardItem key={course.id} course={course} delay={index * 300} isVisible={isVisible} />
      ))}
    </div>
  );
};

const ProgressCardItem = ({ course, delay, isVisible }) => {
  const navigate = useNavigate();
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCardVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Get initials from course title for avatar
  const getInitials = (title) => {
    return title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCardClick = () => {
    navigate(`/coursedetail/${course.id}`);
  };

  const handleContinueClick = (e) => {
    e.stopPropagation(); // Ngăn event bubbling
    navigate(`/coursedetail/${course.id}`);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-700 hover:shadow-md hover:border-green-200 cursor-pointer ${cardVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left section with avatar and course info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Course Avatar */}
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {getInitials(course.title)}
            </div>

            {/* Course Details */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-base mb-1">
                {course.title}
              </h3>
              <div className="text-sm text-gray-500">
                {course.progress}% hoàn thành • Bài {course.currentLesson}/{course.totalLessons}
              </div>
            </div>
          </div>

          {/* Right section with button */}
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm flex-shrink-0"
            onClick={handleContinueClick}
          >
            Tiếp tục
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${course.progress}%`,
                transitionDelay: `${delay + 200}ms`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CourseCard, ProgressCard };