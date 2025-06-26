import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, CheckCircle, Shield, Users, BookOpen } from 'lucide-react';
import api from '../services/axios';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState(null);
    const [noti, setNoti] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (error) {
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

   
    const handleStartLearning = async () => {
        setNoti(null);
        if (!user || !user.id) {
            setNoti({ type: 'error', message: 'Vui lòng đăng nhập để đăng ký khóa học!' });
            return;
        }
        try {
            await api.post(`/enrollments/start?courseId=${id}&accountId=${user.id}`);
            setNoti({ type: 'success', message: 'Đăng ký thành công! Đang chuyển đến trang học...' });
            setTimeout(() => {
                window.location.href = `/learningcourse/${id}`;
            }, 1000);
        } catch (error) {
            setNoti({ type: 'error', message: 'Đăng ký thất bại!' });
        }
    };

    const courseModules = course?.modules?.length
        ? course.modules
        : [
            {
                id: 1,
                title: "Giới thiệu về ma túy",
                lessons: 4,
                lessons_detail: [
                    { id: 1, title: "Khái niệm cơ bản về ma túy" },
                    { id: 2, title: "Phân loại các loại ma túy" }
                ]
            },
            {
                id: 2,
                title: "Tác hại của ma túy",
                lessons: 3,
                lessons_detail: []
            }
        ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg text-gray-500">Đang tải thông tin khóa học...</div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg text-red-500">Không tìm thấy khóa học.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full border border-blue-400/30">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">Chương trình giáo dục quan trọng</span>
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    {course.title || "Phòng ngừa"}
                                    <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        {course.title ? "" : "ma túy cơ bản"}
                                    </span>
                                </h1>

                                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                                    {course.description ||
                                        "Khóa học toàn diện giúp bạn hiểu rõ về tác hại của ma túy và trang bị kiến thức phòng ngừa hiệu quả cho bản thân và cộng đồng."}
                                </p>
                            </div>

                            {/* Feature highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <BookOpen className="w-8 h-8 text-emerald-400" />
                                    <div>
                                        <div className="text-white font-semibold">Kiến thức</div>
                                        <div className="text-blue-200 text-sm">Khoa học</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <Users className="w-8 h-8 text-cyan-400" />
                                    <div>
                                        <div className="text-white font-semibold">Cộng đồng</div>
                                        <div className="text-blue-200 text-sm">Hỗ trợ</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <Shield className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <div className="text-white font-semibold">Bảo vệ</div>
                                        <div className="text-blue-200 text-sm">An toàn</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right content - CTA */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-sm w-full">
                                    <div className="text-center space-y-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                Sẵn sàng bắt đầu?
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Tham gia khóa học miễn phí và bảo vệ bản thân cùng những người thân yêu.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleStartLearning}
                                            className="group w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                Đăng ký ngay
                                            </div>
                                        </button>
                                        {/* Thông báo đăng ký */}
                                        {noti && (
                                            <div
                                                className={`mt-4 text-sm rounded px-3 py-2 ${noti.type === 'success'
                                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                                    : 'bg-red-100 text-red-700 border border-red-300'
                                                    }`}
                                            >
                                                {noti.message}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-4">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Miễn phí</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                {course.overview ||
                                    "Khóa học này sẽ cung cấp cho bạn kiến thức toàn diện về tác hại của ma túy và các biện pháp phòng ngừa hiệu quả. Thông qua các bài học thực tế và tình huống cụ thể, bạn sẽ hiểu rõ hơn về vấn đề này và có thể áp dụng vào cuộc sống hàng ngày."}
                            </p>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Mục tiêu học tập</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {course.objectives ||
                                    "Khóa học này sẽ cung cấp cho bạn kiến thức toàn diện về tác hại của ma túy và các biện pháp phòng ngừa hiệu quả. Thông qua các bài học thực tế và tình huống cụ thể, bạn sẽ hiểu rõ hơn về vấn đề này và có thể áp dụng vào cuộc sống hàng ngày."}
                            </p>
                        </div>

                        {/* Course Content */}
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
                                                    <p className="text-sm text-gray-500">{module.lessons} bài học</p>
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
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;