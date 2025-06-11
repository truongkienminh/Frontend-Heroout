import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestCourse = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentSelection, setCurrentSelection] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const testData = {
        title: 'Kiểm tra kiến thức Module 1',
        totalQuestions: 10,
        questions: [
            { id: 1, type: 'multiple_choice', question: 'Ma túy được phân loại thành mấy nhóm chính theo tác động lên hệ thần kinh?', options: [ { id: 'A', text: '2 nhóm: kích thích và ức chế' }, { id: 'B', text: '3 nhóm: kích thích, ức chế và gây ảo giác' }, { id: 'C', text: '4 nhóm: tự nhiên, tổng hợp, bán tổng hợp và khác' }, { id: 'D', text: '5 nhóm: theo mức độ nguy hiểm từ thấp đến cao' } ], correctAnswer: 'B' },
            { id: 2, type: 'multiple_choice', question: 'Dấu hiệu nào sau đây KHÔNG phải là biểu hiện của người sử dụng ma túy?', options: [ { id: 'A', text: 'Thay đổi hành vi đột ngột' }, { id: 'B', text: 'Mất ngủ thường xuyên' }, { id: 'C', text: 'Tập thể dục đều đặn' }, { id: 'D', text: 'Giảm cân nhanh chóng' } ], correctAnswer: 'C' },
            { id: 3, type: 'multiple_choice', question: 'Tác hại chính của ma túy đối với hệ thần kinh là gì?', options: [ { id: 'A', text: 'Làm tăng trí nhớ' }, { id: 'B', text: 'Phá hủy tế bào não và gây nghiện' }, { id: 'C', text: 'Cải thiện khả năng tập trung' }, { id: 'D', text: 'Giúp thư giãn tốt hơn' } ], correctAnswer: 'B' },
            { id: 4, type: 'multiple_choice', question: 'Heroin thuộc loại ma túy nào?', options: [ { id: 'A', text: 'Ma túy kích thích' }, { id: 'B', text: 'Ma túy ức chế' }, { id: 'C', text: 'Ma túy gây ảo giác' }, { id: 'D', text: 'Ma túy tổng hợp' } ], correctAnswer: 'B' },
            { id: 5, type: 'multiple_choice', question: 'Biện pháp nào hiệu quả nhất để phòng chống tệ nạn ma túy?', options: [ { id: 'A', text: 'Tuyên truyền giáo dục' }, { id: 'B', text: 'Xử phạt nghiêm khắc' }, { id: 'C', text: 'Cách ly người nghiện' }, { id: 'D', text: 'Tất cả các biện pháp trên' } ], correctAnswer: 'D' },
            { id: 6, type: 'multiple_choice', question: 'Thời gian cai nghiện ma túy thường kéo dài bao lâu?', options: [ { id: 'A', text: '1-2 tuần' }, { id: 'B', text: '1-3 tháng' }, { id: 'C', text: '6 tháng đến vài năm' }, { id: 'D', text: '1 tuần' } ], correctAnswer: 'C' },
            { id: 7, type: 'multiple_choice', question: 'Ma túy đá (Methamphetamine) thuộc nhóm nào?', options: [ { id: 'A', text: 'Ma túy tự nhiên' }, { id: 'B', text: 'Ma túy tổng hợp' }, { id: 'C', text: 'Ma túy bán tổng hợp' }, { id: 'D', text: 'Ma túy truyền thống' } ], correctAnswer: 'B' },
            { id: 8, type: 'multiple_choice', question: 'Hệ quả nào nghiêm trọng nhất của việc sử dụng ma túy?', options: [ { id: 'A', text: 'Mất tiền' }, { id: 'B', text: 'Mất sức khỏe' }, { id: 'C', text: 'Mất mạng sống' }, { id: 'D', text: 'Mất việc làm' } ], correctAnswer: 'C' },
            { id: 9, type: 'multiple_choice', question: 'Độ tuổi nào dễ bị tác động sử dụng ma túy nhất?', options: [ { id: 'A', text: 'Dưới 15 tuổi' }, { id: 'B', text: '15-25 tuổi' }, { id: 'C', text: '25-35 tuổi' }, { id: 'D', text: 'Trên 35 tuổi' } ], correctAnswer: 'B' },
            { id: 10, type: 'multiple_choice', question: 'Yếu tố nào quan trọng nhất trong việc phòng chống ma túy ở trẻ em?', options: [ { id: 'A', text: 'Giáo dục gia đình' }, { id: 'B', text: 'Giáo dục nhà trường' }, { id: 'C', text: 'Môi trường xã hội' }, { id: 'D', text: 'Tất cả các yếu tố trên' } ], correctAnswer: 'D' }
        ]
    };

    const currentQuestionData = testData.questions[currentQuestion];

    useEffect(() => {
        setCurrentSelection(selectedAnswers[currentQuestion] || null);
    }, [currentQuestion, selectedAnswers]);

    // Calculate scores including unanswered questions as wrong
    const calculateScores = () => {
        let correct = 0;
        let wrong = 0;
        
        // Loop through all questions (0 to totalQuestions-1)
        for (let i = 0; i < testData.totalQuestions; i++) {
            const questionData = testData.questions[i];
            const userAnswer = selectedAnswers[i];
            
            if (userAnswer && questionData.correctAnswer === userAnswer) {
                correct++;
            } else {
                // Count as wrong if no answer or wrong answer
                wrong++;
            }
        }
        
        return { correct, wrong };
    };

    useEffect(() => {
        const { correct, wrong } = calculateScores();
        setCorrectAnswers(correct);
        setWrongAnswers(wrong);
    }, [selectedAnswers]);

    const handleOptionSelect = (optionId) => {
        setCurrentSelection(optionId);
    };

    const handleSubmit = () => {
        const updatedAnswers = { ...selectedAnswers };
        if (currentSelection !== null) {
            updatedAnswers[currentQuestion] = currentSelection;
        }
        setSelectedAnswers(updatedAnswers);
        setIsSubmitted(true);
    };

    const goToPreviousQuestion = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const goToNextQuestion = () => {
        const updatedAnswers = { ...selectedAnswers };
        if (currentSelection !== null) {
            updatedAnswers[currentQuestion] = currentSelection;
        }
        setSelectedAnswers(updatedAnswers);

        const totalQuestions = testData.questions.length;
        setCurrentQuestion(prev => {
            if (prev + 1 < totalQuestions) return prev + 1;
            return 0;
        });
    };

    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    const getQuestionStatus = (index) => {
        if (selectedAnswers[index]) return 'answered';
        return 'unanswered';
    };

    const getQuestionButtonClass = (index) => {
        const status = getQuestionStatus(index);
        const isActive = index === currentQuestion;
        if (isActive) return 'bg-blue-500 text-white';
        switch (status) {
            case 'answered': return 'bg-gray-400 text-white';
            default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        }
    };

    const totalAnswered = Object.keys(selectedAnswers).length;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="text-sm text-gray-500 mb-2">Câu hỏi {currentQuestion + 1}/{testData.totalQuestions}</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{testData.title}</h1>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(totalAnswered / testData.totalQuestions) * 100}%` }}
                ></div>
            </div>

            {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Kết quả bài kiểm tra</h2>
                    <p className="mb-2">Số câu đúng: <strong>{correctAnswers}</strong></p>
                    <p className="mb-2">Số câu sai: <strong>{wrongAnswers}</strong></p>
                    <p className="mb-2">Số câu đã trả lời: <strong>{totalAnswered}</strong></p>
                    <p className="mb-2">Số câu chưa trả lời: <strong>{testData.totalQuestions - totalAnswered}</strong> (tính là sai)</p>
                    <p className="mb-4">Tổng số câu: <strong>{testData.totalQuestions}</strong></p>
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm">
                            <strong>Lưu ý:</strong> Các câu chưa trả lời sẽ được tính là câu sai trong kết quả cuối cùng.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Làm lại bài kiểm tra
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">{currentQuestionData.question}</h3>
                            <div className="space-y-2">
                                {currentQuestionData.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        className={`w-full p-3 text-left border rounded-lg ${currentSelection === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <strong>{option.id}.</strong> {option.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <button onClick={goToPreviousQuestion} disabled={currentQuestion === 0} className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                            <span>Câu trước</span>
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={goToNextQuestion}
                                className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <span>Câu tiếp theo</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Nộp bài
                            </button>
                            
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan câu hỏi</h3>
                        <div className="flex flex-wrap gap-2">
                            {testData.questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${getQuestionButtonClass(index)}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TestCourse;