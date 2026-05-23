const { QuizResult, User, Quiz, Lesson, Course } = require('../models');

class QuizResultRepository {
  async create(data) {
    return await QuizResult.create(data);
  }

  async findAll() {
    return await QuizResult.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { 
          model: Quiz, 
          as: 'quiz',
          include: [
            { model: Lesson, as: 'lesson', attributes: ['id', 'title'] },
            { model: Course, as: 'course', attributes: ['id', 'title'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async findByUserId(userId) {
    return await QuizResult.findAll({
      where: { user_id: userId },
      include: [{ model: Quiz, as: 'quiz' }],
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await QuizResult.findByPk(id, {
      include: [
        { 
          model: Quiz, 
          as: 'quiz',
          include: [
            { 
              model: require('../models/lesson.model'), 
              as: 'lesson',
              include: [{ model: require('../models/course.model'), as: 'course' }]
            },
            { model: require('../models/course.model'), as: 'course' },
            { 
              model: require('../models/question.model'), 
              as: 'questions',
              include: [{ model: require('../models/answer.model'), as: 'answers' }]
            }
          ]
        }
      ]
    });
  }
}

module.exports = new QuizResultRepository();
