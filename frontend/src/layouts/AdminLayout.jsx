import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
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
    toast.success('Đã thoát khỏi trang quản trị');
    navigate('/');
  };

  const menuItems = [
    { icon: <BarChart3 size={18} />, label: 'Thống kê', path: '/admin/stats' },
    { icon: <Users size={18} />, label: 'Quản lý User', path: '/admin/users' },
    { icon: <BookOpen size={18} />, label: 'Quản lý Khóa học', path: '/admin/courses' },
    { icon: <HelpCircle size={18} />, label: 'Quản lý Quiz', path: '/admin/quizzes' },
    { icon: <Trophy size={18} />, label: 'Kết quả thi', path: '/admin/quiz-results' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar Desktop - Đã đổi sang nền xanh dương nhẹ (bg-blue-50) và border cứng cáp */}
      <aside className="hidden lg:flex w-64 bg-blue-50 border-r border-blue-100 flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 border-b border-blue-100">
          <Link to="/" className="flex items-center space-x-2.5 text-blue-700">
            <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">
              TRANG<span className="text-blue-700"> QUẢN TRỊ VIÊN</span>
            </span>          
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-slate-600 hover:bg-blue-100/70 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-700'}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded text-red-600 hover:bg-red-50 font-semibold transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Thoát Admin</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Backrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      {/* Mobile Sidebar - Đã đổi sang nền xanh dương nhẹ (bg-blue-50) */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-blue-50 border-r border-blue-100 z-[70] flex flex-col transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-blue-700">
            <ShieldCheck size={22} strokeWidth={2.5} />
            <span className="text-base font-bold text-slate-900 uppercase">Admin</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 hover:bg-blue-100 rounded text-slate-500"><X size={18} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded font-semibold text-sm ${
                  isActive ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-blue-100/70'
                }`}
              >
                {item.icon}<span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
          </div>

          {/* User Dropdown Menu */}
          <div className="flex items-center space-x-4 relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2.5 p-1 pr-3 rounded border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.username}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Admin</p>
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded border border-slate-200 shadow-lg py-1 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Tài khoản</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user?.email}</p>
                </div>
                <Link to="/" className="flex items-center px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition">
                  <ShieldCheck size={14} className="mr-2 text-slate-400" />
                  Về trang chủ
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition border-t border-slate-100 mt-1"
                >
                  <LogOut size={14} className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Khung nội dung */}
        <div className="p-6 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;