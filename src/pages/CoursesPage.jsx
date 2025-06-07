import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Users, BookOpen, Clock, Award } from 'lucide-react';

const Card = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-700 hover:shadow-xl hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}>
      {children}
    </div>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    basic: "bg-green-100 text-green-800 hover:bg-green-200",
    advanced: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    expert: "bg-red-100 text-red-800 hover:bg-red-200"
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${variants[variant] || variants.basic}`}>
      {children}
    </span>
  );
};

const CompactCourseCard = ({
  image,
  category,
  categoryVariant,
  title,
  description,
  students,
  rating,
  progress,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-700 hover:shadow-md hover:border-emerald-200 w-full ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          {/* Avatar/Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold text-lg">IMG</span>
          </div>

          {/* Course Info */}
          <div className="flex-1">
            <div className="mb-2">
              <Badge variant={categoryVariant}>{category}</Badge>
            </div>
            <h3 className="font-semibold text-xl text-gray-900 mb-2 hover:text-emerald-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{students} học viên</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex mr-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{rating}</span>
              </div>
              <span>{progress}% hoàn thành • Bài {Math.floor(progress / 10)}/10</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 flex-shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <BookOpen className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
          Tiếp tục
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({
  image,
  category,
  categoryVariant,
  title,
  description,
  students,
  rating,
  progress,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card delay={delay} className="group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
          <Badge variant={categoryVariant}>{category}</Badge>
        </div>
        {progress === undefined && (
          <div className="absolute top-3 right-3 transform transition-all duration-300 opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">
            <Users className="w-4 h-4 mr-1" />
            <span>{students}</span>
          </div>
          <div className="flex items-center">
            <div className="flex mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-all duration-300 ${star <= Math.floor(rating)
                    ? 'text-yellow-400 fill-current scale-100'
                    : 'text-gray-300 scale-75'
                    } group-hover:scale-110`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        {progress !== undefined ? (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">{progress}% hoàn thành</span>
              <span className="text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Bài {Math.floor(progress / 10)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{
                  width: `${progress}%`,
                  transform: `translateX(${progress === 0 ? '-100%' : '0%'})`
                }}
              ></div>
            </div>
          </div>
        ) : null}

        <button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {progress !== undefined ? (
            <>
              <BookOpen className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
              Tiếp tục
            </>
          ) : (
            <>
              <Award className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
              Đăng ký
            </>
          )}
        </button>
      </div>
    </Card>
  );
};

const CoursesPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const courses = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop",
      category: "CƠ BẢN",
      categoryVariant: "basic",
      title: "Phòng ngừa ma túy cơ bản",
      description: "Khóa học giúp hiểu rõ về tác hại của ma túy và cách phòng ngừa hiệu quả.",
      students: "1,234",
      rating: 4.8
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      category: "NÂNG CAO",
      categoryVariant: "advanced",
      title: "Tư vấn và hỗ trợ cộng đồng",
      description: "Kỹ năng tư vấn và hỗ trợ người có nguy cơ sử dụng ma túy.",
      students: "856",
      rating: 4.9
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      category: "CHUYÊN SÂU",
      categoryVariant: "expert",
      title: "Phục hồi và tái hòa nhập",
      description: "Hỗ trợ quá trình phục hồi và tái hòa nhập cộng đồng.",
      students: "432",
      rating: 4.7
    }
  ];

  const myCourses = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop",
      category: "CƠ BẢN",
      categoryVariant: "basic",
      title: "Phòng ngừa ma túy cơ bản",
      description: "Khóa học giúp hiểu rõ về tác hại của ma túy và cách phòng ngừa hiệu quả.",
      students: "1,234",
      rating: 4.8,
      progress: 60
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      category: "NÂNG CAO",
      categoryVariant: "advanced",
      title: "Tư vấn và hỗ trợ cộng đồng",
      description: "Kỹ năng tư vấn và hỗ trợ người có nguy cơ sử dụng ma túy trong cộng đồng.",
      students: "856",
      rating: 4.9,
      progress: 25
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      category: "CHUYÊN SÂU",
      categoryVariant: "expert",
      title: "Phục hồi và tái hòa nhập",
      description: "Hỗ trợ quá trình phục hồi và tái hòa nhập cộng đồng cho người đã từng sử dụng ma túy.",
      students: "432",
      rating: 4.7,
      progress: 80
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold text-gray-900 mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
            }`}>
            <span className="text-black">
              Khóa học
            </span>

          </h1>

          {/* Search and Filter */}
          <div className={`flex gap-4 mb-6 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-300 ${searchFocused ? 'text-emerald-500 scale-110' : ''
                }`} />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Lọc</span>
            </button>
          </div>
        </div>

        {/* Course Grid - 3 cards per row */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          {courses.map((course, index) => (
            <div key={course.id} className="flex">
              <CourseCard {...course} delay={600 + index * 200} />
            </div>
          ))}
        </div>

        {/* My Courses Section - Single Row Layout */}
        <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">

            <span className="text-black">
              Khóa học của tôi
            </span>

          </h2>
          <div className="space-y-4">
            {myCourses.map((course, index) => (
              <CompactCourseCard key={course.id} {...course} delay={1200 + index * 200} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;