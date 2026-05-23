import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Library, Sparkles, 
  Trash2, ShieldCheck, Bookmark
} from 'lucide-react';
import api from '../api/auth.api';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/ai/history');
        if (response.data.status === 'success') {
          const history = response.data.data;
          if (history.length > 0) {
            const formattedHistory = history.map(msg => ({
              role: msg.role === 'assistant' ? 'ai' : 'user',
              content: msg.content
            }));
            setMessages(formattedHistory);
          } else {
            setMessages([
              { role: 'ai', content: 'Chào bạn. Tôi là **Trợ lý tri thức**. Bạn cần hỗ trợ gì về nội dung nghiên cứu hôm nay?' }
            ]);
          }
        }
      } catch (error) {
        setMessages([{ role: 'ai', content: 'Hệ thống hiện không khả dụng. Vui lòng thử lại sau.' }]);
      } finally {
        setFetchingHistory(false);
        setTimeout(() => scrollToBottom('auto'), 100);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!fetchingHistory) scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: input });
      if (response.data.status === 'success') {
        setMessages(prev => [...prev, { role: 'ai', content: response.data.data.reply }]);
      }
    } catch (error) {
      toast.error('Lỗi kết nối');
      setMessages(prev => [...prev, { role: 'ai', content: 'Không thể kết nối với máy chủ. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
      
      {/* Header - Bo tròn nhẹ phía trên */}
      <div className="bg-slate-50/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
            <Library size={14} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-slate-800 uppercase tracking-tighter text-[11px]">Trợ lý học thuật</h1>
            <div className="flex items-center text-[9px] text-green-500 font-bold uppercase tracking-widest">
              <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Trực tuyến
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            if(window.confirm("Xóa lịch sử trò chuyện?")) setMessages([]);
          }} 
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white custom-scrollbar">
        {fetchingHistory ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang đồng bộ...</span>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border mb-1 ${
                  msg.role === 'user' ? 'bg-slate-900 border-slate-800 ml-2' : 'bg-white border-blue-100 text-blue-600 mr-2'
                }`}>
                  {msg.role === 'user' ? <User size={12} className="text-white" /> : <Sparkles size={12} />}
                </div>
                
                <div className={`p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-[1.5rem] rounded-br-none' 
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-[1.5rem] rounded-bl-none shadow-sm'
                }`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Bo tròn cực đại (Pill style) */}
      <div className="p-4 bg-white border-t border-slate-50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Đặt câu hỏi nghiên cứu..."
            className="w-full pl-5 pr-14 py-3.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-600/20 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-1.5 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              !input.trim() || loading 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />}
          </button>
        </form>
        <p className="text-center text-[9px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Nền tảng tri thức bền vững & khai phóng
        </p>
      </div>
    </div>
  );
};

export default AIChatPage;