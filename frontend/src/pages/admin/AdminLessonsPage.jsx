import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit, Trash2, 
  X, Loader2, Video, AlertTriangle, BookOpen, FileText 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminLessonsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: '',
    order_index: 1,
    course_id: courseId
  });

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      const courseRes = await axios.get(`${import.meta.env.VITE_API_URL}/courses/${courseId}`);
      if (courseRes.data.status === 'success') setCourse(courseRes.data.data);

      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const lessonsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/courses/${courseId}/lessons`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (lessonsRes.data.status === 'success') {
        // Sắp xếp bài học theo số thứ tự (order_index) tăng dần
        const sortedLessons = lessonsRes.data.data.sort((a, b) => a.order_index - b.order_index);
        setLessons(sortedLessons);
        setFormData(prev => ({ ...prev, order_index: sortedLessons.length + 1 }));
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const headers = { Authorization: `Bearer ${token}` };
      if (selectedLesson) {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/lessons/${selectedLesson.id}`, formData, { headers });
        toast.success('Cập nhật bài học thành công');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/lessons`, formData, { headers });
        toast.success('Thêm bài học thành công!');
      }
      setIsModalOpen(false);
      fetchCourseAndLessons();
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/lessons/${selectedLesson.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa bài học');
      setIsDeleteModalOpen(false);
      fetchCourseAndLessons();
    } catch (error) {
      toast.error('Không thể xóa bài học');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedLesson(null);
    setFormData({ title: '', content: '', video_url: '', order_index: lessons.length + 1, course_id: courseId });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-700" size={32} /></div>;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <style>{`
        .ql-container { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
        .ql-toolbar { border-top-left-radius: 6px; border-top-right-radius: 6px; background: #f8fafc; border-color: #e2e8f0 !important; }
        .ql-editor { min-height: 160px; font-size: 0.875rem; }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <Link to="/admin/courses" className="inline-flex items-center text-slate-500 hover:text-blue-700 transition text-xs font-semibold">
            <ArrowLeft size={14} className="mr-1" />
            Quay lại danh sách khóa học
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý bài học: <span className="text-blue-700">{course?.title}</span>
          </h1>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded font-medium hover:bg-blue-800 transition shrink-0"
        >
          <Plus size={18} />
          <span>Thêm bài học mới</span>
        </button>
      </div>

      {/* Main Content (Danh sách dạng tĩnh - Static List) */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center">
            <p className="text-slate-500 text-sm">Chưa có bài học nào trong khóa học này.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="flex items-center p-4 bg-white border-b border-slate-200 last:border-0 hover:bg-slate-50 transition"
              >
                {/* Số thứ tự cố định */}
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                  {lesson.order_index || index + 1}
                </div>
                
                {/* Thông tin bài học */}
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">{lesson.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    {lesson.video_url ? (
                      <span className="flex items-center text-xs text-blue-700 max-w-[250px] truncate">
                        <Video size={12} className="mr-1 shrink-0" />
                        {lesson.video_url}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-slate-400">
                        <Video size={12} className="mr-1 shrink-0" />
                        Chưa có video
                      </span>
                    )}
                    <span className="flex items-center text-xs text-slate-400">
                      <FileText size={12} className="mr-1 shrink-0" />
                      Văn bản
                    </span>
                  </div>
                </div>
                
                {/* Hành động */}
                <div className="flex items-center space-x-1 shrink-0">
                  <Link to={`/admin/lessons/${lesson.id}/quiz`} className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded transition flex items-center space-x-1" title="Quiz">
                    <BookOpen size={16} />
                    <span className="text-xs font-medium hidden sm:inline">Quiz</span>
                  </Link>
                  <button 
                    onClick={() => { setSelectedLesson(lesson); setFormData({...lesson}); setIsModalOpen(true); }} 
                    className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedLesson(lesson); setIsDeleteModalOpen(true); }} 
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">{selectedLesson ? 'Cập nhật bài học' : 'Thêm bài học mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tiêu đề bài học</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Thứ tự hiển thị</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Video URL (Embed)</label>
                  <input type="url" placeholder="https://www.youtube.com/embed/..." className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-700 outline-none" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} />
                </div>
              </div>
              
              {formData.video_url && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Xem trước Video</label>
                  <div className="aspect-video bg-black rounded border border-slate-200 overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`${formData.video_url}?rel=0&modestbranding=1`} 
                      title="Video preview"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nội dung văn bản</label>
                <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData({...formData, content})} />
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 font-medium transition">Hủy</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium transition disabled:bg-slate-300 flex items-center justify-center">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Xác nhận'}
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
            <AlertTriangle size={36} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1 text-base">Xóa bài học?</h3>
            <p className="text-slate-500 text-xs mb-5 line-clamp-2">Bạn có chắc chắn muốn xóa bài học <span className="font-semibold text-slate-800">{selectedLesson?.title}</span>?</p>
            <div className="flex gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded text-sm font-medium text-slate-600 hover:bg-slate-200">Hủy</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:bg-slate-300 flex items-center justify-center">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessonsPage;