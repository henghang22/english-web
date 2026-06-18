const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  async generateResponse(prompt, context = '') {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      // 1. Dò tìm danh sách model thực tế
      let availableModels = [];

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        const data = await response.json();
        availableModels = data.models?.map(m => m.name) || [];
        console.log('--- AI Auto-Detect ---');
        console.log('Models khả dụng:', availableModels.join(', '));
      } catch (e) {
        console.error('Không thể quét model:', e.message);
      }

      if (availableModels.length === 0) {
        throw new Error('Key của bạn không có quyền truy cập bất kỳ model nào. Hãy kiểm tra lại "Generative Language API" trong Google Cloud.');
      }

      // 2. Chọn model tốt nhất (ưu tiên flash, nếu không thì lấy cái đầu tiên)
      // Loại bỏ prefix "models/" nếu có vì thư viện sẽ tự thêm
      const bestModelName = (availableModels.find(m => m.includes('flash')) || availableModels[0]).replace('models/', '');
      console.log('Đang sử dụng model:', bestModelName);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: bestModelName });

      const systemPrompt = `Bạn là một trợ lý AI hàng đầu cho học tiếng Anh. Hãy giúp học viên học tiếng Anh một cách hấp dẫn và 
      hiệu quả. Trả lời bằng tiếng Việt hoặc tiếng Anh tùy theo yêu cầu. Luôn cung cấp ví dụ và giải thích chi tiết. Nếu người học
      hỏi các câu hỏi không liên quan đến tiếng Anh hoặc lệch khỏi mục tiêu học tiếng Anh thì hãy trả lời bằng tiếng Anh để 
      định hướng người học quay lại việc học.
      THÔNG TIN HỌC VIÊN
      ${context}
      Các thông tin trên chỉ là ngữ cảnh tham khảo để cá nhân hóa phản hồi. Hãy tự đánh giá mức độ liên quan của các thông tin 
      này đối với câu hỏi hiện tại trước khi sử dụng. Không cần đề cập đến kết quả học tập trong các câu chào hỏi hoặc hội thoại
      thông thường. Chỉ sử dụng dữ liệu học tập khi người học hỏi về năng lực, tiến độ học tập, điểm mạnh, điểm yếu, phương pháp 
      học hoặc khi các dữ liệu đó thực sự giúp cải thiện chất lượng câu trả lời. Ưu tiên trả lời trực tiếp câu hỏi hiện tại của 
      người học. Trả lời bằng Markdown.
        `;
      const result = await model.generateContent([systemPrompt, prompt]);
      const res = await result.response;
      return res.text();
    } catch (error) {
      console.error('Lỗi AI:', error.message);
      return `Hệ thống AI đang tạm nghỉ (Lỗi: ${error.message}). Bạn hãy thử lại sau vài phút nhé!`;
    }
  }
}

module.exports = new AIService();
