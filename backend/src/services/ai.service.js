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

      const systemPrompt = `Bạn là một Trợ giảng AI thông minh. Ngữ cảnh: ${context}. Trả lời bằng Tiếng Việt, Markdown.`;
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
