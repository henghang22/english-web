const { QuizResult, Course, User, Lesson, Quiz } = require('../models');
const { sequelize } = require('../config/database');

class DashboardController {
  getStudentStats = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // 1. Tổng số khóa học tham gia
      const results = await QuizResult.findAll({
        where: { user_id: userId },
        include: [{ model: Quiz, as: 'quiz', attributes: ['course_id'] }]
      });
      
      const uniqueCourseIds = new Set(results.map(r => r.quiz?.course_id).filter(id => id));
      const coursesCount = uniqueCourseIds.size;

      // 2. Điểm trung bình (Sửa lỗi QuizResult.avg)
      const avgResult = await QuizResult.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('score')), 'avgScore']
        ],
        where: { user_id: userId },
        raw: true
      });
      
      const averageScore = avgResult[0]?.avgScore || 0;

      // 3. Kết quả thi gần đây
      const recentResults = await QuizResult.findAll({
        where: { user_id: userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { 
            model: Quiz, 
            as: 'quiz',
            attributes: ['id', 'title']
          }
        ]
      });

      // 4. Khóa học gợi ý
      const recommendedCourses = await Course.findAll({
        limit: 3,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        status: 'success',
        data: {
          stats: {
            enrolled_courses: coursesCount || 0,
            completed_courses: 0,
            average_score: averageScore ? parseFloat(averageScore).toFixed(1) : 0
          },
          recent_results: recentResults,
          recommended_courses: recommendedCourses
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new DashboardController();
