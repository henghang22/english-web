import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, BookOpen, Calendar, 
  Search, Filter, Loader2, Award, ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminQuizResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/quiz-results`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data.data);
    } catch (error) {
      toast.error('Không thể tải kết quả thi');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(r => 
    r.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.quiz?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-700" size={32} /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kết quả thi</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi điểm số và tiến độ của học viên</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Tìm theo học viên hoặc bài thi..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded text-sm w-full md:w-80 focus:border-blue-700 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng kết quả */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Học viên</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Bài thi / Khóa học</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kết quả</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm số</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày thi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded border border-blue-100 flex items-center justify-center font-bold text-sm">
                        {result.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{result.user?.username}</div>
                        <div className="text-xs text-slate-400">{result.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{result.quiz?.title}</div>
                      <div className="flex items-center text-[10px] font-bold text-blue-700 uppercase mt-1">
                        <BookOpen size={11} className="mr-1" />
                        {result.quiz?.lesson?.title || result.quiz?.course?.title || 'Khóa học tổng hợp'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${result.score >= 5 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {result.score >= 5 ? 'Đạt' : 'Chưa đạt'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {result.correct_answers}/{result.total_questions} câu
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5">
                      <div className={`text-lg font-bold ${result.score >= 8 ? 'text-amber-500' : result.score >= 5 ? 'text-blue-700' : 'text-slate-400'}`}>
                        {result.score}
                      </div>
                      {result.score >= 9 && <Award size={16} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center">
                      <Calendar size={13} className="mr-1.5 text-slate-400" />
                      {new Date(result.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredResults.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Trophy size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Chưa có kết quả nào</h3>
            <p className="text-xs text-slate-400 mt-1">Dữ liệu sẽ xuất hiện khi học viên hoàn thành bài thi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizResultsPage;