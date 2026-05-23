const quizRepository = require('../repositories/quiz.repository');
const { Question } = require('../models');

class QuizController {
  getAllQuizzes = async (req, res, next) => {
    try {
      const quizzes = await quizRepository.findAllByTeacherId(req.user.id);
      res.json({ status: 'success', data: quizzes });
    } catch (error) {
      next(error);
    }
  };

  getQuizByLesson = async (req, res, next) => {
    try {
      const quiz = await quizRepository.findByLessonId(req.params.lessonId);
      res.json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  };

  getQuizByCourse = async (req, res, next) => {
    try {
      const quiz = await quizRepository.findByCourseId(req.params.courseId);
      res.json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  };

  createQuiz = async (req, res, next) => {
    try {
      const quiz = await quizRepository.createQuiz(req.body);
      res.status(201).json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  };

  updateQuiz = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, time_limit } = req.body;
      const quiz = await quizRepository.updateQuiz(id, { title, time_limit });
      res.json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  };

  addQuestion = async (req, res, next) => {
    try {
      const { quizId } = req.params;
      const { question_text, explanation, answers, lesson_id, course_id } = req.body;

      // Kiểm tra xem câu hỏi đã tồn tại trong quiz này chưa
      const existingQuestion = await Question.findOne({
        where: { quiz_id: quizId, question_text }
      });

      if (existingQuestion) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Câu hỏi này đã tồn tại trong bộ Quiz' 
        });
      }

      const question = await quizRepository.createQuestion({
        quiz_id: quizId,
        question_text,
        explanation
      });

      if (answers && answers.length > 0) {
        for (const ans of answers) {
          await quizRepository.createAnswer({
            question_id: question.id,
            answer_text: ans.answer_text,
            is_correct: ans.is_correct
          });
        }
      }

      const updatedQuiz = lesson_id 
        ? await quizRepository.findByLessonId(lesson_id)
        : await quizRepository.findByCourseId(course_id);
        
      res.status(201).json({ status: 'success', data: updatedQuiz });
    } catch (error) {
      next(error);
    }
  };

  updateQuestion = async (req, res, next) => {
    try {
      const { question_text, explanation, answers } = req.body;
      const questionId = req.params.id;

      // 1. Cập nhật thông tin câu hỏi
      await quizRepository.updateQuestion(questionId, {
        question_text,
        explanation
      });

      // 2. Xóa đáp án cũ và tạo lại mới
      if (answers && answers.length > 0) {
        await quizRepository.deleteAnswersByQuestionId(questionId);
        for (const ans of answers) {
          await quizRepository.createAnswer({
            question_id: questionId,
            answer_text: ans.answer_text,
            is_correct: ans.is_correct
          });
        }
      }

      res.json({ status: 'success', message: 'Cập nhật câu hỏi thành công' });
    } catch (error) {
      next(error);
    }
  };

  deleteQuestion = async (req, res, next) => {
    try {
      await quizRepository.deleteQuestion(req.params.id);
      res.json({ status: 'success', message: 'Question deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new QuizController();
