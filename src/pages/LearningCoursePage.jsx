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
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-red-50 to-pink-100 items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium"
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
          <div className="p-6 flex items-center justify-between border-b">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold">
              {course?.title || "Chương trình học"}
            </h2>
            <p className="text-sm text-gray-500">{chapters.length} chương</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className={`group cursor-pointer p-4 rounded-xl transition-all ${
                  selectedChapter?.id === chapter.id
                    ? "bg-blue-50 border-blue-200 shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      chapter.status === "COMPLETED"
                        ? "bg-green-500 text-white"
                        : selectedChapter?.id === chapter.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {chapter.status === "COMPLETED" ? <Check /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold ${
                        selectedChapter?.id === chapter.id
                          ? "text-blue-700"
                          : "text-gray-800"
                      }`}
                    >
                      {chapter.title}
                    </h3>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      selectedChapter?.id === chapter.id
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!sidebarOpen && (
        <div className="w-20 bg-white border-r flex flex-col items-center py-6 space-y-6">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-8 py-6">
          <h1 className="text-xl font-bold text-gray-800">
            {selectedChapter?.title || "Chọn một chương để bắt đầu"}
          </h1>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedChapter ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">
                {selectedChapter.content && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                      Nội dung bài học
                    </h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line p-6 rounded-lg bg-gray-50">
                      {selectedChapter.content}
                    </div>
                  </div>
                )}
                {selectedChapter.image && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-3 text-green-600" />
                      Hình ảnh minh họa
                    </h3>
                    {/* ===== THAY ĐỔI Ở ĐÂY ===== */}
                    <img
                      src={selectedChapter.image}
                      alt={`Hình ảnh cho ${selectedChapter.title}`}
                      className="max-w-3xl mx-auto h-auto rounded-lg border shadow-md"
                    />
                  </div>
                )}
                {selectedChapter.video && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <VideoIcon className="w-5 h-5 mr-3 text-red-600" />
                      Video bài giảng
                    </h3>
                    {/* ===== THAY ĐỔI Ở ĐÂY ===== */}
                    <video
                      src={selectedChapter.video}
                      controls
                      className="max-w-3xl mx-auto rounded-lg bg-black shadow-md"
                    ></video>
                  </div>
                )}
                {!selectedChapter.content &&
                  !selectedChapter.image &&
                  !selectedChapter.video && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Chương này chưa có nội dung.
                      </p>
                    </div>
                  )}
              </div>
              <div className="flex justify-end mt-8">
                {selectedChapter.status === "COMPLETED" ? (
                  <div className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold">
                    <Check className="w-5 h-5 mr-2" />
                    Đã hoàn thành
                  </div>
                ) : (
                  <button
                    onClick={() => completeChapter(selectedChapter.id)}
                    disabled={completing}
                    className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold transition hover:bg-blue-700 ${
                      completing && "opacity-50 cursor-not-allowed"
                    }`}
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
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">
                  Chọn chương để bắt đầu
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningCoursePage;
