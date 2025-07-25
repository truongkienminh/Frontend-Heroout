import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/axios";
import { ArrowLeft } from "lucide-react";

const SurveyEvent = () => {
  const { id: eventId } = useParams(); // Lấy eventId từ URL
  const { user, loading: authLoading } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chờ cho đến khi thông tin user có sẵn
    if (authLoading) {
      return;
    }

    if (!user) {
      setError("Bạn cần đăng nhập để thực hiện khảo sát.");
      setLoading(false);
      return;
    }

    const fetchSurvey = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API với eventId và accountId từ context
        const response = await api.get(`/surveys/event/${eventId}/${user.id}`);
        setSurvey(response.data);
      } catch (err) {
        console.error("Error fetching survey:", err);
        if (err.response) {
          // Xử lý lỗi cụ thể từ server
          setError(
            err.response.data.message ||
              `Lỗi ${err.response.status}: Không thể tải khảo sát.`
          );
        } else {
          setError("Lỗi mạng hoặc không thể kết nối đến máy chủ.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [eventId, user, authLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải khảo sát...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center mx-auto text-green-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại trang sự kiện
        </button>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">
          Không tìm thấy khảo sát cho sự kiện này.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(`/events/${eventId}`)}
        className="mb-6 flex items-center text-green-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại trang sự kiện
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          {survey.title}
        </h1>

        <form>
          {survey.questions.map((question, qIndex) => (
            <div key={question.id} className="mb-8">
              <p className="text-xl font-semibold text-gray-700 mb-4">
                Câu {qIndex + 1}: {question.questionText}
              </p>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-800">{option.content}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
          >
            Nộp bài khảo sát
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyEvent;
