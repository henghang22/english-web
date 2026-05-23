import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, X, CheckCircle2,
  HelpCircle, Clock, Pencil, Loader2, AlertCircle,
  Sparkles, Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/auth.store';

const TeacherQuizPage = () => {
  const { lessonId, courseId } = useParams();
  const { token } = useAuthStore();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [quizFormData, setQuizFormData] = useState({ title: '', time_limit: 15 });
  // State cho Confirm Xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [questionText, setQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [answers, setAnswers] = useState([
    { answer_text: '', is_correct: true },
    { answer_text: '', is_correct: false },
    { answer_text: '', is_correct: false },
    { answer_text: '', is_correct: false },
  ]);

  useEffect(() => {
    fetchQuizData();
  }, [lessonId, courseId]);

  const fetchQuizData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = lessonId
        ? `${import.meta.env.VITE_API_URL}/teacher/lessons/${lessonId}/quiz`
        : `${import.meta.env.VITE_API_URL}/teacher/courses/${courseId}/quiz`;

      const quizRes = await axios.get(endpoint, { headers });
      setQuiz(quizRes.data.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu Quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingQuestionId(null);
    setQuestionText('');
    setExplanation('');
    setAnswers([
      { answer_text: '', is_correct: true },
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false },
    ]);
    setIsModalOpen(true);
  };

  const handleEditClick = (q) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.question_text);
    setExplanation(q.explanation || '');
    setAnswers(q.answers.map(a => ({
      id: a.id,
      answer_text: a.answer_text,
      is_correct: a.is_correct
    })));
    setIsModalOpen(true);
  };


  const handleUpdateQuiz = async () => {
    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/teacher/quizzes/${quiz.id}`,
        quizFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Đã cập nhật thông tin Quiz! ✨');
      setIsEditingQuiz(false);
      fetchQuizData();

    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật Quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = lessonId
        ? { lesson_id: lessonId, title: `Quiz bài học`, time_limit: 15 }
        : { course_id: courseId, title: `Bài thi cuối khóa`, time_limit: 45 };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/teacher/quizzes`,
        { ...payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === 'success') {
        toast.success('Đã khởi tạo bộ Quiz! 🎉');
        fetchQuizData();
      }
    } catch (error) {
      toast.error('Lỗi khi tạo Quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = 'Vui lòng chọn ít nhất một đáp án đúng';
    if (!answers.some(a => a.is_correct)) return toast.error(message);

    setSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        question_text: questionText,
        explanation,
        answers,
        lesson_id: lessonId,
        course_id: courseId
      };

      if (editingQuestionId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/teacher/questions/${editingQuestionId}`,
          payload,
          { headers }
        );
        toast.success('Đã cập nhật câu hỏi! ✨');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/teacher/quizzes/${quiz.id}/questions`,
          payload,
          { headers }
        );
        toast.success('Đã thêm câu hỏi! 📝');
      }

      setIsModalOpen(false);
      fetchQuizData();
    } catch (error) {
      toast.error(editingQuestionId ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/teacher/questions/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa câu hỏi');
      setShowDeleteConfirm(false);
      fetchQuizData();
    } catch (error) {
      toast.error('Không thể xóa câu hỏi');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-blue-700" size={36} />
    </div>
  );

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <button onClick={() => window.history.back()} className="inline-flex items-center text-slate-500 hover:text-blue-700 transition text-xs font-semibold">
            <ArrowLeft size={14} className="mr-1" /> Quay lại
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {lessonId ? 'Quản lý Quiz Bài học' : 'Quản lý Bài thi cuối khóa'}
          </h1>
        </div>
        {quiz && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded font-medium hover:bg-blue-800 transition shrink-0"
          >
            <Plus size={18} />
            <span>Thêm câu hỏi</span>
          </button>
        )}
      </div>

      {/* Trạng thái chưa khởi tạo Quiz */}
      {!quiz ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Chưa có Quiz cho {lessonId ? 'bài học' : 'khóa học'} này</h3>
          <button
            onClick={handleCreateQuiz}
            disabled={submitting}
            className="bg-blue-700 text-white px-5 py-2.5 rounded font-medium hover:bg-blue-800 transition disabled:bg-slate-300 flex items-center justify-center mx-auto gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <span>Khởi tạo ngay</span>}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Thông tin bộ Quiz */}
          {/* Thông tin bộ Quiz - Thiết kế phẳng hóa đồng bộ */}
          <div className="bg-white border border-gray-300 p-4 rounded-sm font-sans shadow-sm">

            {isEditingQuiz ? (
              // ================= EDIT MODE (CHẾ ĐỘ CHỈNH SỬA) =================
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Tiêu đề bộ Quiz
                  </label>
                  <input
                    type="text"
                    value={quizFormData.title}
                    onChange={(e) =>
                      setQuizFormData({ ...quizFormData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    value={quizFormData.time_limit}
                    onChange={(e) =>
                      setQuizFormData({
                        ...quizFormData,
                        time_limit: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-600"
                  />
                </div>

                {/* THANH THAO TÁC NÚT PHẲNG */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 text-xs">
                  <button
                    onClick={async () => {
                      await handleUpdateQuiz();
                      setIsEditingQuiz(false);
                    }}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold border border-blue-800 rounded-sm uppercase tracking-wide cursor-pointer"
                  >
                    Lưu thay đổi
                  </button>

                  <button
                    onClick={() => {
                      setIsEditingQuiz(false);
                      setQuizFormData({
                        title: quiz.title,
                        time_limit: quiz.time_limit,
                      });
                    }}
                    className="px-4 py-1.5 bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-400 rounded-sm uppercase tracking-wide cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>

              </div>
            ) : (
              // ================= VIEW MODE (CHẾ ĐỘ HIỂN THỊ) =================
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center space-x-3 min-w-0">
                  {/* Khối chứa biểu tượng vuông vức */}
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-sm flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-gray-600" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight truncate">
                      {quiz.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-0.5">
                      <span>Thời lượng: {quiz.time_limit} phút</span>
                      <span>•</span>
                      <span>Số câu: {quiz.questions?.length || 0} câu hỏi</span>
                    </div>
                  </div>
                </div>

                {/* NÚT ĐIỀU HƯỚNG CHỈNH SỬA PHẲNG */}
                <button
                  onClick={() => setIsEditingQuiz(true)}
                  className="p-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-400 rounded-sm transition shrink-0 cursor-pointer"
                  title="Chỉnh sửa cấu hình"
                >
                  <Pencil size={14} />
                </button>

              </div>
            )}
          </div>

          {/* Danh sách câu hỏi */}
          <div className="space-y-4">
            {quiz.questions?.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    <h4 className="font-semibold text-slate-900 text-sm leading-relaxed">
                      {q.question_text}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button onClick={() => handleEditClick(q)} className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition"><Pencil size={15} /></button>
                    <button onClick={() => confirmDelete(q.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition"><Trash2 size={15} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.answers?.map((ans) => (
                    <div key={ans.id} className={`p-3 rounded border text-xs flex items-center justify-between ${ans.is_correct ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>{ans.answer_text}</span>
                      {ans.is_correct && <CheckCircle2 size={14} className="shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded text-xs text-slate-500 flex items-start gap-1.5">
                    <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <p><strong>Giải thích:</strong> {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">{editingQuestionId ? 'Chỉnh sửa câu hỏi' : 'Soạn câu hỏi mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4 lg:border-r lg:border-slate-200 lg:pr-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Nội dung câu hỏi</label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Chỉ dùng trắc nghiệm A/B/C/D
                    </span>
                  </div>
                  <textarea
                    required
                    rows="4"
                    placeholder="Nhập câu hỏi..."
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none text-sm resize-none"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                  />
                </div>



                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Giải thích đáp án (Không bắt buộc)</label>
                  <textarea rows="3" placeholder="Giải thích tại sao đáp án này đúng..." className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none text-sm resize-none" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-600 uppercase">Các đáp án (Nhấn số để đổi đáp án đúng)</label>
                <div className="space-y-3">
                  {answers.map((ans, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newAns = answers.map((a, i) => ({
                            ...a,
                            is_correct: i === idx
                          }));
                          setAnswers(newAns);
                        }}
                        className={`w-9 h-9 rounded flex items-center justify-center border font-bold text-sm shrink-0 transition ${ans.is_correct ? 'bg-green-600 border-green-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-400 hover:border-slate-400'}`}
                      >
                        {ans.is_correct ? <CheckCircle2 size={16} /> : (idx + 1)}
                      </button>
                      <input type="text" required placeholder={`Nhập đáp án ${idx + 1}...`} className="flex-1 px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none text-sm" value={ans.answer_text} onChange={(e) => { const newAns = [...answers]; newAns[idx].answer_text = e.target.value; setAnswers(newAns); }} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 lg:mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 font-medium transition">Hủy</button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium transition disabled:bg-slate-300 flex items-center justify-center">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Xác nhận'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Question Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white w-full max-w-xs rounded-lg p-6 text-center shadow-2xl">
            <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1 text-base">Xóa câu hỏi này?</h3>
            <p className="text-slate-500 text-xs mb-5">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-slate-100 rounded text-sm font-medium text-slate-600 hover:bg-slate-200">Hủy</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 flex items-center justify-center">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default TeacherQuizPage;