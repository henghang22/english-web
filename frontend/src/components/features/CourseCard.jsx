import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, User, ChevronRight, PlayCircle } from 'lucide-react';

const CourseCard = ({ course }) => {
  // Hàm làm sạch HTML để hiển thị mô tả ngắn
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced': return 'bg-red-500 text-white border-red-500';
      case 'Intermediate': return 'bg-amber-500 text-white border-amber-500';
      default: return 'bg-primary text-white border-primary';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'Advanced': return 'Nâng cao';
      case 'Intermediate': return 'Trung bình';
      default: return 'Cơ bản';
    }
  };

  return (
    <div className="card-premium h-full flex flex-col relative group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md z-20 ${getLevelColor(course.level)}`}>
          {getLevelLabel(course.level)}
        </div>

      </div>

      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Meta Info */}
        <div className="flex items-center space-x-6 mb-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="flex items-center group/meta">
            <Clock size={14} className="mr-2 text-primary" />
            <span className="group-hover/meta:text-slate-600 transition-colors">{course.duration || 0} Giờ</span>
          </div>
          <div className="flex items-center group/meta">
            <User size={14} className="mr-2 text-primary" />
            <span className="group-hover/meta:text-slate-600 transition-colors line-clamp-1">{course.creator?.username || 'Giảng viên'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight text-slate-900">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-500 text-sm font-medium mb-10 line-clamp-2 leading-relaxed flex-1">
          {stripHtml(course.description)}
        </p>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black mr-3 shadow-inner ring-4 ring-white">
              {course.creator?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Teacher</div>
              <div className="text-xs font-black text-slate-900 leading-none">{course.creator?.username || 'Giảng viên'}</div>
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center ">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      {/* Invisible Full Link Overlay */}
      <Link to={`/courses/${course.id}`} className="absolute inset-0 z-30" aria-label={course.title}></Link>
    </div>
  );
};

export default CourseCard;
