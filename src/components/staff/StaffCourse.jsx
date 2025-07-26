import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  X,
  BookOpen,
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  Eye,
} from "lucide-react";
import api from "../../services/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dluj1wjzd";
const CLOUDINARY_UPLOAD_PRESET = "HeroOut";

const CreateCourseModal = ({ show, onClose, onCourseCreated }) => {
  const getInitialNewCourseState = () => ({
    title: "",
    description: "",
    objectives: "",
    overview: "",
    ageGroup: "",
    chapters: [{ title: "", content: "", image: "", video: "" }],
  });

  const [newCourse, setNewCourse] = useState(getInitialNewCourseState());
  const [submitting, setSubmitting] = useState(false);
  const [uploadingState, setUploadingState] = useState({
    index: null,
    type: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...newCourse.chapters];
    updatedChapters[index][field] = value;
    setNewCourse((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleAddChapter = () => {
    setNewCourse((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: "", content: "", image: "", video: "" },
      ],
    }));
  };

  const handleRemoveChapter = (index) => {
    const updatedChapters = [...newCourse.chapters];
    updatedChapters.splice(index, 1);
    setNewCourse((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleFileUpload = async (e, index, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const resourceType = type === "image" ? "image" : "video";
    setUploadingState({ index, type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData
      );
      handleChapterChange(index, type, response.data.secure_url);
      toast.success(
        `Tải ${type === "image" ? "ảnh" : "video"} cho chương ${
          index + 1
        } thành công!`
      );
    } catch (error) {
      toast.error(`Tải ${type} lên thất bại.`);
    } finally {
      setUploadingState({ index: null, type: null });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.ageGroup) {
      toast.error("Vui lòng điền tên khóa học và chọn nhóm tuổi.");
      return;
    }
    if (newCourse.chapters.some((ch) => !ch.title.trim())) {
      toast.error("Tất cả các chương phải có tiêu đề.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/courses", newCourse);
      toast.success("Tạo khóa học thành công!");
      onCourseCreated();
      onClose();
    } catch (error) {
      toast.error("Tạo khóa học thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      setNewCourse(getInitialNewCourseState());
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Tạo khóa học mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form
            id="course-form"
            onSubmit={handleCreateCourse}
            className="p-8 space-y-6"
          >
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={handleInputChange}
              required
              placeholder="Tên khóa học *"
              className="w-full border-2 rounded-xl px-4 py-3"
            />
            <textarea
              name="description"
              value={newCourse.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="Mô tả ngắn..."
              className="w-full border-2 rounded-xl px-4 py-3"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="objectives"
                value={newCourse.objectives}
                onChange={handleInputChange}
                placeholder="Mục tiêu khóa học..."
                className="w-full border-2 rounded-xl px-4 py-3"
              />
              <input
                type="text"
                name="overview"
                value={newCourse.overview}
                onChange={handleInputChange}
                placeholder="Tổng quan khóa học..."
                className="w-full border-2 rounded-xl px-4 py-3"
              />
            </div>
            <select
              name="ageGroup"
              value={newCourse.ageGroup}
              onChange={handleInputChange}
              required
              className="w-full border-2 rounded-xl px-4 py-3 bg-white"
            >
              <option value="">-- Chọn nhóm tuổi * --</option>
              <option value="CHILDREN">Trẻ em</option>
              <option value="TEENAGERS">Thiếu niên</option>
              <option value="YOUNG_ADULTS">Thanh niên</option>
              <option value="ADULTS">Người lớn</option>
              <option value="SENIORS">Người cao tuổi</option>
            </select>
            <div className="space-y-4 pt-4 border-t">
              <label className="font-semibold text-gray-700">
                Chương trình học
              </label>
              {newCourse.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border-2 rounded-xl p-4 bg-gray-50/50 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Chương {index + 1}
                    </span>
                    {newCourse.chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChapter(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Tiêu đề chương *"
                    value={chapter.title}
                    onChange={(e) =>
                      handleChapterChange(index, "title", e.target.value)
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />
                  <textarea
                    placeholder="Nội dung chương..."
                    value={chapter.content}
                    onChange={(e) =>
                      handleChapterChange(index, "content", e.target.value)
                    }
                    rows={3}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <ImageIcon size={14} /> Ảnh minh họa
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index, "image")}
                          className="hidden"
                          id={`image-upload-${index}`}
                          disabled={uploadingState.index === index}
                        />
                        <label
                          htmlFor={`image-upload-${index}`}
                          className={`px-3 py-1.5 border rounded-md text-sm cursor-pointer transition-colors ${
                            uploadingState.index === index &&
                            uploadingState.type === "image"
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {uploadingState.index === index &&
                          uploadingState.type === "image" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            "Chọn ảnh"
                          )}
                        </label>
                        {chapter.image && (
                          <a
                            href={chapter.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline truncate"
                          >
                            Xem ảnh
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <VideoIcon size={14} /> Video bài giảng
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, index, "video")}
                          className="hidden"
                          id={`video-upload-${index}`}
                          disabled={uploadingState.index === index}
                        />
                        <label
                          htmlFor={`video-upload-${index}`}
                          className={`px-3 py-1.5 border rounded-md text-sm cursor-pointer transition-colors ${
                            uploadingState.index === index &&
                            uploadingState.type === "video"
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {uploadingState.index === index &&
                          uploadingState.type === "video" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            "Chọn video"
                          )}
                        </label>
                        {chapter.video && (
                          <a
                            href={chapter.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline truncate"
                          >
                            Xem video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddChapter}
                className="w-full border-2 border-dashed rounded-xl py-3 text-blue-600 hover:bg-blue-50/50"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Thêm chương mới
              </button>
            </div>
          </form>
        </div>
        <div className="border-t bg-gray-50 px-8 py-4 flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg border font-semibold text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            form="course-form"
            disabled={submitting || uploadingState.index !== null}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
            {submitting ? "Đang tạo..." : "Tạo khóa học"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChapterDetailsModal = ({ course, onClose }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!course) return;
      setLoading(true);
      try {
        const res = await api.get(`/chapters/course/${course.id}`);
        setChapters(res.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách chương.");
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [course]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiết chương trình học
            </h2>
            <p className="text-gray-500">{course?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center">
              <Loader2 className="animate-spin inline-block" />
            </div>
          ) : chapters.length > 0 ? (
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Chương {index + 1}: {chapter.title}
                    </h3>
                    {chapter.content && (
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {chapter.content}
                      </p>
                    )}
                  </div>

                  {chapter.image && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Hình ảnh:
                      </label>
                      <img
                        src={chapter.image}
                        alt={`Ảnh cho ${chapter.title}`}
                        className="mt-1 w-full max-h-64 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {chapter.video && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Video:
                      </label>
                      <video
                        src={chapter.video}
                        controls
                        className="mt-1 w-full rounded-md bg-black"
                      ></video>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Khóa học này chưa có chương nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StaffCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [showChapterDetails, setShowChapterDetails] = useState(false);
  const [viewingCourse, setViewingCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách khóa học.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await api.delete(`/courses/${courseToDelete.id}`);
      toast.success(`Đã xóa khóa học "${courseToDelete.title}"!`);
      fetchCourses();
    } catch (error) {
      toast.error("Xóa khóa học thất bại.");
    } finally {
      setShowDelete(false);
      setCourseToDelete(null);
    }
  };

  const handleViewChapters = (course) => {
    setViewingCourse(course);
    setShowChapterDetails(true);
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: "Tổng khóa học", value: courses.length },
    {
      title: "Tổng đăng ký",
      value: courses.reduce((sum, c) => sum + (c.totalEnrollment || 0), 0),
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="min-h-screen w-full p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
          <p className="text-gray-500">Tổng quan và quản lý tất cả khóa học</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
          >
            <Plus size={16} /> Tạo khóa học
          </button>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-3xl font-bold mt-1 text-gray-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tên khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nhóm tuổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{course.ageGroup}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {course.totalEnrollment || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button
                      onClick={() => handleViewChapters(course)}
                      className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-md"
                      title="Xem chương"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-md"
                      title="Xóa khóa học"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCourseModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onCourseCreated={fetchCourses}
      />
      {showChapterDetails && (
        <ChapterDetailsModal
          course={viewingCourse}
          onClose={() => setShowChapterDetails(false)}
        />
      )}
      {showDelete && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold">Xác nhận xóa</h3>
              <p className="mt-2 text-sm text-gray-500">
                Bạn có chắc muốn xóa khóa học "{courseToDelete?.title}"?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCourse;
