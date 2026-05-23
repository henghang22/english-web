import React, { useState, useEffect } from 'react';
import { 
  BarChart3, BookOpen, HelpCircle, Trophy, 
  Users, TrendingUp, Award, Calendar, Loader2,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/auth.store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const TeacherStatsPage = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/teacher/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tổng hợp dữ liệu của bạn...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Khóa học', 
      value: stats?.totalCourses || 0, 
      icon: <BookOpen size={20} />, 
      color: 'bg-blue-50 border-blue-200 text-blue-600', 
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Bài học', 
      value: stats?.totalLessons || 0, 
      icon: <Calendar size={20} />, 
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600', 
      trend: '+8%',
      trendUp: true
    },
    { 
      label: 'Bộ Quiz', 
      value: stats?.totalQuizzes || 0, 
      icon: <HelpCircle size={20} />, 
      color: 'bg-orange-50 border-orange-200 text-orange-600', 
      trend: '+5%',
      trendUp: true
    },
    { 
      label: 'Lượt làm bài', 
      value: stats?.totalAttempts || 0, 
      icon: <Users size={20} />, 
      color: 'bg-red-50 border-red-200 text-red-600', 
      trend: '+24%',
      trendUp: true
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Thống kê tổng quan</h1>
          <p className="text-gray-500 text-sm mt-1">Chào mừng trở lại! Đây là kết quả giảng dạy của bạn.</p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md flex items-center justify-center font-bold text-base">
            {stats?.averageScore}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Điểm trung bình</p>
            <p className="text-xs font-bold text-gray-700">Hiệu suất học viên</p>
          </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className={`w-10 h-10 rounded-md flex items-center justify-center border mb-4 ${card.color}`}>
              {card.icon}
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{card.value}</h3>
                <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded border ${card.trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {card.trendUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                  {card.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherStatsPage;