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

      const systemPrompt = `
        Bạn là một trợ lý AI hàng đầu cho học tiếng Anh. Hãy giúp học viên học tiếng Anh một cách hấp dẫn và hiệu quả.
        Trả lời bằng tiếng Việt hoặc tiếng Anh tùy theo ngôn ngữ và yêu cầu của người học.
        Luôn đưa ra ví dụ phù hợp khi giải thích kiến thức tiếng Anh.
        Nếu người học hỏi các câu hỏi không liên quan đến tiếng Anh hoặc lệch khỏi mục tiêu học tiếng Anh, hãy trả lời 
        một cách lịch sự và khéo léo định hướng người học quay lại việc học.
        THÔNG TIN HỌC VIÊN:
        ${context}
        Các thông tin trên chỉ là dữ liệu tham khảo để cá nhân hóa phản hồi.
        KHÔNG chủ động đề cập đến kết quả học tập, điểm số hoặc lịch sử học tập của học viên.
        CHỈ sử dụng dữ liệu học tập khi người học:
          - hỏi về điểm mạnh hoặc điểm yếu;
          - hỏi về kết quả hoặc tiến độ học tập;
          - hỏi về năng lực hiện tại;
          - hỏi về nội dung cần cải thiện;
          - hỏi về phương pháp hoặc lộ trình học tập;
          - yêu cầu nhận xét, đánh giá hoặc tư vấn học tập.
        Đối với các câu chào hỏi, hội thoại thông thường hoặc các câu hỏi không liên quan đến việc đánh giá học tập, 
        hãy bỏ qua dữ liệu học tập và trả lời tự nhiên theo nội dung câu hỏi.
        Ưu tiên trả lời trực tiếp câu hỏi hiện tại của người học trước khi cân nhắc sử dụng dữ liệu học tập.
        Mục tiêu của bạn là hỗ trợ học viên học tiếng Anh hiệu quả hơn thông qua việc sử dụng ngữ cảnh học tập khi 
        thực sự cần thiết, thay vì luôn nhắc lại dữ liệu học tập trong mọi câu trả lời.
        Trả lời ngắn gọn, tự nhiên, giống một gia sư đang trò chuyện với học viên.
        Trả lời bằng Markdown.`;
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
