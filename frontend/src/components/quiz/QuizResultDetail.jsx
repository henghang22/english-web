import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ShieldCheck, CheckCircle2, XCircle, HelpCircle,
  Info, BrainCircuit, Loader2
} from 'lucide-react';

const QuizResultDetail = ({ questions, answers, aiAnalysis, analyzing }) => {

  const getQuestionStatus = (q) => {
    const userAnswer = answers[q.id];
    const skipped = !userAnswer || (typeof userAnswer === 'object' && Object.keys(userAnswer).length === 0);
    if (skipped) return { isCorrect: false, isSkipped: true };

    const isCorrect = !!q.answers.find(a => a.id == userAnswer)?.is_correct;
    return { isCorrect, isSkipped: false };
  };

  return (
    <div className="lg:col-span-8 space-y-4 font-sans">
      {/* Tiêu đề phân khu kết quả */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-sm font-bold text-gray-900 flex items-center uppercase tracking-tight">
          <ShieldCheck size={16} className="mr-2 text-blue-700" />
          Chi tiết kết quả bài làm
        </h3>
        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-3 py-1 border border-gray-300 rounded-sm uppercase tracking-wide">
          Kết quả chi tiết
        </span>
      </div>

      {/* Vòng lặp hiển thị từng câu hỏi dạng phẳng */}
      {questions.map((q, idx) => {
        const { isCorrect, isSkipped } = getQuestionStatus(q);
        const userAnswer = answers[q.id];

        return (
          <div
            key={q.id}
            className={`bg-white p-5 border rounded-sm shadow-sm ${
              isSkipped
                ? 'border-gray-300'
                : isCorrect
                  ? 'border-green-400 bg-green-50/20'
                  : 'border-red-400 bg-red-50/20'
            }`}
          >
            {/* Tiêu đề câu hỏi + Trạng thái chấm điểm */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start space-x-3">
                {/* Khối số thứ tự phẳng */}
                <span className={`w-8 h-8 border rounded-sm flex items-center justify-center text-xs font-bold shrink-0 ${
                  isSkipped 
                    ? 'bg-gray-800 border-gray-900 text-white' 
                    : isCorrect 
                      ? 'bg-green-700 border-green-800 text-white' 
                      : 'bg-red-700 border-red-800 text-white'
                }`}>
                  {idx + 1}
                </span>

                {/* Nội dung văn bản câu hỏi */}
                <h4 className="text-sm font-bold text-gray-900 leading-relaxed pt-0.5">
                  {q.question_text}
                </h4>
              </div>

              {/* Chỉ báo trạng thái góc phải */}
              <div className="shrink-0 pt-0.5">
                {!isSkipped && (
                  <div className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>
                )}
                {isSkipped && (
                  <div className="text-gray-400">
                    <HelpCircle size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách các phương án trả lời */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {q.answers.map((ans, i) => {
                const isUserSelected = userAnswer == ans.id;
                return (
                  <div
                    key={ans.id}
                    className={`p-3 border rounded-sm flex items-center justify-between text-xs font-medium ${
                      ans.is_correct
                        ? 'bg-green-100/70 border-green-400 text-green-900 font-bold'
                        : isUserSelected && !ans.is_correct
                          ? 'bg-red-100/70 border-red-400 text-red-900 font-bold'
                          : 'bg-gray-50 border-gray-300 text-gray-500 opacity-70'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {/* Định danh ký tự phương án (A, B, C, D) */}
                      <span className="w-5 h-5 bg-white border border-gray-300 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-700 shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="truncate">
                        {ans.answer_text.replace(/^\d+:\s*/, '')}
                      </span>
                    </div>
                    <div className="shrink-0 ml-2">
                      {ans.is_correct && <CheckCircle2 size={14} className="text-green-700" />}
                      {isUserSelected && !ans.is_correct && <XCircle size={14} className="text-red-700" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Phần hiển thị giải thích hệ thống cố định */}
            {q.explanation && (
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-sm flex items-start space-x-2.5 mb-2">
                <div className="w-7 h-7 bg-white border border-gray-300 rounded-sm flex items-center justify-center shrink-0 text-gray-500">
                  <Info size={14} />
                </div>
                <div className="text-xs">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                    Giải thích hệ thống:
                  </span>
                  <p className="text-gray-700 font-medium italic leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Khối phân tích AI trợ giảng (Chỉ hiện khi trả lời sai) */}
            {(analyzing || aiAnalysis[q.id]) && !isCorrect && !isSkipped && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-300 rounded-sm text-blue-900 flex items-start space-x-2.5">
                {/* Khối biểu tượng trí tuệ nhân tạo */}
                <div className="w-7 h-7 bg-blue-700 rounded-sm flex items-center justify-center shrink-0 text-white">
                  <BrainCircuit size={14} />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-bold uppercase text-[10px] text-blue-700 block mb-1 tracking-wide flex items-center">
                    Phân tích từ AI Tutor:
                    {analyzing && !aiAnalysis[q.id] && (
                      <Loader2 size={10} className="ml-1.5 animate-spin text-blue-700" />
                    )}
                  </span>

                  {/* Hiệu ứng nạp dữ liệu phân tích */}
                  {analyzing && !aiAnalysis[q.id] ? (
                    <div className="flex space-x-1 py-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                  ) : (
                    /* Trình xuất văn bản Markdown của AI */
                    <div className="prose prose-xs prose-blue max-w-none text-gray-800 font-medium leading-relaxed">
                      <ReactMarkdown>{aiAnalysis[q.id]}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuizResultDetail;
