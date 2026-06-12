import React, { useState, useEffect } from 'react';
import {
  BookOpen, Trophy, Clock, ChevronRight,
  Target, LayoutDashboard,
  ArrowRight, Loader2, Library, MessageSquare, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/courses/dashboard/stats');
      setData(response.data.data);
    } catch (error) {
      console.error('Lỗi tải dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-white">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );

  return (
    <div className="pb-16 bg-white font-sans max-w-6xl mx-auto px-6">

      {/* 1. Welcome Area - Thiết kế phẳng, vuông vức */}
      <div className="py-12 border-b border-gray-200 mb-8">
        <div className="inline-flex items-center text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-4">
          <Library size={16} className="mr-2" />
          Hệ thống hỗ trợ nghiên cứu
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Xin chào, <span className="text-blue-700">{user?.username || 'Học viên'}</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mb-6">
          Hệ thống ghi nhận tiến trình học tập và cung cấp công cụ giải đáp tri thức bền vững dành cho bạn.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/courses" className="bg-blue-700 text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wide hover:bg-blue-800 flex items-center no-underline border border-blue-700 cursor-pointer">
            <span>Vào học ngay</span>
            <ArrowRight size={14} className="ml-1.5" />
          </Link>
          <Link to="/ai-chat" className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wide hover:bg-gray-50 flex items-center no-underline cursor-pointer">
            <MessageSquare size={14} className="mr-1.5 text-blue-700" />
            <span>Trợ giảng AI</span>
          </Link>
        </div>
      </div>

      <div className="space-y-10">
        {/* 2. Stats Grid - Đổi từ shadow phức tạp sang border phẳng xám */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Khóa học tham gia", val: data?.stats?.enrolled_courses, icon: <BookOpen size={20} /> },
            { label: "Điểm trung bình", val: data?.stats?.average_score, icon: <Target size={20} /> },
            { label: "Khóa học đã hoàn thành", val: data?.stats?.completed_courses, icon: <Trophy size={20} /> }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 border border-gray-300 flex items-center space-x-4 rounded-sm">
              <div className="text-gray-400 bg-gray-100 p-3 rounded-sm border border-gray-200">{item.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{item.val || 0}</div>
                <div className="text-gray-500 font-semibold uppercase text-[10px] tracking-wide">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Hoạt động gần đây */}
        <div className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-1.5 text-gray-800">
            <Clock size={18} />
            <span>Hoạt động gần đây</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
            {data?.recent_results?.length > 0 ? (
              data.recent_results.map((result, idx) => (
                <div key={result.id} className={`p-4 flex items-center justify-between text-sm ${idx !== 0 ? 'border-t border-gray-200' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-sm border flex items-center justify-center font-bold text-xs ${result.score >= 5
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                    >
                      {result.score}
                    </span>

                    <div>
                      <div className="font-medium text-gray-700">
                        {result.quiz?.title}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        Đúng {result.correct_answers}/{result.total_questions} câu •{" "}
                        {Math.round(
                          (result.correct_answers / result.total_questions) * 100
                        )}%
                      </div>
                    </div>
                  </div>

                  {/* Right side - ĐẠT / CHƯA ĐẠT */}
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-sm border ${result.score >= 5
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                  >
                    {result.score >= 5 ? 'ĐẠT' : 'CHƯA ĐẠT'}
                  </div>

                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">Chưa có hoạt động nào được ghi nhận.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;