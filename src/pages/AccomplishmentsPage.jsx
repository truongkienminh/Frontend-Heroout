import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import api from '../services/axios';
import { useAuth } from '../contexts/AuthContext';

function AccomplishmentsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`/courses/completed`, {
          params: { accountId: user.id }
        });
        setCourses(res.data || []);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedCourses();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-gray-600 mb-8">Khóa học đã hoàn thành</h1>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : (
        <div className="space-y-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 pb-6">
                {/* Course Icon */}
                <div className="flex-shrink-0 w-16 h-16 border-2 border-blue-300 rounded-lg flex items-center justify-center bg-white">
                  <div className="relative">
                    <BookOpen className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                    {/* Bookmark icon */}
                    <div className="absolute -top-1 -right-1 w-4 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-3 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex-1 min-w-0 flex items-center">
                  <h3 className="text-lg font-normal text-blue-600 leading-relaxed">
                    {course.title}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Bạn chưa hoàn thành khóa học nào.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AccomplishmentsPage;