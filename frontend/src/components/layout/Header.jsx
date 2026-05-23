import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LogOut, ChevronDown, Book, LayoutDashboard, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
    navigate('/');
  };

  // Chuẩn hóa role về chữ thường để so sánh chính xác
  const userRole = user?.role?.toLowerCase();

  return (
    <header className="bg-blue-700 text-white w-full border-b border-blue-800 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO: Vuông vức, nền trắng chữ xanh */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="text-blue-700 font-bold text-lg">E</span>
          </div>
          <span className="text-white font-bold text-base tracking-tight uppercase">English Learning</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center space-x-6">

          {/* Menu chính: Chữ trắng in hoa */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white text-xs font-bold uppercase tracking-wider hover:underline">
              Trang chủ
            </Link>
            <Link to="/courses" className="text-white text-xs font-bold uppercase tracking-wider hover:underline">
              Khóa học
            </Link>
          </div>

          {/* Phần Auth */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-1 cursor-pointer"
              >
                {/* Khối Avatar: Ép vuông đồng bộ hệ thống */}
                <div className="w-9 h-9 bg-white flex items-center rounded-sm justify-center text-blue-700 font-bold text-sm border border-blue-800">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:flex flex-col justify-center">
                  <p className="text-xs font-bold text-white leading-none mb-1">{user?.username}</p>
                  <p className="text-[9px] text-blue-200 uppercase font-bold tracking-wider leading-none">{user?.role}</p>
                </div>
                <ChevronDown size={14} className="text-white/80" />
              </button>

              {/* Menu thả xuống: Thiết kế phẳng, vuông vức, viền xám rõ ràng */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 py-1 z-50 rounded-sm shadow-sm">
                  <div className="px-4 py-2.5 border-b border-gray-200 mb-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tài khoản đăng nhập</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{user?.email}</p>
                  </div>

                  {/* 1. Phân quyền hiển thị: QUẢN TRỊ VIÊN */}
                  {userRole === 'admin' && (
                    <Link to="/admin/stats" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                      <LayoutDashboard size={15} className="mr-2.5 text-gray-500" />
                      Trang Quản trị
                    </Link>
                  )}

                  {/* 2. Phân quyền hiển thị: GIẢNG VIÊN (TEACHER) */}
                  {userRole === 'teacher' && (
                    <>
                      <Link to="/teacher/stats" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        <LayoutDashboard size={15} className="mr-2.5 text-gray-500" />
                        Trang giáo viên
                      </Link>
                    </>
                  )}

                  {/* 3. Phân quyền hiển thị: HỌC VIÊN (STUDENT) */}
                  {userRole !== 'admin' && userRole !== 'teacher' && (
                    <>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        <LayoutDashboard size={15} className="mr-2.5 text-gray-500" />
                        Bảng điều khiển
                      </Link>
                      <Link to="/my-courses" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        <Book size={15} className="mr-2.5 text-gray-500" />
                        Khóa học của tôi
                      </Link>
                    </>
                  )}

                  {/* Nút đăng xuất dùng chung */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left border-t border-gray-100 mt-1 cursor-pointer"
                  >
                    <LogOut size={15} className="mr-2.5" />
                    Đăng xuất hệ thống
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-white font-bold text-xs uppercase tracking-wider hover:underline">
                Đăng nhập
              </Link>
              <Link to="/register" className="px-4 py-2 bg-white text-blue-700 font-bold text-xs uppercase tracking-wider border border-white rounded-sm hover:bg-gray-100">
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;