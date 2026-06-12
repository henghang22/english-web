const { QuizResult, Course, User, Lesson, Quiz, UserProgress } = require('../models');
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
            attributes: ['id', 'title'],
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'title']
              }
            ]
          }
        ]
      });

      // 4. Số khóa học hoàn thành
      const allCourses = await Lesson.findAll({
        attributes: [
          'course_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_lessons']
        ],
        group: ['course_id'],
        raw: true
      });

      let completedCourses = 0;

      for (const course of allCourses) {
        const completedLessons = await UserProgress.count({
          where: {
            user_id: userId,
            course_id: course.course_id,
            is_completed: true
          }
        });

        if (completedLessons >= Number(course.total_lessons)) {
          completedCourses++;
        }
      }

      res.json({
        status: 'success',
        data: {
          stats: {
            enrolled_courses: coursesCount || 0,
            completed_courses: completedCourses,
            average_score: averageScore ? parseFloat(averageScore).toFixed(1) : 0
          },
          recent_results: recentResults,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new DashboardController();
