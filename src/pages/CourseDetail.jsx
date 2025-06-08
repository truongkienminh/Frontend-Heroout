import React, { useState } from 'react';
import { Play, Star, Users, Clock, BookOpen, Award, CheckCircle } from 'lucide-react';
import CourseContent from '../components/CourseContent';
import InstructorStats from '../components/InstructorStats';

const CourseDetail = ({ courseId = "1" }) => {
    const [isEnrolled, setIsEnrolled] = useState(true);

    const handleStartLearning = () => {
        // Navigate to learning page
        window.location.href = `/learningcourse/${courseId}`;
    };

    const learningObjectives = [
        "Hiểu rõ về các loại ma túy và tác hại của chúng",
        "Nắm vững các biện pháp phòng ngừa hiệu quả",
        "Biết cách nhận biết và xử lý tình huống nguy hiểm",
        "Có khả năng tư vấn và hỗ trợ người khác"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl font-bold mb-4">Phòng ngừa ma túy cơ bản</h1>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Khóa học giúp hiểu rõ về tác hại của ma túy và cách phòng ngừa hiệu quả.
                            </p>

                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    <span className="font-medium">4.8</span>
                                    <span className="text-blue-200 ml-1">(1,234 đánh giá)</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>1,234 học viên</span>
                                </div>
                                <div className="flex items-center">
                                    <Award className="w-4 h-4 mr-1" />
                                    <span>Có bằng</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 text-gray-800">
                                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-gray-400" />
                                </div>

                                {isEnrolled ? (
                                    <div className="space-y-3">

                                        <div className="text-sm text-gray-600">
                                            Tiến độ học tập: <span className="font-medium">0/7 bài</span>
                                        </div>
                                        <button
                                            onClick={handleStartLearning}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                        >
                                            Bắt đầu học
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEnrolled(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                    >
                                        Đăng ký khóa học
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Overview */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tổng quan khóa học</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Khóa học này sẽ cung cấp cho bạn kiến thức toàn diện về tác hại của ma túy và các biện pháp phòng ngừa hiệu quả. Thông qua các bài học thực tế và tình huống cụ thể, bạn sẽ hiểu rõ hơn về vấn đề này và có thể áp dụng vào cuộc sống hàng ngày.
                            </p>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Mục tiêu học tập</h3>
                            <ul className="space-y-3">
                                {learningObjectives.map((objective, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Course Content */}
                        <CourseContent />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <InstructorStats />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;