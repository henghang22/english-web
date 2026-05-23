import React, { useState, useEffect } from 'react';
import { 
  BookOpen, PlayCircle, Clock, Search, 
  Loader2, ArrowRight, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/course.api';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await courseApi.getMyCourses();
      setCourses(response?.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải khóa học của tôi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-blue-700" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white font-sans space-y-8">
      
      {/* Tiêu đề & Thanh tìm kiếm dạng phẳng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Khóa học của tôi</h1>
          <p className="text-gray-500 text-xs mt-1">Theo dõi và tiếp tục tiến trình học tập cá nhân.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Tìm trong khoá học của bạn..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-400 rounded-sm w-full md:w-72 focus:border-gray-900 outline-none text-sm text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Hiển thị danh sách khóa học */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white border border-gray-300 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                {/* Khu vực ảnh Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-gray-100 border-b border-gray-200">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-blue-700 text-white text-[9px] font-bold px-1.5 py-0.5 border border-blue-800 rounded-sm uppercase tracking-wider">
                      Đang học
                    </span>
                  </div>
                </div>
                
                {/* Thông tin văn bản */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1 truncate">
                    {course.title}
                  </h3>
                  {/* Sử dụng text thô loại bỏ nguy cơ vỡ layout */}
                  <p className="text-gray-500 text-xs line-clamp-2 h-8 leading-relaxed mb-4">
                    {course.description ? course.description.replace(/<[^>]*>/g, '') : 'Chưa có mô tả ngắn gọn.'}
                  </p>
                </div>
              </div>
              
              {/* Chân thẻ điều hướng */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-500 font-semibold">
                  <BookOpen size={14} className="mr-1" />
                  <span>Tiến độ học</span>
                </div>
                <Link 
                  to={`/courses/${course.id}`}
                  className="flex items-center text-blue-700 font-bold hover:underline"
                >
                  <span>Học tiếp</span>
                  <ArrowRight size={14} className="ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Giao diện trống khi không có khóa học */
        <div className="bg-white p-16 text-center border border-dashed border-gray-300 rounded-sm">
          <div className="w-12 h-12 bg-gray-100 border border-gray-300 text-gray-400 rounded-sm flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-1">Chưa tham gia khóa học nào</h3>
          <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto">Tài khoản này hiện chưa đăng ký bất kỳ chương trình đào tạo nào trên hệ thống.</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wide border border-blue-800 cursor-pointer"
          >
            Khám phá danh mục khóa học
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;