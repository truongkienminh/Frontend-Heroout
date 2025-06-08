import React, { useState } from 'react';
import { Play, Star, Users, Clock, BookOpen, Award, CheckCircle } from 'lucide-react';

// CourseContent Component - Nội dung khóa học
const CourseContent = () => {
  const [expandedSection, setExpandedSection] = useState(1);

  const courseModules = [
    {
      id: 1,
      title: "Giới thiệu về ma túy",
      lessons: 4,
      duration: "45 phút",
      lessons_detail: [
        { id: 1, title: "Khái niệm cơ bản về ma túy", duration: "10 phút" },
        { id: 2, title: "Phân loại các loại ma túy", duration: "15 phút" }
      ]
    },
    {
      id: 2,
      title: "Tác hại của ma túy",
      lessons: 3,
      duration: "35 phút",
      lessons_detail: []
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Nội dung khóa học</h3>
      
      <div className="space-y-4">
        {courseModules.map((module) => (
          <div key={module.id} className="border border-gray-200 rounded-lg">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedSection(expandedSection === module.id ? null : module.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{module.id}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{module.title}</h4>
                  <p className="text-sm text-gray-500">{module.lessons} bài học • {module.duration}</p>
                </div>
              </div>
              <div className="text-gray-400">
                {expandedSection === module.id ? '−' : '+'}
              </div>
            </div>
            
            {expandedSection === module.id && module.lessons_detail.length > 0 && (
              <div className="border-t border-gray-200">
                {module.lessons_detail.map((lesson) => (
                  <div key={lesson.id} className="flex items-center p-4 pl-16 hover:bg-gray-50">
                    <Play className="w-4 h-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-gray-700">{lesson.title}</p>
                    </div>
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;