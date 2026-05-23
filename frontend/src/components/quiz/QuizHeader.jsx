import React from 'react';
import { ArrowLeft, Timer, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizHeader = ({ quizTitle, timeLeft, formatTime, onSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-300 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 font-sans shadow-sm">
      {/* Bên trái: Nút quay lại + Tiêu đề bài kiểm tra */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-300 rounded-sm transition cursor-pointer"
          title="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-bold text-gray-900 uppercase tracking-tight truncate max-w-[300px] md:max-w-[450px]">
          {quizTitle || 'Bài kiểm tra đánh giá'}
        </h1>
      </div>

      {/* Bên phải: Bộ đếm thời gian + Nút nộp bài xử lý phẳng */}
      <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
        {/* Đồng hồ đếm ngược: Đổi sang màu đỏ cảnh báo khi dưới 60 giây */}
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-bold tabular-nums border uppercase tracking-wider ${
          timeLeft < 60
            ? 'bg-red-50 text-red-700 border-red-300 font-extrabold'
            : 'bg-gray-50 text-gray-700 border-gray-300'
        }`}>
          <Timer size={14} className={timeLeft < 60 ? 'animate-pulse' : ''} />
          <span>Thời gian: {formatTime(timeLeft)}</span>
        </div>

        {/* Nút thực thi nộp bài */}
        <button
          onClick={onSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 border border-blue-800 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center space-x-1.5 transition cursor-pointer"
        >
          <Send size={12} />
          <span>Nộp bài</span>
        </button>
      </div>
    </div>
  );
};

export default QuizHeader;