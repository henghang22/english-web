import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data.data;
      setAuth(user, token);
      toast.success(`Chào mừng ${user.username}!`);

      console.log('DEBUG: User object sau khi login:', user);
      console.log('DEBUG: User role:', user.role);

      const role = user.role?.toLowerCase().trim();

      if (role === 'admin') {
        navigate('/admin');
      }
      else if (role === 'teacher') {
        navigate('/teacher');
      }
      else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Nền xám nhạt đồng bộ với trang Register */
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      {/* Khung chứa: Bỏ shadow cầu kỳ, dùng border phẳng xám, bo góc nhỏ */}
      <div className="max-w-md w-full bg-white border border-gray-300 p-8 rounded-sm">

        <div className="text-center mb-6">
          {/* Icon vuông vức màu Blue 700 với viền cơ bản */}
          <div className="w-12 h-12 bg-gray-100 text-blue-700 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-3">
            <LogIn size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Đăng nhập hệ thống</h2>
          <p className="text-gray-500 mt-1 text-xs">Vui lòng nhập tài khoản và mật khẩu để tiếp tục</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2.5 border border-red-300 mb-4 text-xs font-semibold rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email của bạn</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Nút Đăng nhập: Phẳng, Blue 700, không hiệu ứng chuyển động mượt, rê chuột đổi màu trực tiếp */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-sm flex items-center justify-center space-x-2 border border-blue-800 text-sm cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span className="uppercase tracking-wide">Đăng nhập hệ thống</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-700 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;