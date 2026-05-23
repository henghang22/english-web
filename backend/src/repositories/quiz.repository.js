const { Quiz, Question, Answer, Course, Lesson } = require('../models');
const { Op } = require('sequelize');

class QuizRepository {
  async findAllByTeacherId(teacherId) {
    return await Quiz.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          required: false,
          where: { teacher_id: teacherId }
        },
        {
          model: Lesson,
          as: 'lesson',
          required: false,
          include: [
            {
              model: Course,
              as: 'course',
              required: true,
              where: { teacher_id: teacherId }
            }
          ]
        }
      ],
      where: {
        [Op.or]: [
          { '$course.teacher_id$': teacherId },
          { '$lesson.course.teacher_id$': teacherId }
        ]
      }
    });
  }

  async findByLessonId(lessonId) {
    return await Quiz.findOne({
      where: { lesson_id: lessonId },
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Answer, as: 'answers' }]
        }
      ]
    });
  }

  async findByCourseId(courseId) {
    return await Quiz.findOne({
      where: { course_id: courseId },
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Answer, as: 'answers' }]
        }
      ]
    });
  }

  async createQuiz(data) {
    return await Quiz.create(data);
  }

  async updateQuiz(id, data) {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) return null;
    return await quiz.update(data);
  }

  async createQuestion(data) {
    return await Question.create(data);
  }

  async createAnswer(data) {
    return await Answer.create(data);
  }

  async deleteQuiz(id) {
    return await Quiz.destroy({ where: { id } });
  }

  async deleteQuestion(id) {
    return await Question.destroy({ where: { id } });
  }

  async updateQuestion(id, data) {
    return await Question.update(data, { where: { id } });
  }

  async deleteAnswersByQuestionId(questionId) {
    return await Answer.destroy({ where: { question_id: questionId } });
  }
}

module.exports = new QuizRepository();
