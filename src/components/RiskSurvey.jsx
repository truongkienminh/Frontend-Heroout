import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Info,
  Clock,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../contexts/AuthContext";

const RiskSurvey = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // State để lưu kết quả
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle', 'success', 'error'

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://684c6fd0ed2578be881ecef7.mockapi.io/risksurvey"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let surveyInfo = null;
      if (Array.isArray(data) && data.length > 0) {
        surveyInfo = data[0];
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        surveyInfo = data;
      }

      if (surveyInfo && surveyInfo.questions) {
        setSurveyData(surveyInfo);
        setError(null);
      } else {
        throw new Error("Dữ liệu khảo sát không hợp lệ.");
      }
    } catch (err) {
      console.error("Error fetching survey data:", err);
      setError("Không thể tải dữ liệu khảo sát. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- SỬA ĐỔI Ở HÀM NÀY ---
  const handleSaveResult = async (score, result) => {
    if (!isAuthenticated || !user?.id) {
      alert("Bạn cần đăng nhập để lưu kết quả.");
      return;
    }

    // Đã sửa lỗi:
    // 1. Lấy trực tiếp giá trị `result.riskLevel` (ví dụ: "HIGH", "MEDIUM", "LOW").
    // 2. Sửa key trong payload thành `riskLevel` để nhất quán với API.
    const payload = {
      score: score,
      riskLevel: result.riskLevel,
    };

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const accountId = user.id;
      await api.post(`/survey-results/account/${accountId}`, payload);
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving survey result:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = { ...answers, [currentQuestion]: selectedOption };
      setAnswers(newAnswers);

      if (currentQuestion === 0) {
        if (selectedOption === 0) {
          setShowResult(true);
          return;
        } else {
          setCurrentQuestion(1);
        }
      } else if (currentQuestion === 1) {
        if (selectedOption === 0) {
          setCurrentQuestion(5);
        } else {
          setCurrentQuestion(2);
        }
      } else if (currentQuestion >= 2 && currentQuestion <= 4) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (
        currentQuestion >= 5 &&
        currentQuestion < surveyData.questions.length - 1
      ) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }

      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      let prevQuestion = currentQuestion - 1;
      if (currentQuestion === 5) {
        prevQuestion = answers[1] === 0 ? 1 : 4;
      } else if (currentQuestion === 1) {
        prevQuestion = 0;
      }
      setCurrentQuestion(prevQuestion);
      setSelectedOption(
        answers[prevQuestion] !== undefined ? answers[prevQuestion] : null
      );
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.keys(answers).forEach((questionIndex) => {
      const question = surveyData.questions[questionIndex];
      const selectedOptionIndex = answers[questionIndex];
      if (question && question.options[selectedOptionIndex]) {
        totalScore += question.options[selectedOptionIndex].score;
      }
    });
    return totalScore;
  };

  const getMaxPossibleScore = () => {
    let maxScore = 0;
    Object.keys(answers).forEach((questionIndex) => {
      const question = surveyData.questions[questionIndex];
      if (question) {
        maxScore += Math.max(...question.options.map((o) => o.score));
      }
    });
    return maxScore;
  };

  const getRiskLevel = (score) => {
    if (score >= 7)
      return {
        riskLevel: "HIGH",
        color: "bg-red-100 text-red-800",
        recommendation:
          "Nguy cơ cao. Bạn nên tìm kiếm sự hỗ trợ chuyên nghiệp.",
      };
    if (score >= 2 && score <= 6)
      return {
        riskLevel: "MEDIUM",
        color: "bg-yellow-100 text-yellow-800",
        recommendation:
          "Nguy cơ trung bình. Bạn nên cân nhắc tìm kiếm sự hỗ trợ.",
      };
    return {
      riskLevel: "LOW",
      color: "bg-green-100 text-green-800",
      recommendation: "Nguy cơ thấp. Tiếp tục duy trì lối sống lành mạnh.",
    };
  };

  // --- GIAO DIỆN --- (Không thay đổi từ đây trở xuống)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Đang tải khảo sát...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSurveyData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!surveyData || !surveyData.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Info className="w-8 h-8 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Không có dữ liệu khảo sát
          </h2>
          <p className="text-gray-600">Không thể tải được dữ liệu khảo sát.</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const maxScore = getMaxPossibleScore();
    const result = getRiskLevel(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Kết Quả Đánh Giá CRAFFT
              </h2>
              <p className="text-gray-600">
                Đánh giá nguy cơ sử dụng chất gây nghiện của bạn
              </p>
            </div>

            <div className={`${result.color} p-4 rounded-lg mb-6 text-center`}>
              <div className="font-bold text-lg">
                Mức độ rủi ro: {result.riskLevel} • Điểm số: {score}/{maxScore}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-center">
                Khuyến nghị
              </h3>
              <p className="text-center text-gray-700">
                {result.recommendation}
              </p>
            </div>

            {result.riskLevel !== "LOW" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Tham gia khóa học "Kỹ năng từ chối"
                      </h3>
                      <p className="text-blue-700 text-sm mb-3">
                        Học cách đối phó và từ chối các tình huống rủi ro.
                      </p>
                      <button
                        onClick={() => navigate("/courses")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Xem khóa học
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">
                        Tư vấn với chuyên gia
                      </h3>
                      <p className="text-red-700 text-sm mb-3">
                        Gặp gỡ chuyên viên để được hỗ trợ cá nhân hóa.
                      </p>
                      <button
                        onClick={() => navigate("/consultation")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Đặt lịch hẹn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center space-y-4">
              {isAuthenticated && (
                <div>
                  {saveStatus !== "success" && (
                    <button
                      onClick={() => handleSaveResult(score, result)}
                      disabled={isSaving}
                      className={`w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        isSaving
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu kết quả"
                      )}
                    </button>
                  )}
                  {saveStatus === "success" && (
                    <div className="text-green-600 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Đã lưu kết quả thành công!</span>
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="text-red-600 flex items-center justify-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span>Không thể lưu kết quả. Vui lòng thử lại.</span>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setSelectedOption(null);
                  setSaveStatus("idle");
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Làm lại khảo sát
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = surveyData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {surveyData.title}
            </h1>
            <span className="text-gray-500 font-medium">
              Câu {currentQuestion + 1}/{surveyData.questions.length}
            </span>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${
                    (currentQuestion / surveyData.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">{surveyData.note}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="answer"
                    checked={selectedOption === index}
                    onChange={() => handleOptionSelect(index)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className={`block w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedOption === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedOption === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-700">{option.text}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedOption === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {currentQuestion === surveyData.questions.length - 1
                ? "Hoàn thành"
                : "Câu tiếp theo"}
            </button>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Lưu ý</h3>
                <p className="text-blue-700 text-sm">
                  Tất cả thông tin của bạn sẽ được bảo mật tuyệt đối. Việc trả
                  lời trung thực sẽ giúp chúng tôi đưa ra lời khuyên phù hợp
                  nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskSurvey;
