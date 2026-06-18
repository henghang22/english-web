const aiService = require('../services/ai.service');
const { QuizResult, Quiz, ChatMessage } = require('../models');

class AIController {
  chat = async (req, res, next) => {
    try {
      const { message } = req.body;
      const userId = req.user.id;

      // 1. Lưu tin nhắn của user vào DB
      await ChatMessage.create({
        user_id: userId,
        role: 'user',
        content: message
      });

      // 2. Thu thập ngữ cảnh học tập của học viên
      const recentResults = await QuizResult.findAll({
        where: { user_id: userId },
        limit: 3,
        order: [['createdAt', 'DESC']],
        include: [{ model: Quiz, as: 'quiz', attributes: ['title'] }]
      });

      let context = `Học viên tên là ${req.user.username}. `;
      if (recentResults.length > 0) {
        context += "Kết quả học tập gần đây: ";
        recentResults.forEach(r => {
          context += `- Bài thi "${r.quiz?.title}" đạt ${r.score}/10 điểm. `;
        });
      }

      // 3. Gọi AI Service
      const aiResponse = await aiService.generateResponse(message, context);

      // 4. Lưu phản hồi của AI vào DB
      await ChatMessage.create({
        user_id: userId,
        role: 'assistant',
        content: aiResponse
      });

      res.json({
        status: 'success',
        data: {
          reply: aiResponse
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getChatHistory = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const history = await ChatMessage.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'ASC']],
        limit: 50 // Giới hạn 50 tin nhắn gần nhất
      });

      res.json({
        status: 'success',
        data: history
      });
    } catch (error) {
      next(error);
    }
  };

  analyzeResult = async (req, res, next) => {
    try {
      const { quizTitle, questions } = req.body;

      const prompt = `
        Học viên vừa làm SAI các câu hỏi sau trong bài thi "${quizTitle}".
        Hãy giải thích chi tiết cho từng câu để học viên hiểu tại sao sai.
        
        Danh sách câu sai:
        ${questions.map((q) => `
          - [ID: ${q.id}] Câu hỏi: ${q.question}
            Học viên chọn: ${q.userAnswer}
            Đáp án đúng: ${q.correctAnswer}
        `).join('\n')}
        CÁCH TRẢ LỜI:
        Câu trả lời phải giải thích theo dạng:
          (1) vì sao đáp án đúng đúng
          (2) vì sao các đáp án còn lại sai (gộp chung, không tách riêng từng dòng)
        Viết tự nhiên, ngắn gọn, dễ hiểu.

        YÊU CẦU BẮT BUỘC: 
        Trả về kết quả dưới dạng JSON object duy nhất, key là ID câu hỏi, value là lời giải thích ngắn gọn, súc tích (khoảng 2-3 câu).
        KHÔNG viết thêm bất kỳ văn bản nào ngoài JSON.
      `;

      const aiResponse = await aiService.generateResponse(prompt, "Bạn là một máy chủ trả về JSON giải thích bài thi.");

      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI không trả về dữ liệu JSON hợp lệ');
      }

      const analysisMap = JSON.parse(jsonMatch[0]);

      res.json({
        status: 'success',
        data: {
          analysis: analysisMap
        }
      });
    } catch (error) {
      console.error('Lỗi parse AI JSON:', error);
      next(error);
    }
  };
}

module.exports = new AIController();
