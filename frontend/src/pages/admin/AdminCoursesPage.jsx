import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, PlayCircle, 
  X, Image as ImageIcon, Loader2, Clock, AlertTriangle, HelpCircle 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminCoursesPage = () => {
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
    teacher_id: ''
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/courses`);
      setCourses(response.data.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploading(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/image`,
        uploadFormData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.status === 'success') {
        setFormData({ ...formData, thumbnail: response.data.data.url });
        toast.success('Tải ảnh lên thành công');
      }
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const headers = { Authorization: `Bearer ${token}` };
      if (selectedCourse) {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/courses/${selectedCourse.id}`, formData, { headers });
        toast.success('Cập nhật thành công');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/courses`, formData, { headers });
        toast.success('Tạo thành công');
      }
      setIsModalOpen(false);
      fetchInitialData();
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
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/courses/${selectedCourse.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa');
      setIsDeleteModalOpen(false);
      fetchInitialData();
    } catch (error) {
      toast.error('Lỗi khi xóa');
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
    setFormData({ title: '', description: '', thumbnail: '', level: 'Beginner', duration: 0 });
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <style>{`
        .ql-container { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
        .ql-toolbar { border-top-left-radius: 6px; border-top-right-radius: 6px; background: #f8fafc; border-color: #e2e8f0 !important; }
        .ql-editor { min-height: 120px; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Khóa học</h1>
          <p className="text-slate-500 text-sm">Cấu hình nội dung và bài kiểm tra.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded font-medium hover:bg-blue-800 transition"
        >
          <Plus size={18} />
          <span>Thêm khóa học</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-700" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col hover:border-blue-300 transition">
              <div className="relative h-40">
                <img src={course.thumbnail || 'https://via.placeholder.com/400x200'} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-blue-700 text-white px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {course.level}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-2 text-base line-clamp-1">{course.title}</h3>
                <div className="flex items-center text-slate-500 text-xs mb-3">
                  <Clock size={14} className="mr-1" /> {course.duration}h thời lượng
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex gap-2">
                    <Link to={`/admin/courses/${course.id}/lessons`} className="p-1.5 text-blue-700 hover:bg-blue-50 rounded" title="Bài học"><PlayCircle size={18} />Bài học</Link>
                    <Link to={`/admin/courses/${course.id}/quiz`} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded" title="Quiz"><HelpCircle size={18} />Quiz</Link>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(course)} className="p-1.5 text-slate-400 hover:text-blue-700 rounded"><Edit2 size={18} /></button>
                    <button onClick={() => { setSelectedCourse(course); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 rounded"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedCourse ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tiêu đề</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cấp độ</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded outline-none" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                    <option value="Beginner">Cơ bản</option>
                    <option value="Intermediate">Trung bình</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Thumbnail</label>
                  <input type="file" className="text-xs border border-slate-300 rounded" accept="image/*" onChange={handleFileUpload} />
                  {uploading && <span className="text-[10px] text-blue-700 animate-pulse">Đang tải ảnh...</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mô tả</label>
                <ReactQuill theme="snow" modules={modules} value={formData.description} onChange={(val) => setFormData({...formData, description: val})} />
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white w-full max-w-xs rounded-lg p-6 text-center shadow-2xl">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-slate-500 text-xs mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded text-sm font-medium">Hủy</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-medium">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;