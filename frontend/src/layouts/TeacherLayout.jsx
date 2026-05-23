import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { 
  BarChart3, 
  BookOpen, 
  LogOut, 
  GraduationCap,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherLayout = () => {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    toast.success('Đã thoát khỏi trang giáo viên');
    navigate('/');
  };

  const menuItems = [
    { icon: <BarChart3 size={18} />, label: 'Thống kê', path: '/teacher/stats' },
    { icon: <BookOpen size={18} />, label: 'Khóa học của tôi', path: '/teacher/courses' },
    { icon: <HelpCircle size={18} />, label: 'Ngân hàng Quiz', path: '/teacher/quizzes' },
    { icon: <Trophy size={18} />, label: 'Kết quả học sinh', path: '/teacher/quiz-results' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="flex items-center space-x-2.5 text-blue-700">
          <GraduationCap size={28} strokeWidth={2.5} />
          <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">Trang giáo viên</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded border transition text-sm font-semibold group ${
                isActive 
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm' 
                  : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-blue-700 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-3 rounded border border-transparent text-red-600 hover:bg-red-50 hover:border-red-100 text-sm font-bold transition-colors group"
        >
          <LogOut size={18} />
          <span>Thoát trang Giáo viên</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-[70] flex flex-col transition-transform duration-200 border-r border-slate-200 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 right-[-44px] w-9 h-9 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-700 shadow-sm"
        >
          <X size={18} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded transition"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base font-bold text-slate-800 truncate">Khu vực Giáo viên</h2>
          </div>

          <div className="flex items-center space-x-4 relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 p-1 pl-3 rounded border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.username}</p>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-1">Giáo viên</p>
              </div>
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded border border-slate-200 shadow-md py-1 z-50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Tài khoản</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                </div>
                <Link to="/" className="flex items-center px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition">
                  <GraduationCap size={15} className="mr-2.5 text-slate-400" />
                  Về trang chủ
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition border-t border-slate-100 mt-1"
                >
                  <LogOut size={15} className="mr-2.5 text-red-400" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;