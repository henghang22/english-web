import React from 'react';
import { AlertCircle } from 'lucide-react';

const QuizConfirmModal = ({ config, onClose }) => {
  return (
    // Lớp phủ toàn màn hình cố định
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Nền tối phẳng — click ra ngoài vùng trung tâm để đóng hộp thoại */}
      <div
        className="absolute inset-0 bg-gray-900/60"
        onClick={onClose}
      />

      {/* Khung nội dung chính của Hộp thoại */}
      <div className="bg-white w-full max-w-sm border border-gray-400 rounded-sm shadow-md relative z-10 overflow-hidden font-sans">
        <div className="p-6 text-center">
          {/* Biểu tượng cảnh báo dạng hình khối phẳng */}
          <div className="w-12 h-12 bg-gray-100 text-gray-700 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>

          {/* Tiêu đề thông báo hệ thống */}
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight mb-2">
            {config.title}
          </h3>

          {/* Nội dung chi tiết hành động */}
          <p className="text-gray-600 text-xs leading-relaxed mb-6">
            {config.message}
          </p>

          {/* Cặp nút thao tác chuẩn hệ thống quản lý */}
          <div className="flex gap-3 text-xs">
            {/* Nút Hủy bỏ lệnh */}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold border border-gray-300 rounded-sm transition cursor-pointer"
            >
              Quay lại
            </button>

            {/* Nút Xác nhận thực thi hành động */}
            <button
              onClick={config.onConfirm}
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold border border-blue-800 rounded-sm transition cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfirmModal;