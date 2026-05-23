import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ── Import các component con ──────────────────────────────────────────────────
import QuizHeader from '../components/quiz/QuizHeader';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResultSummary from '../components/quiz/QuizResultSummary';
import QuizResultDetail from '../components/quiz/QuizResultDetail';
import QuizConfirmModal from '../components/quiz/QuizConfirmModal';

/**
 * QuizViewPage — Trang làm bài trắc nghiệm
 *
 * Chịu trách nhiệm:
 *  - Quản lý toàn bộ state: quiz, answers, timer, submitted, score, AI analysis
 *  - Fetch dữ liệu bài thi từ API
 *  - Xử lý nộp bài + chấm điểm + lưu kết quả lên server
 *  - Gọi AI phân tích lỗi sai
 *  - Render các component con theo 2 phase: đang làm bài / đã nộp bài
 */
const QuizViewPage = () => {
    const { lessonId, courseId } = useParams();
    const navigate = useNavigate();

    // ── State chính ─────────────────────────────────────────────────────────────
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);  // Đã nộp bài chưa
    const [score, setScore] = useState(0);              // Điểm số cuối cùng
    const [aiAnalysis, setAiAnalysis] = useState({});   // { [questionId]: string markdown }
    const [analyzing, setAnalyzing] = useState(false);  // Đang gọi AI phân tích
    const [correctCount, setCorrectCount] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);        // Số giây còn lại

    // ── State modal xác nhận nộp bài ────────────────────────────────────────────
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalConfig, setConfirmModalConfig] = useState({
        title: '', message: '', onConfirm: null
    });

    // ── Refs ─────────────────────────────────────────────────────────────────────
    const timerRef = useRef(null);       // Ref interval đếm ngược
    const resultsRef = useRef(null);     // Ref vùng kết quả (scroll tới)

    // ── Lifecycle ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        fetchQuiz();
        // Cleanup: xóa interval khi unmount tránh memory leak
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [lessonId, courseId]);

    // ── API: Lấy dữ liệu bài thi ─────────────────────────────────────────────────
    const fetchQuiz = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;

            // Hỗ trợ 2 loại route: theo lesson hoặc theo course
            const endpoint = lessonId
                ? `${import.meta.env.VITE_API_URL}/courses/lessons/${lessonId}/quiz`
                : `${import.meta.env.VITE_API_URL}/courses/${courseId}/quiz`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'success' && response.data.data) {
                const quizData = response.data.data;
                setQuiz(quizData);
                setTimeLeft(quizData.time_limit * 60); // Đổi phút → giây
                startTimer();
            }
        } catch (error) {
            toast.error('Không thể tải bài trắc nghiệm');
        } finally {
            setLoading(false);
        }
    };

    // ── Timer đếm ngược ──────────────────────────────────────────────────────────
    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleAutoSubmit(); // Tự nộp khi hết giờ
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    /**
     * Format giây → chuỗi "MM:SS" để hiển thị đồng hồ
     */
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * Tự động nộp bài khi hết thời gian
     */
    const handleAutoSubmit = () => {
        toast.error('Hết thời gian! Hệ thống tự động nộp bài.');
        processSubmit();
    };

    const handleSelectAnswer = (questionId, answerId) => {
        if (submitted) return;
        setAnswers({
            ...answers,
            [questionId]: answerId
        });
    };

    // ── Xử lý nộp bài ────────────────────────────────────────────────────────────
    /**
     * Mở modal xác nhận với nội dung tuỳ theo số câu đã làm
     */
    const handleSubmit = () => {
        if (submitted) return;

        const answeredCount = Object.keys(answers).length;

        if (answeredCount < quiz.questions.length) {
            // Cảnh báo khi chưa làm hết câu
            setConfirmModalConfig({
                title: 'Nộp bài khi chưa xong?',
                message: `Bạn mới làm ${answeredCount}/${quiz.questions.length} câu. Bạn vẫn muốn nộp bài chứ?`,
                onConfirm: processSubmit
            });
        } else {
            // Xác nhận bình thường khi đã làm hết
            setConfirmModalConfig({
                title: 'Xác nhận nộp bài',
                message: 'Hệ thống sẽ chấm điểm ngay lập tức. Bạn chắc chắn muốn nộp bài?',
                onConfirm: processSubmit
            });
        }

        setShowConfirmModal(true);
    };

    /**
     * Chấm điểm và lưu kết quả lên server
     */
    const processSubmit = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setShowConfirmModal(false);

        let correct = 0;

        quiz.questions.forEach(q => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.answers.find(a => a.is_correct);

            if (userAnswer === correctAnswer?.id) {
                correct++;
            }
        });

        const finalScore = Math.round((correct / quiz.questions.length) * 10);

        setCorrectCount(correct);
        setScore(finalScore);

        // ── Lưu kết quả lên server ─────────────────────────────────────────────────
        try {
            const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/courses/quizzes/${quiz.id}/results`,
                {
                    quiz_id: quiz.id,
                    score: finalScore,
                    total_questions: quiz.questions.length,
                    correct_answers: correct,
                    answers_data: answers
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'success') {
                toast.success('Đã lưu kết quả vào hệ thống! 📊');
            }
        } catch (error) {
            console.error('Lỗi khi lưu kết quả:', error);
            toast.error('Không thể lưu kết quả thi.');
        }

        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── AI phân tích lỗi sai ─────────────────────────────────────────────────────
    /**
     * Gọi API AI để phân tích các câu trả lời sai
     * Kết quả là object { [questionId]: string markdown }
     */
    const handleAIAnalyze = async () => {
        setAnalyzing(true);
        try {
            const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;

            // Lọc ra các câu trả lời sai
            const wrongQuestions = quiz.questions
                .filter(q => {
                    const correctId = q.answers.find(a => a.is_correct)?.id;
                    return answers[q.id] !== correctId;
                })
                .map(q => ({
                    id: q.id,
                    question: q.question_text,
                    userAnswer: q.answers.find(a => a.id === answers[q.id])?.answer_text || 'Không trả lời',
                    correctAnswer: q.answers.find(a => a.is_correct)?.answer_text
                }));

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/ai/analyze-result`,
                { quizTitle: quiz.title, questions: wrongQuestions },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'success') {
                // Kết quả là object mapping questionId → nội dung phân tích
                setAiAnalysis(response.data.data.analysis);
            }
        } catch (error) {
            console.error('Lỗi AI phân tích:', error);
        } finally {
            setAnalyzing(false);
        }
    };


    /**
     * Làm lại bài thi từ đầu: reset toàn bộ state
     */
    const handleRetry = () => {
        setSubmitted(false);
        setAnswers({});
        setScore(0);
        setCurrentQuestionIndex(0);
        setTimeLeft(quiz.time_limit * 60);
        startTimer();
    };

    // ── Tính thống kê nhanh cho trang kết quả ────────────────────────────────────
    /**
     * Tính số câu đúng / sai / bỏ qua từ answers hiện tại
     * Dùng cho QuizResultSummary
     */
    const computeStats = () => {
        return quiz.questions.reduce((acc, q) => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.answers.find(a => a.is_correct)?.id;

            if (!userAnswer) {
                acc.skipped++;
            } else if (userAnswer === correctAnswer) {
                acc.correct++;
            } else {
                acc.wrong++;
            }

            return acc;
        }, { correct: 0, wrong: 0, skipped: 0 });
    };

    // ── Render ────────────────────────────────────────────────────────────────────

    // Trạng thái đang tải dữ liệu
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    // Trường hợp không có bài thi hoặc không có câu hỏi
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center bg-white rounded-[40px] shadow-sm border border-slate-100 mt-20">
                <HelpCircle size={48} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-xl font-bold text-slate-900">Chưa có bài thi</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const stats = submitted ? computeStats() : null;

    return (
        <div className="bg-[#F8FAFC] min-h-screen flex justify-center">
            <div className="w-full max-w-4xl px-4 py-6">

                {!submitted ? (
                    // ── Phase 1: Đang làm bài ──────────────────────────────────────────
                    <>
                        {/* Header: tên bài, đồng hồ, nút nộp */}
                        <QuizHeader
                            quizTitle={quiz.title}
                            timeLeft={timeLeft}
                            formatTime={formatTime}
                            onSubmit={handleSubmit}
                        />

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            {/* Câu hỏi hiện tại + điều hướng */}
                            <div className="lg:col-span-8 space-y-4">
                                <QuizQuestion
                                    currentQuestion={currentQuestion}
                                    currentIndex={currentQuestionIndex}
                                    totalQuestions={quiz.questions.length}
                                    answers={answers}
                                    submitted={submitted}
                                    onSelectAnswer={handleSelectAnswer}
                                    onPrev={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    onNext={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    allQuestions={quiz.questions}
                                />
                            </div>

                        </div>
                    </>
                ) : (
                    // ── Phase 2: Đã nộp bài — Trang kết quả ──────────────────────────
                    <div
                        ref={resultsRef}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in duration-500 w-full bg-slate-50/50 p-4 rounded-[48px]"
                    >
                        {/* Cột trái: điểm, thống kê, nút hành động */}
                        <QuizResultSummary
                            quiz={quiz}
                            score={score}
                            stats={stats}
                            analyzing={analyzing}
                            answers={answers}
                            courseId={courseId}
                            onAIAnalyze={handleAIAnalyze}
                            onRetry={handleRetry}
                        />

                        {/* Cột phải: chi tiết từng câu + giải thích + AI */}
                        <QuizResultDetail
                            questions={quiz.questions}
                            answers={answers}
                            aiAnalysis={aiAnalysis}
                            analyzing={analyzing}
                        />
                    </div>
                )}
            </div>

            {/* Modal xác nhận nộp bài */}
            {showConfirmModal && (
                <QuizConfirmModal
                    config={confirmModalConfig}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

export default QuizViewPage;
