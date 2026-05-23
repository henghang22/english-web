import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { courseApi } from '../api/course.api';
import CourseCard from '../components/features/CourseCard';

const HomePage = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getAll();
        const courses = response?.data?.data || [];
        setPopularCourses(courses.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      
      {/* 1. HERO BANNER - ĐÃ TĂNG CHIỀU CAO KHUNG ẢNH (Từ h-[60vh] lên h-[70vh] / md:h-[75vh]) */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden border-b border-gray-300 bg-gray-900">

        {/* Background image */}
        <img
          src="/homes.jpg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Lớp phủ mờ tối tăng độ tương phản */}
        <div className="absolute inset-0 bg-gray-900/75 z-0" />

        {/* ĐÃ DỊCH CHỮ LÊN TRÊN: 
            Thay đổi đệm đỉnh và đáy (Giảm pt-28 xuống pt-20, pb-16 thành pb-24) để kéo cụm chữ dịch lên phía trên của khung hình 
        */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-4xl text-center mx-auto space-y-4"> 

            {/* ĐÃ LÀM CHỮ TO HƠN: Tăng kích thước từ text-3xl/5xl lên text-4xl/6xl (font-black) */}
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none filter drop-shadow-md">
              English Learning
            </h1>

            <p className="text-sm md:text-lg font-bold text-blue-400 uppercase tracking-wider">
              Take your learning with you!
            </p>

            <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Hệ thống học tiếng Anh trực tuyến tích hợp công cụ AI trợ giảng, hỗ trợ học viên theo dõi 
              tiến độ, làm bài quiz tương tác nâng cao hiệu quả nghiên cứu.
            </p>

            <div className="pt-4">
              <Link
                to="/courses"
                className="inline-block px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm border border-blue-800 transition shadow-md"
              >
                Khám phá khóa học ngay
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* 2. TITLE BAR */}
      <div className="text-center py-10 bg-white border-b border-gray-300">
        <h2 className="text-base md:text-lg font-black text-gray-900 tracking-wide uppercase">
          What would you like to <span className="text-blue-700 normal-case">learn</span> today?
        </h2>
      </div>

      {/* 3. COURSES SECTION */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Đang tải dữ liệu khóa học...</p>
              </div>
            ) : popularCourses.length > 0 ? (
              popularCourses.map((course) => (
                <div key={course.id} className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm hover:border-gray-400 transition">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 border border-dashed border-gray-300 bg-white rounded-sm">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wide">Hiện chưa có dữ liệu khóa học trực tuyến.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-800 text-xs uppercase tracking-wider hover:underline"
            >
              <span>Xem tất cả khóa học hiện có</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;