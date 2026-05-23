import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }

    setLoading(true);
    setError('');

    try {
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      toast.success('Đăng ký tài khoản thành công! 🎉');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    /* Sử dụng bg-gray-50 để làm nổi bật khung đăng ký trắng */
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      {/* Khung chứa: Bo góc nhẹ (rounded-sm), bỏ shadow cầu kỳ, dùng border phẳng */}
      <div className="max-w-md w-full bg-white border border-gray-300 p-8 rounded-sm">
        
        <div className="text-center mb-6">
          {/* Icon vuông vức với màu Blue 700 chủ đạo */}
          <div className="w-12 h-12 bg-gray-100 text-blue-700 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-3">
            <UserPlus size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Đăng ký tài khoản</h2>
          <p className="text-gray-500 mt-1 text-xs">Vui lòng điền đầy đủ thông tin bên dưới</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2.5 border border-red-300 mb-4 text-xs font-semibold rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Tên đăng nhập */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Tên đăng nhập</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </span>
              <input 
                name="username"
                type="text" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="john_doe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input 
                name="password"
                type="password" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Xác nhận mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input 
                name="confirmPassword"
                type="password" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-400 rounded-sm focus:border-gray-900 outline-none text-sm text-gray-800"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Nút Đăng ký: Phẳng, không shadow, không hover zoom */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-sm flex items-center justify-center space-x-2 border border-blue-800 text-sm cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <span className="uppercase tracking-wide">Đăng ký tài khoản</span>
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-700 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;