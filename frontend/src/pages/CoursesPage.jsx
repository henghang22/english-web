import React, { useEffect, useState } from 'react';
import { courseApi } from '../api/course.api';
import CourseCard from '../components/features/CourseCard';
import { Loader2, Search } from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAll();
      setCourses(response?.data?.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc khóa học theo từ khóa tìm kiếm (Không phân biệt chữ hoa/thường)
  const filteredCourses = courses.filter(course =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white font-sans">
      
      {/* Header Section: Thiết kế phẳng, vuông vức */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Danh sách khóa học trực tuyến</h1>
          <p className="text-gray-500 text-xs mt-1">Học viên lựa chọn các khóa học để bắt đầu quá trình nghiên cứu.</p>
        </div>
        
        {/* Thanh tìm kiếm: Ép phẳng, viền xám thô, bo góc nhỏ */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Nhập tên khóa học cần tìm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
          />
        </div>
      </div>

      {/* Course Grid hoặc Trạng thái Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-700" size={32} />
        </div>
      ) : (
        <>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            /* Trạng thái không tìm thấy kết quả hoặc mảng rỗng */
            <div className="text-center py-16 bg-white rounded-sm border border-dashed border-gray-300">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">
                {courses.length === 0 ? "Chưa có khóa học nào được đăng tải trên hệ thống." : "Không tìm thấy khóa học phù hợp với từ khóa."}
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default CoursesPage;