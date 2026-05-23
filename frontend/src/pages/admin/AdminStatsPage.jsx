import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, FileText, BarChart3, 
  TrendingUp, Award, Calendar, ChevronRight,
  ArrowUpRight, Loader2, GraduationCap, HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, LabelList 
} from 'recharts';

const AdminStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
  } finally {
    setLoading(false);
  }
    
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-blue-700" size={32} />
    </div>
  );

  const { overview, popularCourses, recentActivities } = stats;

  const statCards = [
    { title: 'Tổng học viên', value: overview.totalStudents, icon: Users, color: '#1d4ed8', bgColor: '#f0f3ff', link: '/admin/users' },
    { title: 'Giáo viên', value: overview.totalTeachers || 0, icon: GraduationCap, color: '#1d4ed8', bgColor: '#f0f3ff', link: '/admin/users' },
    { title: 'Khóa học', value: overview.totalCourses, icon: BookOpen, color: '#1d4ed8', bgColor: '#f0f3ff', link: '/admin/courses' },
    { title: 'Tổng câu hỏi', value: overview.totalQuestions || 0, icon: HelpCircle, color: '#1d4ed8', bgColor: '#f0f3ff', link: '/admin/quizzes' },
    { title: 'Bài thi xong', value: overview.totalResults, icon: FileText, color: '#1d4ed8', bgColor: '#f0f3ff', link: '/admin/quiz-results' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900---">Hệ thống quản trị</h1>
          <p className="text-sm text-slate-500 mt-1">Cập nhật dữ liệu thời gian thực của toàn bộ nền tảng</p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded border border-slate-200 shadow-sm flex items-center self-start md:self-auto">
          <Award size={18} className="text-amber-500 mr-2.5" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điểm trung bình</div>
            <div className="text-base font-bold text-slate-900 mt-0.5 leading-none">{overview.averageScore}</div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <Link 
            key={idx} 
            to={card.link}
            className="bg-white p-5 rounded border border-slate-200 shadow-sm hover:border-blue-700 transition relative flex flex-col items-center text-center group"
          >
            <div 
              className="p-3 rounded mb-3 text-blue-700 bg-blue-50 border border-blue-100"
            >
              <card.icon size={20} />
            </div>
            
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-0.5">{card.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</div>
            </div>

            <div className="absolute top-3 right-3 text-slate-300 group-hover:text-blue-700 transition-colors">
              <ArrowUpRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      <div className="lg:col-span-4 bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <TrendingUp size={18} className="mr-2 text-blue-700" /> Hoạt động mới
            </h3>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {recentActivities.map((activity, idx) => (
              <Link 
                key={idx} 
                to={`/quiz-results/${activity.id}`}
                className="flex items-start p-2.5 -mx-1 rounded border border-transparent hover:border-slate-200 hover:bg-slate-50 transition group"
              >
                <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center mr-3 shrink-0 font-bold text-xs text-slate-500">
                  {activity.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{activity.user.username}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    Bài: {activity.quiz.title}
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <div className={`text-xs font-bold ${activity.score >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.score} đ
                  </div>
                  <div className="text-[9px] font-medium text-slate-400 mt-0.5">
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/admin/quiz-results" className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition flex items-center justify-center">
            Xem tất cả <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
    </div>
  );
};

export default AdminStatsPage;