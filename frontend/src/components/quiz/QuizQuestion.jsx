import React from 'react';

const QuizQuestion = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  answers,
  submitted,
  onSelectAnswer,
  onPrev,
  onNext,
}) => {

  return (
    <>
      {/* Khung hiển thị câu hỏi dạng phẳng */}
      <div className="bg-white border border-gray-300 flex flex-col mb-4 rounded-sm overflow-hidden font-sans">
        
        {/* Thanh tiêu đề câu hỏi */}
        <div className="bg-gray-100 px-5 py-3 border-b border-gray-300 flex items-center justify-between text-xs font-bold uppercase tracking-wide">
          <span className="bg-blue-700 text-white px-2 py-0.5 border border-blue-800 rounded-sm">
            Câu hỏi {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="text-gray-600">Bài kiểm tra đánh giá</span>
        </div>

        {/* Nội dung câu hỏi và các phương án trả lời */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 leading-relaxed">
              {currentQuestion?.question_text}
            </h2>
          </div>

          {/* Danh sách các phương án lựa chọn dạng lưới phẳng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {currentQuestion?.answers?.map((answer) => {
              const isSelected = answers[currentQuestion.id] === answer.id;
              const isDisabled = submitted;

              return (
                <button
                  key={answer.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectAnswer(currentQuestion.id, answer.id)}
                  className={`w-full p-3 text-left border rounded-sm flex items-center text-xs font-medium transition ${
                    isSelected 
                      ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="truncate">{answer.answer_text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thanh điều hướng câu hỏi phẳng và thực dụng */}
      <div className="flex items-center justify-between px-1 font-sans">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={onPrev}
          className={`text-xs font-bold uppercase tracking-wide border px-3 py-1.5 rounded-sm transition ${
            currentIndex === 0
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'
          }`}
        >
          &larr; Câu trước
        </button>

        <button
          type="button"
          disabled={currentIndex === totalQuestions - 1}
          onClick={onNext}
          className={`text-xs font-bold uppercase tracking-wide border px-3 py-1.5 rounded-sm transition ${
            currentIndex === totalQuestions - 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'
          }`}
        >
          Câu tiếp theo &rarr;
        </button>
      </div>
    </>
  );
};

export default QuizQuestion;