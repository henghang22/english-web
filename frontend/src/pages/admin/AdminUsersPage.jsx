import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Trash2, 
  Edit, UserPlus, Shield, X, Loader2, AlertTriangle 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 'success') {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.username.length < 3) newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email không hợp lệ';
    if (!selectedUser && formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const headers = { Authorization: `Bearer ${token}` };
      
      if (selectedUser) {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser.id}`, formData, { headers });
        toast.success('Cập nhật người dùng thành công');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/users`, formData, { headers });
        toast.success('Thêm người dùng thành công');
      }
      
      setIsModalOpen(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      const serverMsg = error.response?.data?.message || 'Thao tác thất bại';
      toast.error(serverMsg);
      if (serverMsg.includes('username')) setErrors({ ...errors, username: 'Tên người dùng đã tồn tại hoặc không hợp lệ' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa người dùng');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể xóa người dùng');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ username: '', email: '', password: '', role: 'student' });
    setErrors({});
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý User</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý quyền hạn và thông tin tất cả người dùng ({users.length}).</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2.5 rounded text-sm font-semibold hover:bg-blue-800 transition shadow-sm"
        >
          <UserPlus size={16} />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <Loader2 className="animate-spin mx-auto text-blue-700" size={32} />
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{user.username}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                      user.role === 'teacher' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                    {new Date(user.createdAt || user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-slate-400 hover:text-blue-700 border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded transition">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => openDeleteModal(user)} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded border border-slate-200 shadow-xl relative z-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">{selectedUser ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded transition">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tên người dùng</label>
                <input 
                  type="text"
                  className={`w-full px-3 py-2 bg-white border rounded text-sm outline-none transition ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-700'}`}
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  type="email"
                  className={`w-full px-3 py-2 bg-white border rounded text-sm outline-none transition ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-700'}`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mật khẩu {selectedUser && '(Để trống nếu không đổi)'}</label>
                <input 
                  type="password"
                  className={`w-full px-3 py-2 bg-white border rounded text-sm outline-none transition ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-700'}`}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Vai trò</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-blue-700 transition"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded text-sm font-semibold hover:bg-slate-50 transition">Hủy</button>
                <button type="submit" disabled={submitting} className="flex-[2] px-4 py-2 bg-blue-700 text-white rounded text-sm font-semibold hover:bg-blue-800 transition flex items-center justify-center">
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <span>Xác nhận</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white w-full max-w-sm rounded border border-slate-200 shadow-xl relative z-10 p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 border border-red-100 rounded flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Xác nhận xóa người dùng?</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Hành động này không thể hoàn tác. Bạn có chắc muốn xóa tài khoản <span className="font-bold text-slate-900">{selectedUser?.username}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 border border-slate-300 bg-white text-slate-700 rounded text-sm font-semibold hover:bg-slate-50 transition">Hủy</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition">
                {submitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Xóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;