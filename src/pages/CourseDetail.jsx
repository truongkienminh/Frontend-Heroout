import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, CheckCircle, Shield, Users, BookOpen } from 'lucide-react';
import api from '../services/axios';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]); 
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const chaptersRes = await api.get(`/chapters/course/${id}`);
                setChapters(chaptersRes.data);
            } catch (error) {
                setChapters([]);
            }
        };
        fetchChapters();
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
            let apiError = 'Bạn đã đăng ký khóa học này!';
            if (error?.response?.data) {
                if (typeof error.response.data === 'string') {
                    apiError = error.response.data;
                } else if (error.response.data.message) {
                    apiError = error.response.data.message;
                }
            }
            setNoti({ type: 'error', message: apiError });
        }
    };

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
                {/* ...header code giữ nguyên... */}
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
                                    {course.title}
                                </h1>

                                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                                    {course.description}
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
                                {course.overview}
                            </p>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Mục tiêu học tập</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {course.objectives}
                            </p>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Nội dung khóa học</h3>
                            <div className="space-y-4">
                                {chapters && chapters.length > 0 ? (
                                    chapters.map((chapter, idx) => (
                                        <div key={chapter.id} className="border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium">{idx + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{chapter.title}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">Chưa có nội dung chương cho khóa học này.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;