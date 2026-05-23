import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../api/course.api';
import { 
  Loader2, PlayCircle, Clock, BookOpen, ChevronRight, 
  BarChart, Award, ShieldCheck, User, CheckCircle 
} from 'lucide-react';
import { progressApi } from '../api/progress.api';
import toast from 'react-hot-toast';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await courseApi.getDetail(id);
        setCourse(response.data.data);

        // Nạp tiến độ và thông tin học tiếp nếu người dùng đã đăng nhập
        if (localStorage.getItem('auth-storage')) {
          const [resProgress, resResume] = await Promise.all([
            progressApi.getProgress(id),
            progressApi.getResumeInfo(id)
          ]);
          setProgress(resProgress.data.data || []);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết khóa học:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const isCourseCompleted = course?.lessons?.length > 0 && 
    progress.filter(p => p.is_completed).length === course.lessons.length;

  const getLevelLabel = (level) => {
    switch (level) {
      case 'Advanced': return 'Nâng cao';
      case 'Intermediate': return 'Trung bình';
      default: return 'Cơ bản';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-blue-700" size={32} />
    </div>
  );
  
  if (!course) return (
    <div className="text-center py-20 font-bold text-gray-900 text-sm uppercase">
      Không tìm thấy dữ liệu khóa học trên hệ thống
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Cột trái - Sidebar Thông tin & Lộ trình */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gray-300 p-6 rounded-sm">
            {/* Ảnh đại diện khóa học */}
            <div className="aspect-video overflow-hidden mb-6 border border-gray-300 rounded-sm bg-gray-50">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>
            
            {/* Danh sách bài học */}
            <div className="mb-6 h-full">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between uppercase tracking-tight border-b border-gray-200 pb-2">
                <span>Lộ trình bài học</span>
                <span className="text-gray-500 text-xs font-semibold">({course.lessons?.length || 0})</span>
              </h2>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 border border-gray-200 p-2 bg-gray-50 rounded-sm">
                {course.lessons?.map((lesson, index) => {
                  const lessonCompleted = progress.some(p => p.lesson_id === lesson.id && p.is_completed);
                  return (
                    <Link 
                      key={lesson.id}
                      to={`/lessons/${lesson.id}`}
                      className={`flex items-center p-3 rounded-sm border text-xs font-medium ${
                        lessonCompleted 
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : 'bg-white border-gray-300 text-gray-800 hover:border-gray-900'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-bold mr-3 shrink-0 border ${
                        lessonCompleted ? 'bg-green-700 text-white border-green-700' : 'bg-gray-100 text-gray-500 border-gray-300'
                      }`}>
                        {lessonCompleted ? <CheckCircle size={12} /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate font-semibold">{lesson.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>


            {/* Nút thao tác chính */}
            {isCourseCompleted ? (
              <div className="w-full bg-green-50 text-green-700 font-bold py-3 rounded-sm text-sm flex items-center justify-center space-x-2 border border-green-300">
                <CheckCircle size={18} />
                <span>Bạn đã hoàn thành khóa học!</span>
              </div>
            ) : course.lessons && course.lessons.length > 0 ? (
              <Link 
                to={`/lessons/${course.lessons[0].id}`}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-sm text-xs uppercase tracking-wide flex items-center justify-center space-x-1.5 border border-blue-800 cursor-pointer"
              >
                <span>{progress.length > 0 ? 'Tiếp tục tiến trình học' : 'Bắt đầu học ngay'}</span>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-sm text-xs uppercase border border-gray-300 cursor-not-allowed">
                Chưa có bài học nào
              </button>
            )}
          </div>
        </div>

        {/* Cột phải - Nội dung chi tiết khóa học */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 border border-gray-300 rounded-sm text-[10px] font-bold uppercase tracking-wide">
                Trình độ: {getLevelLabel(course.level)}
              </span>
              <span className="flex items-center text-gray-500 text-[11px] font-semibold uppercase tracking-wide">
                <Clock size={14} className="mr-1" />
                Thời lượng: {course.duration} giờ học
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 uppercase border-b border-gray-200 pb-3">
              {course.title}
            </h1>
            
            {/* Mô tả khóa học */}
            <div 
              className="text-sm text-gray-700 mb-8 leading-relaxed border border-gray-200 p-4 bg-gray-50 rounded-sm rich-text-content"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />

            {/* Giảng viên phụ trách */}
            <div className="flex items-center p-4 bg-white border border-gray-300 rounded-sm">
              <div className="w-12 h-12 bg-gray-100 border border-gray-300 text-blue-700 flex items-center justify-center font-bold text-base rounded-sm mr-4 shrink-0">
                {course.creator?.username?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Cán bộ phụ trách hướng dẫn</p>
                <p className="text-base font-bold text-gray-900">{course.creator?.username || 'Chuyên gia LMS'}</p>
              </div>
            </div>
          </div>

          {/* Phần Khảo sát / Thi cuối khóa */}
          <div className="border border-gray-300 bg-white rounded-sm">
            <div className="p-4 bg-gray-100 border-b border-gray-300 flex items-center gap-2">
              <Award size={18} className="text-blue-700" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Đánh giá &amp; Kiểm tra kết quả</h3>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={24} className="text-blue-700 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Bài kiểm tra tổng hợp cuối khóa</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Yêu cầu hoàn thành bài thi trắc nghiệm tổng hợp để hệ thống ghi nhận kết quả cấp chứng chỉ.</p>
                </div>
              </div>
              <Link 
                to={`/courses/${course.id}/quiz`}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wide rounded-sm border border-blue-800 shrink-0 cursor-pointer"
              >
                Bắt đầu kiểm tra
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailPage;