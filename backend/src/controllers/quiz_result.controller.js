const quizResultRepository = require('../repositories/quiz_result.repository');

class QuizResultController {
  saveResult = async (req, res, next) => {
    try {
      const { quiz_id, score, total_questions, correct_answers, answers_data } = req.body;
      const result = await quizResultRepository.create({
        user_id: req.user.id,
        quiz_id,
        score,
        total_questions,
        correct_answers,
        answers_data
      });
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  getAllResults = async (req, res, next) => {
    try {
      const results = await quizResultRepository.findAll();
      res.json({ status: 'success', data: results });
    } catch (error) {
      next(error);
    }
  };

  getMyResults = async (req, res, next) => {
    try {
      const results = await quizResultRepository.findByUserId(req.user.id);
      res.json({ status: 'success', data: results });
    } catch (error) {
      next(error);
    }
  };

  getResultDetail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await quizResultRepository.findById(id);
      
      if (!result) {
        return res.status(404).json({ status: 'error', message: 'Không tìm thấy kết quả' });
      }

      // Kiểm tra quyền xem kết quả:
      // 1. Admin
      // 2. Chính học viên đã làm bài
      const isOwner = result.user_id === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ status: 'error', message: 'Bạn không có quyền xem kết quả này' });
      }

      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new QuizResultController();
