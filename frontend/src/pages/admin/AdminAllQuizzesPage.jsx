import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Loader2, Search, BookOpen, HelpCircle, 
  ChevronRight, Plus 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAllQuizzesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/courses`);
      if (response.data.status === 'success') {
        const coursesData = response.data.data;
        const coursesWithLessons = await Promise.all(coursesData.map(async (course) => {
          const lessonsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin/courses/${course.id}/lessons`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return { ...course, lessons: lessonsRes.data.data };
        }));
        setCourses(coursesWithLessons);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách Quiz');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-700" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header đơn giản */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Quiz</h1>
          <p className="text-slate-600 text-sm">Danh sách bài học và bộ câu hỏi trắc nghiệm.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm khóa học..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:border-blue-700 outline-none transition-colors text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách khóa học */}
      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Course Title Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 bg-blue-700 rounded text-white">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{course.title}</h3>
                <span className="text-xs text-slate-500">{course.lessons?.length || 0} bài học</span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-slate-100">
              {course.lessons?.map((lesson) => (
                <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-400 w-6">
                      {lesson.order_index}.
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{lesson.title}</h4>
                      <div className="flex items-center text-[11px] text-slate-500 mt-0.5">
                        <HelpCircle size={12} className="mr-1" /> Trạng thái Quiz
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/admin/lessons/${lesson.id}/quiz`}
                    className="flex items-center gap-2 text-blue-700 border border-blue-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={16} />
                    Thiết lập
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
              
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="p-8 text-center text-slate-400 text-sm italic">
                  Chưa có dữ liệu bài học
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAllQuizzesPage;