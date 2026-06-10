const { User, Course, Quiz, QuizResult, Question } = require('../models');
const { sequelize } = require('../config/database');

class AdminStatsController {
  getOverview = async (req, res, next) => {
    try {
      // 1. Đếm tổng số (Linh hoạt với role viết hoa/thường)
      const totalStudents = await User.count({
        where: { role: 'student' }
      });
      const totalTeachers = await User.count({
        where: { role: 'teacher' }
      });
      const totalCourses = await Course.count();
      const totalQuizzes = await Quiz.count();
      const totalQuestions = await Question.count();
      const totalResults = await QuizResult.count();

      // 2. Tính điểm trung bình hệ thống
      const avgScore = await QuizResult.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgScore']],
        raw: true
      });

      // 3. Khóa học phổ biến (Dựa trên số lượt làm Quiz)
      const popularCourses = await QuizResult.findAll({
        attributes: [
          [sequelize.col('quiz.course_id'), 'courseId'],
          [sequelize.fn('COUNT', sequelize.col('QuizResult.id')), 'totalResults']
        ],
        include: [{
          model: Quiz,
          as: 'quiz',
          attributes: ['title'],
          include: [{ model: Course, as: 'course', attributes: ['title'] }]
        }],
        group: ['quiz.course_id', 'quiz.id', 'quiz.course.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('QuizResult.id')), 'DESC']],
        limit: 5
      });

      // 4. Hoạt động gần đây
      const recentActivities = await QuizResult.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['username'] },
          { model: Quiz, as: 'quiz', attributes: ['title'] }
        ]
      });

      res.json({
        status: 'success',
        data: {
          overview: {
            totalStudents,
            totalTeachers,
            totalCourses,
            totalQuizzes,
            totalQuestions,
            totalResults,
            averageScore: parseFloat(avgScore[0]?.avgScore || 0).toFixed(1)
          },
          popularCourses,
          recentActivities
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getCourseLearners = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { UserProgress, User, Lesson } = require('../models');

      // 1. Lấy tổng số bài học trong khóa học
      const totalLessons = await Lesson.count({ where: { course_id: courseId } });

      // 2. Lấy danh sách user đã từng học khóa này (có trong UserProgress)
      const progressList = await UserProgress.findAll({
        where: { course_id: courseId },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
        attributes: ['user_id', [sequelize.fn('COUNT', sequelize.col('lesson_id')), 'completedLessons']],
        group: ['user_id', 'user.id'],
      });

      const learners = progressList.map(p => ({
        id: p.user.id,
        username: p.user.username,
        email: p.user.email,
        completedLessons: parseInt(p.get('completedLessons')),
        totalLessons,
        progressPercent: totalLessons > 0 ? Math.round((parseInt(p.get('completedLessons')) / totalLessons) * 100) : 0
      }));

      res.json({
        status: 'success',
        data: learners
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AdminStatsController();
