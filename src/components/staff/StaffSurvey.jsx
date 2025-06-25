import { useState, useEffect } from "react";
import { FileText, Search, Plus, Edit, Trash2, Eye } from "lucide-react";

const StaffSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch surveys from API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          "https://684c6fd0ed2578be881ecef7.mockapi.io/risksurvey"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const surveyData = Array.isArray(data) ? data[0] : data;
        setSurveys([surveyData]);
        setFilteredSurveys([surveyData]);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      }
    };
    fetchSurveys();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = surveys;
    if (searchTerm) {
      filtered = filtered.filter((survey) =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSurveys(filtered);
    setCurrentPage(1);
  }, [searchTerm, surveys]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSurveys = filteredSurveys.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

  const handleAddSurvey = (surveyData) => {
    const newSurvey = {
      id: Date.now(),
      ...surveyData,
      questions: surveyData.questions || [],
    };
    setSurveys([...surveys, newSurvey]);
    setShowAddModal(false);
  };

  const handleEditSurvey = (surveyData) => {
    setSurveys(
      surveys.map((survey) =>
        survey.id === selectedSurvey.id ? { ...survey, ...surveyData } : survey
      )
    );
    setShowEditModal(false);
    setSelectedSurvey(null);
  };

  const handleDeleteSurvey = (surveyId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khảo sát này?")) {
      setSurveys(surveys.filter((survey) => survey.id !== surveyId));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý khảo sát rủi ro
        </h1>
        <p className="text-gray-600">Quản lý các khảo sát đánh giá rủi ro</p>
      </div>

      {/* Stats Cards (Simplified) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng khảo sát</p>
              <p className="text-2xl font-bold text-gray-900">
                {surveys.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm khảo sát..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tạo khảo sát
            </button>
          </div>
        </div>
      </div>

      {/* Surveys Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khảo sát
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số câu hỏi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {survey.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {survey.note || survey.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {survey.questions.length} câu hỏi
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {survey.questions.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedSurvey(survey);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSurvey(survey);
                          setShowEditModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurvey(survey.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredSurveys.length)}
                  </span>{" "}
                  trong{" "}
                  <span className="font-medium">{filteredSurveys.length}</span>{" "}
                  kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Survey Modal */}
      {showAddModal && (
        <SurveyModal
          title="Tạo khảo sát mới"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSurvey}
        />
      )}

      {/* Edit Survey Modal */}
      {showEditModal && selectedSurvey && (
        <SurveyModal
          title="Chỉnh sửa khảo sát"
          survey={selectedSurvey}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSurvey(null);
          }}
          onSubmit={handleEditSurvey}
        />
      )}

      {/* Survey Detail Modal */}
      {showDetailModal && selectedSurvey && (
        <SurveyDetailModal
          survey={selectedSurvey}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSurvey(null);
          }}
        />
      )}
    </div>
  );
};

// Survey Form Modal Component
const SurveyModal = ({ title, survey, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: survey?.title || "Khảo sát ",
    note: survey?.note || "Vui lòng trả lời các câu hỏi một cách trung thực...",
    questions: survey?.questions || [
      {
        id: 1,
        question: "Bạn đã từng sử dụng ma túy chưa?",
        options: [
          { text: "Không, chưa bao giờ", score: 0 },
          { text: "Đang hoặc đã từng dùng", score: 0 },
        ],
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề khảo sát
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu hỏi và tùy chọn
              </label>
              {formData.questions.map((question, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => {
                      const updatedQuestions = [...formData.questions];
                      updatedQuestions[index].question = e.target.value;
                      setFormData({ ...formData, questions: updatedQuestions });
                    }}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập câu hỏi..."
                  />
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updatedQuestions = [...formData.questions];
                          updatedQuestions[index].options[optIndex].text =
                            e.target.value;
                          setFormData({
                            ...formData,
                            questions: updatedQuestions,
                          });
                        }}
                        className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tùy chọn..."
                      />
                      <input
                        type="number"
                        value={option.score}
                        onChange={(e) => {
                          const updatedQuestions = [...formData.questions];
                          updatedQuestions[index].options[optIndex].score =
                            parseInt(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            questions: updatedQuestions,
                          });
                        }}
                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Điểm"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedQuestions = [...formData.questions];
                      updatedQuestions[index].options.push({
                        text: "",
                        score: 0,
                      });
                      setFormData({ ...formData, questions: updatedQuestions });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Thêm tùy chọn
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    questions: [
                      ...formData.questions,
                      {
                        id: formData.questions.length + 1,
                        question: "",
                        options: [{ text: "", score: 0 }],
                      },
                    ],
                  })
                }
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Thêm câu hỏi
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {survey ? "Cập nhật" : "Tạo khảo sát"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Survey Detail Modal Component
const SurveyDetailModal = ({ survey, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Chi tiết khảo sát</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">{survey.title}</h3>
            <p className="text-gray-600 mb-4">{survey.note}</p>
          </div>

          {/* Questions Preview */}
          {survey.questions && survey.questions.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">
                Câu hỏi ({survey.questions.length})
              </h4>
              <div className="space-y-3">
                {survey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {index + 1}. {question.question}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">
                            Tùy chọn:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {question.options.map((option, optIndex) => (
                              <span
                                key={optIndex}
                                className="px-2 py-1 bg-gray-100 text-xs rounded"
                              >
                                {option.text} (Điểm: {option.score})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffSurvey;