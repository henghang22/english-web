import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, ExternalLink, PlayCircle,
  X, Image as ImageIcon, Loader2, Clock, BarChart, User, AlertTriangle, HelpCircle, GraduationCap, BookOpen,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuthStore } from '../../store/auth.store';

const TeacherCoursesPage = () => {
  const { user, token } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    level: 'Beginner',
    duration: 0,
    teacher_id: user?.id || ''
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/teacher/courses`, { headers });
      setCourses(response.data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra kích thước file (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return toast.error('File quá lớn! Vui lòng chọn ảnh dưới 50MB.');
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/image`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data.status === 'success') {
        setFormData(prev => ({ ...prev, thumbnail: response.data.data.url }));
        toast.success('Tải ảnh lên thành công! ✨');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Lỗi khi tải ảnh lên';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...formData, teacher_id: user.id };

      if (selectedCourse) {
        await axios.put(`${import.meta.env.VITE_API_URL}/teacher/courses/${selectedCourse.id}`, payload, { headers });
        toast.success('Cập nhật khóa học thành công');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/teacher/courses`, payload, { headers });
        toast.success('Tạo khóa học thành công');
      }
      setIsModalOpen(false);
      fetchCourses();
      resetForm();
    } catch (error) {
      toast.error('Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${import.meta.env.VITE_API_URL}/teacher/courses/${selectedCourse.id}`, {
        headers
      });
      toast.success('Đã xóa khóa học');
      setIsDeleteModalOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error('Lỗi khi xóa khóa học');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      level: course.level || 'Beginner',
      duration: course.duration || 0,
      teacher_id: course.teacher_id
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      level: 'Beginner',
      duration: 0,
      teacher_id: user?.id || ''
    });
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <style>{`
      .ql-container { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
      .ql-toolbar { border-top-left-radius: 4px; border-top-right-radius: 4px; background: #f8fafc; border-color: #e2e8f0 !important; }
      .ql-editor { min-height: 150px; }
    `}</style>

      {/* Header: Đưa về style gọn nhẹ, text-2xl, border-b mỏng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Khóa học</h1>
          <p className="text-slate-500 text-sm mt-1">Cấu hình nội dung và bài giảng giảng dạy.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded font-medium hover:bg-blue-800 transition shadow-sm"
        >
          <Plus size={18} />
          <span>Thêm khóa học</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-700" size={32} /></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 border border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-slate-500">Chưa có khóa học nào được tạo.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-700 font-bold mt-2 hover:underline">Tạo ngay</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition duration-200">
              <div className="relative h-44 bg-slate-100">
                <img src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-blue-700 text-white px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {course.level}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-2 text-base line-clamp-1">{course.title}</h3>
                <div className="flex items-center text-slate-500 text-xs mb-4">
                  <Clock size={14} className="mr-1" /> {course.duration}h thời lượng
                </div>

                {/* Giữ lại phần hiển thị HTML mô tả một cách tối giản */}
                <div className="text-slate-500 text-xs line-clamp-2 mb-4 italic" dangerouslySetInnerHTML={{ __html: course.description }}></div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex gap-2">
                    <Link to={`/teacher/courses/${course.id}/lessons`} className="flex items-center gap-1.5 px-2.5 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-bold transition" title="Bài học">
                      <PlayCircle size={16} /> Bài học
                    </Link>
                    <Link to={`/teacher/courses/${course.id}/quiz`} className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold transition" title="Quiz">
                      <HelpCircle size={16} /> Quiz
                    </Link>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(course)} className="p-1.5 text-slate-400 hover:text-blue-700 transition"><Edit2 size={18} /></button>
                    <button onClick={() => { setSelectedCourse(course); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal: Tối giản với góc bo nhỏ (rounded-lg) và border chuẩn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">{selectedCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded transition"><X size={20} className="text-slate-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tiêu đề</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cấp độ</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-700" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                    <option value="Beginner">Cơ bản</option>
                    <option value="Intermediate">Trung bình</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Thời lượng (h)</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Thumbnail</label>
                <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" accept="image/*" onChange={handleFileUpload} />
                {uploading && <p className="text-[10px] text-blue-700 mt-1 animate-pulse">Đang tải ảnh lên...</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mô tả</label>
                <ReactQuill theme="snow" modules={modules} value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 font-medium transition">Hủy</button>
                <button type="submit" disabled={submitting || uploading} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium transition disabled:bg-slate-300">
                  {submitting ? 'Đang lưu...' : 'Lưu khóa học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal: Giữ tối giản diện tích nhỏ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-lg p-6 text-center shadow-2xl border border-slate-200">
            <AlertTriangle size={36} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-1">Xác nhận xóa?</h3>
            <p className="text-slate-500 text-xs mb-6">Dữ liệu khóa học sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded text-sm font-medium hover:bg-slate-200 transition">Hủy</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;
