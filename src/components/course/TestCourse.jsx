import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestCourse = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentSelection, setCurrentSelection] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://684a940d165d05c5d3596089.mockapi.io/testcourse');
                if (!response.ok) throw new Error('Failed to fetch test data');
                const data = await response.json();
                setTestData(data[0]); // Lấy phần tử đầu tiên
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, []);

    const calculateScores = () => {
        let correct = 0;
        let wrong = 0;
        const total = testData.questions.length;

        for (let i = 0; i < total; i++) {
            const questionData = testData.questions[i];
            const userAnswer = selectedAnswers[i];
            if (userAnswer && questionData.correctAnswer === userAnswer) {
                correct++;
            } else {
                wrong++;
            }
        }
        return { correct, wrong };
    };

    const handleOptionSelect = (optionId) => {
        setCurrentSelection(optionId);
    };

    const handleSubmit = () => {
        const updatedAnswers = { ...selectedAnswers };
        if (currentSelection !== null) {
            updatedAnswers[currentQuestion] = currentSelection;
        }
        setSelectedAnswers(updatedAnswers);
        const { correct, wrong } = calculateScores();
        setCorrectAnswers(correct);
        setWrongAnswers(wrong);
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
        setCurrentQuestion(prev => (prev + 1 < totalQuestions ? prev + 1 : 0));
    };

    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    const getQuestionStatus = (index) => {
        return selectedAnswers[index] ? 'answered' : 'unanswered';
    };

    const getQuestionButtonClass = (index) => {
        const status = getQuestionStatus(index);
        const isActive = index === currentQuestion;
        if (isActive) return 'bg-blue-500 text-white';
        if (status === 'answered') return 'bg-gray-400 text-white';
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    };

    const totalAnswered = Object.keys(selectedAnswers).length;

    useEffect(() => {
        setCurrentSelection(selectedAnswers[currentQuestion] || null);
    }, [currentQuestion, selectedAnswers]);

    useEffect(() => {
        if (testData) {
            const { correct, wrong } = calculateScores();
            setCorrectAnswers(correct);
            setWrongAnswers(wrong);
        }
    }, [selectedAnswers, testData]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Lỗi khi tải dữ liệu</h2>
                    <p className="mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!testData || !testData.questions || testData.questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Không có dữ liệu</h2>
                    <p>Không tìm thấy câu hỏi nào để hiển thị.</p>
                </div>
            </div>
        );
    }

    const currentQuestionData = testData.questions[currentQuestion];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="text-sm text-gray-500 mb-2">
                Câu hỏi {currentQuestion + 1}/{testData.questions.length}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{testData.title}</h1>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(totalAnswered / testData.questions.length) * 100}%` }}
                ></div>
            </div>

            {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Kết quả bài kiểm tra</h2>
                    <p className="mb-2">Số câu đúng: <strong>{correctAnswers}</strong></p>
                    <p className="mb-2">Số câu sai: <strong>{wrongAnswers}</strong></p>
                    <p className="mb-2">Số câu đã trả lời: <strong>{totalAnswered}</strong></p>
                    <p className="mb-2">Số câu chưa trả lời: <strong>{testData.questions.length - totalAnswered}</strong></p>
                    <p className="mb-4">Tổng số câu: <strong>{testData.questions.length}</strong></p>
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm">
                            <strong>Lưu ý:</strong> Các câu chưa trả lời sẽ được tính là câu sai trong kết quả cuối cùng.
                        </p>
                    </div>
                    <button onClick={() => window.location.reload()} className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Làm lại bài kiểm tra
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">{currentQuestionData.question}</h3>
                            <div className="space-y-2">
                                {currentQuestionData.options?.map((option) => (
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
                        <button
                            onClick={goToPreviousQuestion}
                            disabled={currentQuestion === 0}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
