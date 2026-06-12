const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  async generateResponse(prompt, context = '') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const systemPrompt = `Bạn là một Trợ giảng AI thông minh. Ngữ cảnh: ${context}. Trả lời bằng Tiếng Việt, Markdown.`;

      const result = await model.generateContent([
        systemPrompt,
        prompt
      ]);

      const response = await result.response;
      return response.text();

    } catch (error) {
      return `AI tạm thời lỗi: ${error.message}`;
    }
  }
}

module.exports = new AIService();