import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, Edit2, ExternalLink,
  Clock, BookOpen, Loader2, Layout
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/auth.store';

const TeacherQuizzesPage = () => {
  const { token } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/teacher/quizzes`, { headers });
      setQuizzes(response.data.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách Quiz');
    } finally {
      setLoading(false);
    }
  };

  // Tối ưu hóa hiệu năng lọc bằng useMemo để tránh tính toán lại không cần thiết khi re-render
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q =>
      q?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Layout className="text-blue-600" size={28} />
          <span>Quản lý Quiz tập trung</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Xem và quản lý tất cả các bộ đề trắc nghiệm của bạn.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-gray-300 flex items-center space-x-3 max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm Quiz theo tiêu đề..."
          className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        <>
          {filteredQuizzes.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
              <HelpCircle size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">Không tìm thấy bộ Quiz nào</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              // Phòng hờ trường hợp dữ liệu quan hệ bị null từ backend
              const isCourseQuiz = !!quiz.course_id;
              const courseTitle = quiz.course?.title || "N/A";
              const lessonTitle = quiz.lesson?.title || "N/A";
              const parentCourseId = quiz.course_id || quiz.lesson?.course_id || "";

              return (
                <div className="space-y-4" key={quiz.id}>
                  <>
                    {filteredQuizzes.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
                        <HelpCircle size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">
                          Không tìm thấy bộ Quiz nào
                        </p>
                      </div>
                    ) : (
                      filteredQuizzes.map((quiz) => {
                        const isCourseQuiz = !!quiz.course_id;
                        const courseTitle = quiz.course?.title || "N/A";
                        const lessonTitle = quiz.lesson?.title || "N/A";
                        const parentCourseId = quiz.course_id || quiz.lesson?.course_id || "";

                        return (
                          <div
                            key={quiz.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${isCourseQuiz
                                  ? 'bg-orange-50 text-orange-600 border-orange-200'
                                  : 'bg-blue-50 text-blue-600 border-blue-200'
                                }`}>
                                {isCourseQuiz ? <Layout size={22} /> : <BookOpen size={22} />}
                              </div>

                              <div>
                                {/* TITLE + CLOCK INLINE */}
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-base font-bold text-gray-800">
                                    {quiz.title}
                                  </h3>

                                  <span className="text-xs text-gray-400 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {quiz.time_limit || 0} phút
                                  </span>
                                </div>

                                {/* COURSE / LESSON TEXT */}
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {isCourseQuiz ? `Khóa học: ${courseTitle}` : `Bài học: ${lessonTitle}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">

                              <Link
                                to={isCourseQuiz
                                  ? `/teacher/courses/${quiz.course_id}/quiz`
                                  : `/teacher/lessons/${quiz.lesson_id}/quiz`
                                }
                                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
                              >
                                <Edit2 size={16} />
                                <span>Chỉnh sửa</span>
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                </div>
              );
            })
          )}
        </>
      </div>
    </div>
  );
};

export default TeacherQuizzesPage;