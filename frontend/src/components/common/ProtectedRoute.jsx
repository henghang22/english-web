import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    const user = useAuthStore.getState().user;
    // Lấy role của user và chuyển về chữ thường để so sánh chính xác
    const role = user?.role?.toLowerCase();

    // Nếu là admin thì redirect về trang quản trị của admin
    if (role === 'admin') {
      return <Navigate to="/admin" />;
    }

    // Nếu là giáo viên thì redirect về trang quản trị của giáo viên (Sửa lỗi: role is not defined)
    if (role === 'teacher') {
      return <Navigate to="/teacher" />;
    }

    // Mặc định redirect học viên về trang dashboard
    return <Navigate to="/dashboard" />;
  }
  return children;
};