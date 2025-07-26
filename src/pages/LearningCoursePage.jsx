import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader2,
  Menu,
  ChevronRight,
  BookOpen,
  Clock,
  Check,
  Image as ImageIcon,
  Video as VideoIcon,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios"; // Đảm bảo đường dẫn này đúng
import { useAuth } from "../contexts/AuthContext"; // Đảm bảo đường dẫn này đúng

const LearningCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completing, setCompleting] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      }
    };
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchChaptersForUser = async () => {
    if (!user?.id || !id) {
      throw new Error("Thông tin người dùng hoặc khóa học không hợp lệ.");
    }
    try {
      const response = await api.get(
        `/chapters/course/${id}/account/${user.id}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching chapters with status:", error);
      throw new Error("Không thể tải dữ liệu tiến độ khóa học.");
    }
  };

  const completeChapter = async (chapterId) => {
    if (!user?.id) return;
    setCompleting(true);
    try {
      await api.post(`/enrollments/complete-chapter`, null, {
        params: { chapterId, accountId: user.id },
      });
      const updatedChapters = chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, status: "COMPLETED" } : chapter
      );
      setChapters(updatedChapters);
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter((prev) => ({ ...prev, status: "COMPLETED" }));
      }
      const allCompleted = updatedChapters.every(
        (chapter) => chapter.status === "COMPLETED"
      );
      if (allCompleted) {
        setTimeout(() => {
          navigate("/courses");
        }, 1500);
      }
    } catch (error) {
      console.error("Error completing chapter:", error);
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChaptersForUser();
        if (!Array.isArray(data))
          throw new Error("Dữ liệu không đúng định dạng");
        setChapters(data);
        if (data.length > 0) {
          const inProgressChapter = data.find(
            (ch) => ch.status === "INPROGRESS"
          );
          const firstNotStarted = data.find(
            (ch) => ch.status === "NOT_STARTED"
          );
          setSelectedChapter(inProgressChapter || firstNotStarted || data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id && id) {
      loadData();
    } else if (!user?.id) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem nội dung khóa học.");
    }
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <span className="text-gray-700 font-medium text-lg">Đang tải chương...</span>
          <span className="text-gray-500 text-sm mt-1">Vui lòng chờ trong giây lát</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-red-50 to-pink-100 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Quay lại trang chủ</span>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Đóng sidebar"
            >
              <Menu className="w-5 h-5 text-blue-100 hover:text-white" />
            </button>
          </div>

          {/* Course Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {course?.title || "Chương trình học"}
                </h2>
                <p className="text-sm text-gray-500">{chapters.length} chương</p>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className={`group cursor-pointer transition-all duration-200 ${selectedChapter?.id === chapter.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200"
                    } rounded-xl p-4`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Chapter Number/Status */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${chapter.status === "COMPLETED"
                          ? "bg-green-500 text-white shadow-lg"
                          : selectedChapter?.id === chapter.id
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        } transition-all duration-200`}
                    >
                      {chapter.status === "COMPLETED" ? <Check className="w-5 h-5" /> : index + 1}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-base leading-snug mb-2 ${selectedChapter?.id === chapter.id
                            ? "text-blue-800"
                            : "text-gray-800 group-hover:text-blue-700"
                          } transition-colors duration-200`}
                      >
                        {chapter.title}
                      </h3>

                      {/* Chapter Meta */}
                      <div className="flex items-center mt-3 space-x-4">
                        {selectedChapter?.id === chapter.id && chapter.status !== "COMPLETED" && (
                          <div className="flex items-center text-xs text-blue-500 font-medium">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Đang học</span>
                          </div>
                        )}
                        {chapter.status === "COMPLETED" && (
                          <div className="flex items-center text-xs text-green-600 font-medium">
                            <Check className="w-3 h-3 mr-1" />
                            <span>Đã hoàn thành</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div
                      className={`flex-shrink-0 ${selectedChapter?.id === chapter.id ? "text-blue-500" : "text-gray-400"
                        } transition-colors duration-200`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Sidebar */}
      {!sidebarOpen && (
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6 shadow-lg">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-blue-50 rounded-xl transition-colors group"
            aria-label="Mở sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-3 hover:bg-blue-50 rounded-xl transition-colors group"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>
          <div className="bg-blue-100 rounded-xl p-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {course?.title || "Khóa học"}
                </h1>
              </div>
            </div>

            {selectedChapter && (
              <div className="flex items-center space-x-3">
                {selectedChapter.status === "COMPLETED" ? (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Đã hoàn thành
                  </div>
                ) : selectedChapter.status === "INPROGRESS" ? (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Đang học
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Chưa bắt đầu
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedChapter ? (
            <div className="max-w-4xl mx-auto">
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-xl p-3 font-bold">
                    {chapters.findIndex((ch) => ch.id === selectedChapter.id) + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {selectedChapter.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="space-y-8">
                {/* Text Content */}
                {/* Video Content */}
                {selectedChapter.video && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <VideoIcon className="w-5 h-5 mr-3 text-red-600" />
                      Video bài giảng
                    </h3>
                    <div className="flex justify-center">
                      <div className="relative w-full max-w-4xl">
                        <video
                          src={selectedChapter.video}
                          controls
                          className="w-full h-auto rounded-lg shadow-lg bg-black"
                          style={{ maxHeight: '600px' }}
                        >
                          Trình duyệt của bạn không hỗ trợ video.
                        </video>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Content */}
                {selectedChapter.image && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-3 text-green-600" />
                      Hình ảnh minh họa
                    </h3>
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img
                          src={selectedChapter.image}
                          alt={`Hình ảnh cho ${selectedChapter.title}`}
                          className="max-w-full h-auto rounded-lg border shadow-lg transition-transform duration-300 group-hover:scale-105"
                          style={{ maxHeight: '600px' }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                )}


                {selectedChapter.content && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                      Nội dung bài học
                    </h3>
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-lg">
                        {selectedChapter.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* No Content State */}
                {!selectedChapter.content && !selectedChapter.image && !selectedChapter.video && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center py-12">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Chương này chưa có nội dung.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Completion Button */}
              <div className="flex justify-end mt-8">
                {selectedChapter.status === "COMPLETED" ? (
                  <div className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-not-allowed opacity-80">
                    <Check className="w-5 h-5 mr-2" />
                    Đã hoàn thành
                  </div>
                ) : (
                  <button
                    onClick={() => completeChapter(selectedChapter.id)}
                    className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold ${completing ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    disabled={completing}
                  >
                    {completing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang xác nhận...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Xác nhận hoàn thành
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chọn chương để bắt đầu
                </h3>
                <p className="text-gray-500">
                  Vui lòng chọn một chương từ danh sách bên trái để xem nội dung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningCoursePage;