import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, Clock, Users, Loader2 } from 'lucide-react';

const RiskSurvey = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://684c6fd0ed2578be881ecef7.mockapi.io/risksurvey');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Assuming the API returns an array and we want the first item
      // Or adjust this based on your actual API response structure
      const surveyInfo = Array.isArray(data) ? data[0] : data;
      setSurveyData(surveyInfo);
      setError(null);
    } catch (err) {
      console.error('Error fetching survey data:', err);
      setError('Không thể tải dữ liệu khảo sát. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = {
        ...answers,
        [currentQuestion]: selectedOption
      };
      setAnswers(newAnswers);

      // Logic điều hướng câu hỏi
      if (currentQuestion === 0) {
        // Câu 1: Nếu chọn "Không, chưa bao giờ" (index 0) thì kết thúc
        if (selectedOption === 0) {
          setShowResult(true);
          return;
        } else {
          // Nếu chọn "Đang hoặc đã từng dùng" thì tiếp tục câu 2
          setCurrentQuestion(1);
        }
      } else if (currentQuestion === 1) {
        // Câu 2: Nếu chọn "Không bao giờ" (index 0) thì nhảy sang câu 6
        if (selectedOption === 0) {
          setCurrentQuestion(5); // Câu 6 (index 5)
        } else {
          // Nếu có sử dụng thì tiếp tục câu 3
          setCurrentQuestion(2);
        }
      } else if (currentQuestion >= 2 && currentQuestion <= 4) {
        // Câu 3, 4, 5: tiếp tục tuần tự
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentQuestion >= 5 && currentQuestion < surveyData.questions.length - 1) {
        // Câu 6, 7: tiếp tục tuần tự
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Câu cuối cùng
        setShowResult(true);
      }

      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      let prevQuestion = currentQuestion - 1;

      // Logic điều hướng ngược lại
      if (currentQuestion === 5) {
        // Đang ở câu 6, cần kiểm tra câu 2
        if (answers[1] === 0) {
          // Nếu câu 2 trả lời "Không bao giờ", quay về câu 2
          prevQuestion = 1;
        } else {
          // Nếu câu 2 không trả lời "Không bao giờ", quay về câu 5
          prevQuestion = 4;
        }
      } else if (currentQuestion === 1) {
        // Đang ở câu 2, quay về câu 1
        prevQuestion = 0;
      }

      setCurrentQuestion(prevQuestion);
      setSelectedOption(answers[prevQuestion] !== undefined ? answers[prevQuestion] : null);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.keys(answers).forEach(questionIndex => {
      const question = surveyData.questions[questionIndex];
      const selectedOptionIndex = answers[questionIndex];
      if (question && question.options[selectedOptionIndex]) {
        totalScore += question.options[selectedOptionIndex].score;
      }
    });
    return totalScore;
  };

  const getMaxPossibleScore = () => {
    // Tính điểm tối đa dựa trên các câu đã trả lời
    let maxScore = 0;
    Object.keys(answers).forEach(questionIndex => {
      const question = surveyData.questions[questionIndex];
      if (question) {
        maxScore += Math.max(...question.options.map(o => o.score));
      }
    });
    return maxScore;
  };

  const getRiskLevel = (score) => {
    if (score >= 7) return { level: "NGUY CƠ CAO", color: "bg-red-100 text-red-800", description: "Nguy cơ cao. Bạn nên tìm kiếm sự hỗ trợ chuyên nghiệp." };
    if (score >= 2 && score <= 6) return { level: "NGUY CƠ TRUNG BÌNH", color: "bg-yellow-100 text-yellow-800", description: "Nguy cơ trung bình. Bạn nên cân nhắc tìm kiếm sự hỗ trợ." };
    return { level: "NGUY CƠ THẤP", color: "bg-green-100 text-green-800", description: "Nguy cơ thấp. Tiếp tục duy trì lối sống lành mạnh." };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Đang tải khảo sát...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
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

  // No survey data
  if (!surveyData || !surveyData.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Info className="w-8 h-8 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có dữ liệu khảo sát</h2>
          <p className="text-gray-600">Không thể tải được dữ liệu khảo sát.</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const maxScore = getMaxPossibleScore();
    const riskLevel = getRiskLevel(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kết Quả Đánh Giá CRAFFT</h2>
              <p className="text-gray-600">Đánh giá nguy cơ sử dụng chất gây nghiện của bạn</p>
            </div>

            <div className={`${riskLevel.color} p-4 rounded-lg mb-6 text-center`}>
              <div className="font-bold text-lg">
                {riskLevel.level} - Điểm số: {score}/{maxScore} • {riskLevel.description}
              </div>
            </div>

            {riskLevel.level !== "NGUY CƠ THẤP" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Tham gia khóa học "Kỹ năng từ chối ma túy"</h3>
                      <p className="text-blue-700 text-sm mb-3">Học cách từ chối lời kéo sử dụng chất gây nghiện</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Tư vấn với chuyên gia</h3>
                      <p className="text-red-700 text-sm mb-3">Gặp gỡ chuyên viên để được hỗ trợ cá nhân</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setSelectedOption(null);
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
            <h1 className="text-2xl font-bold text-gray-800">{surveyData.title}</h1>
            <span className="text-gray-500 font-medium">Câu {currentQuestion + 1}/{surveyData.questions.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentQuestion) / surveyData.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">{surveyData.note}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h2>

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
                    className={`block w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedOption === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedOption === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
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
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedOption === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {currentQuestion === surveyData.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
            </button>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Lưu ý</h3>
                <p className="text-blue-700 text-sm">
                  Tất cả thông tin của bạn sẽ được bảo mật tuyệt đối. Việc trả lời trung thực sẽ giúp chúng tôi đưa ra lời khuyên phù hợp nhất.
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