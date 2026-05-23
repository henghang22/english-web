import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../api/course.api';
import { Loader2, ArrowLeft, MessageSquare, List, ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { progressApi } from '../api/progress.api';
import toast from 'react-hot-toast';

const LessonViewPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      setLoading(true);
      try {
        const resLesson = await courseApi.getLesson(id);
        const lessonData = resLesson.data.data;
        setLesson(lessonData);

        // Nạp chi tiết khóa học để hiển thị danh sách bài học ở sidebar
        const resCourse = await courseApi.getDetail(lessonData.course_id);
        setCourse(resCourse.data.data);

        // Nạp tiến độ học tập
        const resProgress = await progressApi.getProgress(lessonData.course_id);
        setProgress(resProgress.data.data || []);

        // Ghi nhận đã truy cập bài học này trên hệ thống
        await progressApi.updateProgress(id, false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bài học:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [id]);

  const handleMarkAsCompleted = async () => {
    setIsMarking(true);
    try {
      await progressApi.updateProgress(id, true);
      toast.success('Đã ghi nhận hoàn thành bài học!');
      
      // Cập nhật lại trạng thái tiến độ cục bộ
      const resProgress = await progressApi.getProgress(course.id);
      setProgress(resProgress.data.data || []);
    } catch (error) {
      toast.error('Không thể cập nhật tiến độ học tập.');
    } finally {
      setIsMarking(false);
    }
  };

  const isCompleted = progress.some(p => p.lesson_id === parseInt(id) && p.is_completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-blue-700" size={32} />
      </div>
    );
  }

  if (!lesson) return <div className="text-center py-20 text-gray-500 text-xs font-bold uppercase">Không tìm thấy dữ liệu bài học</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white font-sans space-y-6">
      
      {/* Thanh điều hướng Breadcrumbs phẳng */}
      <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 pb-4">
        <Link to="/" className="hover:text-blue-700">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to="/courses" className="hover:text-blue-700">Khóa học</Link>
        <ChevronRight size={12} />
        <Link to={`/courses/${course?.id}`} className="hover:text-blue-700 truncate max-w-[180px]">
          {course?.title}
        </Link>
        <ChevronRight size={12} />
        <span className="text-blue-700 truncate max-w-[180px]">{lesson.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
      
        {/* Cột trái: Danh mục bài học (Curriculum Sidebar) */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden sticky top-6">
            <div className="p-4 bg-gray-100 border-b border-gray-300 flex items-center font-bold text-xs text-gray-800 uppercase tracking-tight">
              <List size={16} className="mr-2 text-blue-700" />
              DANH SÁCH BÀI HỌC
            </div>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto bg-gray-50 text-xs">
              {course?.lessons?.map((item, index) => {
                const itemProgress = progress.find(p => p.lesson_id === item.id);
                const itemCompleted = itemProgress?.is_completed;
                const isCurrentLesson = item.id === lesson.id;
                
                return (
                  <Link 
                    key={item.id}
                    to={`/lessons/${item.id}`}
                    className={`flex items-center p-3.5 border-b border-gray-200 transition font-medium ${
                      isCurrentLesson ? 'bg-blue-50 text-blue-800 font-bold border-l-4 border-l-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold mr-3 border shrink-0 ${
                      isCurrentLesson 
                        ? 'bg-blue-700 text-white border-blue-700' 
                        : itemCompleted ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}>
                      {itemCompleted ? <CheckCircle size={12} /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{item.title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột phải: Trình phát video & Nội dung chi tiết */}
        <div className="flex-1 space-y-6">
          
          {/* Khung phát video trực tuyến */}
          <div className="aspect-video bg-black border border-gray-300 rounded-sm overflow-hidden shadow-sm">
            {lesson.video_url ? (
              <iframe 
                key={lesson.id}
                width="100%" 
                height="100%" 
                src={`${lesson.video_url}?rel=0&modestbranding=1`} 
                title={lesson.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 uppercase tracking-wider">
                Hệ thống không tìm thấy liên kết video cho bài học này
              </div>
            )}
          </div>

          {/* Chi tiết nội dung văn bản bài học */}
          <div className="bg-white p-6 border border-gray-300 rounded-sm shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4 uppercase tracking-tight">
              {lesson.title}
            </h1>
            
            <div 
              className="text-gray-700 text-sm leading-relaxed rich-text-content border border-gray-100 p-4 bg-gray-50 rounded-sm mb-6"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />

            {/* Khối xử lý nút Đánh dấu hoàn thành */}
            <div className="flex justify-end border-t border-gray-200 pt-4">
              <button
                onClick={handleMarkAsCompleted}
                disabled={isCompleted || isMarking}
                className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wide border rounded-sm transition cursor-pointer ${
                  isCompleted 
                    ? 'bg-green-50 text-green-700 border-green-300 cursor-default' 
                    : 'bg-blue-700 text-white border-blue-800 hover:bg-blue-800'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Đã hoàn thành bài học</span>
                  </>
                ) : (
                  <>
                    {isMarking ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    <span>Đánh dấu hoàn thành</span>
                  </>
                )}
              </button>
            </div>

            {/* Khối bài kiểm tra nhanh (Quiz ngắn) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-sm gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-sm flex items-center justify-center shrink-0">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-tight">Củng cố kiến thức</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Hoàn thành bài tập trắc nghiệm ngắn để ghi nhớ lý thuyết đã học.</p>
                  </div>
                </div>
                <Link 
                  to={`/lessons/${lesson.id}/quiz`}
                  className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 text-xs font-bold uppercase tracking-wide border border-gray-400 rounded-sm text-center shrink-0"
                >
                  Làm bài trắc nghiệm
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LessonViewPage;