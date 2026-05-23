import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Video,
  AlertTriangle,
  BookOpen,
  FileText,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuthStore } from '../../store/auth.store';

const TeacherLessonsPage = () => {
  const { courseId } = useParams();
  const { token } = useAuthStore();
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

      const headers = { Authorization: `Bearer ${token}` };
      const lessonsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/teacher/courses/${courseId}/lessons`,
        { headers }
      );
      if (lessonsRes.data.status === 'success') {
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
      const headers = { Authorization: `Bearer ${token}` };
      if (selectedLesson) {
        await axios.put(`${import.meta.env.VITE_API_URL}/teacher/lessons/${selectedLesson.id}`, formData, { headers });
        toast.success('Cập nhật bài học thành công');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/teacher/lessons`, formData, { headers });
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
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${import.meta.env.VITE_API_URL}/teacher/lessons/${selectedLesson.id}`, {
        headers
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-blue-700" size={36} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <style>{`
        .ql-container { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
        .ql-toolbar { border-top-left-radius: 4px; border-top-right-radius: 4px; background: #f8fafc; border-color: #cbd5e1 !important; }
        .ql-editor { min-height: 180px; font-size: 0.875rem; }
      `}</style>
      
      {/* Top Header Navigation */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link to="/teacher/courses" className="flex items-center text-slate-500 hover:text-blue-700 transition text-xs font-semibold">
            <ArrowLeft size={14} className="mr-1.5" />
            Quay lại danh sách khóa học
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Bài học: <span className="text-blue-700">{course?.title}</span>
          </h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center space-x-1.5 bg-blue-700 text-white px-4 py-2.5 rounded text-sm font-semibold hover:bg-blue-800 transition shadow-sm"
          >
            <Plus size={16} />
            <span>Thêm bài học mới</span>
          </button>
        </div>
      </div>

      {/* Items Area */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded p-16 text-center shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Chưa có bài học nào trong khóa này</h3>
            <p className="text-xs text-slate-500 mt-1">Vui lòng nhấp vào nút "Thêm bài học mới" phía trên để bắt đầu xây dựng nội dung.</p>
          </div>
        ) : (
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col divide-y divide-slate-200">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center p-5 bg-white hover:bg-slate-50 transition group">
                  <div className="w-9 h-9 bg-slate-100 border border-slate-200 text-slate-700 rounded flex items-center justify-center font-bold text-xs mr-5 flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{lesson.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      {lesson.video_url ? (
                        <span className="flex items-center text-xs text-blue-700 font-medium max-w-[250px] truncate">
                          <Video size={12} className="mr-1 flex-shrink-0" />
                          {lesson.video_url}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-slate-400">
                          <Video size={12} className="mr-1 flex-shrink-0" />
                          Chưa có video
                        </span>
                      )}
                      <span className="flex items-center text-xs text-slate-400">
                        <FileText size={12} className="mr-1 flex-shrink-0" />
                        Nội dung bài viết
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-4">
                    <Link to={`/teacher/lessons/${lesson.id}/quiz`} className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded transition flex items-center space-x-1">
                      <BookOpen size={14} />
                      <span className="text-xs font-semibold">Quiz</span>
                    </Link>
                    <button onClick={() => { setSelectedLesson(lesson); setFormData({...lesson}); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded transition">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => { setSelectedLesson(lesson); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded border border-slate-200 shadow-xl relative z-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">{selectedLesson ? 'Cập nhật bài học' : 'Thêm bài học mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded transition"><X size={18} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tiêu đề bài học</label>
                  <input type="text" required className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-blue-700 transition" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Thứ tự hiển thị</label>
                  <input type="number" required className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-blue-700 transition" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Video URL (Embed)</label>
                  <input type="url" placeholder="https://www.youtube.com/embed/..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-blue-700 transition" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} />
                </div>
                
                {formData.video_url && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Xem trước Video</label>
                    <div className="aspect-video bg-black rounded border border-slate-200 overflow-hidden shadow-sm">
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

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nội dung bài học</label>
                  <div className="bg-white border border-slate-300 rounded overflow-hidden">
                    <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData({...formData, content})} />
                  </div>
                </div>
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white w-full max-w-sm rounded border border-slate-200 shadow-xl relative z-10 p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 border border-red-100 rounded flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Xóa bài học?</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">Bạn có chắc muốn xóa bài học <span className="font-bold text-slate-900">{selectedLesson?.title}</span>?</p>
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

export default TeacherLessonsPage;