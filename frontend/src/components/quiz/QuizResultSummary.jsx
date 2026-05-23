import React from 'react';
import { Award, LayoutGrid, FileText, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResultSummary = ({
  quiz,
  score,
  stats,
  analyzing,
  answers,
  courseId,
  onAIAnalyze,
  onRetry,
}) => {
  const navigate = useNavigate();

  /**
   * Tính trạng thái từng câu để hiển thị trong danh sách:
   * - 'correct': đúng (xanh)
   * - 'wrong': sai (đỏ)
   * - 'skipped': bỏ qua (xám)
   */
  const getQuestionStatus = (q) => {
    const userAnswer = answers[q.id];

    if (!userAnswer || (typeof userAnswer !== 'object' || Object.keys(userAnswer).length === 0)) {
      if (!userAnswer) return 'skipped';
      if (typeof userAnswer === 'object' && Object.keys(userAnswer).length === 0) return 'skipped';
    }

    let isCorrect = false;

    if (q.question_text.includes('[blank')) {
      const regex = /\[blank(?:_(\d+))?\]/g;
      let m; let tb = 0; let cb = 0;
      while ((m = regex.exec(q.question_text)) !== null) {
        tb++;
        const bn = m[1] || '1';
        if (q.answers.find(a => a.id == userAnswer?.[bn])?.is_correct) cb++;
      }
      isCorrect = tb > 0 && cb === tb;
    } else {
      isCorrect = q.answers.find(a => a.id == userAnswer)?.is_correct;
    }

    return isCorrect ? 'correct' : 'wrong';
  };

  return (
    <div className="lg:col-span-4 space-y-4 font-sans">
      
      {/* Khung tổng hợp kết quả chính - Cấu trúc phẳng, bo góc nhỏ */}
      <div className="bg-white border border-gray-300 rounded-sm p-5 text-center sticky top-6 shadow-sm">
        
        {/* Biểu tượng khen thưởng hình khối vuông vức */}
        <div className="w-12 h-12 bg-gray-100 text-gray-700 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-3">
          <Award size={24} />
        </div>

        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-0.5">Kết quả bài làm</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-4">
          Hệ thống đã ghi nhận hoàn thành bài thi
        </p>

        {/* Ngày thực hiện bài thi */}
        <div className="text-gray-500 text-[11px] font-semibold border-b border-gray-200 pb-3 mb-4">
          Ngày nộp bài: {new Date().toLocaleDateString('vi-VN')}
        </div>

        {/* Khối hiển thị điểm số phẳng, tối giản */}
        <div className="text-4xl font-black text-blue-700 mb-4 tabular-nums leading-none">
          {score}
          <span className="text-xs font-bold text-gray-400 ml-1">/{quiz?.questions?.length || 0}</span>
        </div>

        {/* Thống kê nhanh theo hàng dọc từ trên xuống (Không dùng lưới grid) */}
        <div className="space-y-1.5 mb-5 text-xs font-medium">
          <div className="bg-green-50/50 p-2 border border-green-300 flex items-center justify-between rounded-sm">
            <span className="text-green-700 font-bold uppercase text-[10px] tracking-wide">Số câu đúng</span>
            <span className="text-sm font-bold text-green-700">{stats.correct}</span>
          </div>
          
          <div className="bg-red-50/50 p-2 border border-red-300 flex items-center justify-between rounded-sm">
            <span className="text-red-700 font-bold uppercase text-[10px] tracking-wide">Số câu sai</span>
            <span className="text-sm font-bold text-red-700">{stats.wrong}</span>
          </div>
          
          <div className="bg-gray-50 p-2 border border-gray-300 flex items-center justify-between rounded-sm">
            <span className="text-gray-600 font-bold uppercase text-[10px] tracking-wide">Bỏ qua</span>
            <span className="text-sm font-bold text-gray-700">{stats.skipped}</span>
          </div>
        </div>

        {/* Danh sách nút hành động - Xếp dọc hoàn toàn, không có loading xoay tròn */}
        <div className="space-y-2 text-xs">
          
          {/* Nút gửi yêu cầu phân tích học thuật */}
          <button
            type="button"
            onClick={onAIAnalyze}
            disabled={analyzing}
            className="w-full h-9 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase tracking-wide rounded-sm border border-blue-800 transition disabled:opacity-60 cursor-pointer"
          >
            {analyzing ? 'Hệ thống đang phân tích...' : 'Yêu cầu phân tích lỗi sai'}
          </button>

          {/* Nút thực hiện lại bài kiểm tra */}
          <button
            type="button"
            onClick={onRetry}
            className="w-full h-9 bg-gray-800 hover:bg-gray-900 text-white font-bold uppercase tracking-wide rounded-sm border border-gray-900 transition flex items-center justify-center cursor-pointer"
          >
            <RefreshCcw size={12} className="mr-2" />
            Làm lại bài thi
          </button>

          {/* Nút quay lại màn hình tổng quan khóa học */}
          <button
            type="button"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="w-full h-9 bg-white hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-wide rounded-sm border border-gray-400 transition"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultSummary;