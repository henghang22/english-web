const quizRepository = require('../repositories/quiz.repository');
const lessonRepository = require('../repositories/lesson.repository');
const courseRepository = require('../repositories/course.repository');
const { QuizResult, Quiz, User, Course, Lesson, Question, Answer } = require('../models');
const { Op } = require('sequelize');

class TeacherController {
  // Lấy kết quả làm bài của học viên đối với các bộ Quiz của giáo viên
  getQuizResults = async (req, res, next) => {
    try {
      const teacherId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows } = await QuizResult.findAndCountAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'avatar']
          },
          {
            model: Quiz,
            as: 'quiz',
            required: true,
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
            ]
          }
        ],
        where: {
          [Op.or]: [
            { '$quiz.course.teacher_id$': teacherId },
            { '$quiz.lesson.course.teacher_id$': teacherId }
          ]
        },
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      res.json({
        status: 'success',
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      next(error);
    }
  };

  // Import danh sách câu hỏi vào một Quiz
  importQuestions = async (req, res, next) => {
    try {
      const { quizId, questions } = req.body;

      if (!quizId || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ status: 'fail', message: 'Dữ liệu không hợp lệ' });
      }

      const results = [];
      for (const qData of questions) {
        // Kiểm tra xem câu hỏi đã tồn tại trong quiz này chưa
        let question = await Question.findOne({
          where: {
            quiz_id: quizId,
            question_text: qData.question_text
          }
        });

        if (question) {
          // Nếu đã có câu hỏi, ta update giải thích
          await question.update({
            explanation: qData.explanation || question.explanation
          });
        } else {
          // 1. Tạo câu hỏi mới
          question = await quizRepository.createQuestion({
            quiz_id: quizId,
            question_text: qData.question_text,
            explanation: qData.explanation
          });
        }

        // 2. Xử lý các đáp án (Xóa cũ tạo lại để đảm bảo tính đúng đắn của dữ liệu Excel mới nhất)
        await Answer.destroy({ where: { question_id: question.id } });

        for (let i = 1; i <= 10; i++) {
          const ansText = qData[`answer_${i}`];
          const isCorrect = qData[`is_correct_${i}`] === true || qData[`is_correct_${i}`] === 'TRUE' || qData[`is_correct_${i}`] === 'x';

          if (ansText) {
            await quizRepository.createAnswer({
              question_id: question.id,
              answer_text: String(ansText),
              is_correct: isCorrect
            });
          }
        }
        results.push(question);
      }

      res.status(201).json({
        status: 'success',
        message: `Đã import thành công ${results.length} câu hỏi`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  };

  // Import danh sách bài học vào một khóa học
  importLessons = async (req, res, next) => {
    try {
      const { courseId, lessons } = req.body;

      if (!courseId || !lessons || !Array.isArray(lessons)) {
        return res.status(400).json({ status: 'fail', message: 'Dữ liệu không hợp lệ' });
      }

      const importedLessons = [];
      for (const lData of lessons) {
        // Kiểm tra tồn tại
        const existingLesson = await Lesson.findOne({
          where: {
            course_id: courseId,
            title: lData.title
          }
        });

        if (existingLesson) {
          await existingLesson.update({
            content: lData.content || existingLesson.content,
            order_index: lData.order_index || existingLesson.order_index,
            video_url: lData.video_url || existingLesson.video_url
          });
          importedLessons.push(existingLesson);
        } else {
          const lesson = await Lesson.create({
            course_id: courseId,
            title: lData.title,
            content: lData.content || '',
            order_index: lData.order_index || 0,
            video_url: lData.video_url || null
          });
          importedLessons.push(lesson);
        }
      }

      res.status(201).json({
        status: 'success',
        message: `Đã import thành công ${importedLessons.length} bài học`,
        data: importedLessons
      });
    } catch (error) {
      next(error);
    }
  };

  // Import danh sách khóa học
  importCourses = async (req, res, next) => {
    try {
      const { courses } = req.body;

      if (!courses || !Array.isArray(courses)) {
        return res.status(400).json({ status: 'fail', message: 'Dữ liệu không hợp lệ' });
      }

      const importedCourses = [];
      for (const cData of courses) {
        // Kiểm tra xem đã có khóa học cùng tên của giáo viên này chưa
        const existingCourse = await Course.findOne({
          where: {
            title: cData.title,
            teacher_id: req.user.id
          }
        });

        if (existingCourse) {
          // Update nếu đã tồn tại
          await existingCourse.update({
            description: cData.description || existingCourse.description,
            thumbnail: cData.thumbnail || existingCourse.thumbnail,
            level: cData.level || existingCourse.level,
            duration: cData.duration || existingCourse.duration
          });
          importedCourses.push(existingCourse);
        } else {
          // Tạo mới nếu chưa có
          const course = await Course.create({
            title: cData.title,
            description: cData.description || '',
            thumbnail: cData.thumbnail || null,
            level: cData.level || 'Beginner',
            duration: cData.duration || 0,
            teacher_id: req.user.id
          });
          importedCourses.push(course);
        }
      }

      res.status(201).json({
        status: 'success',
        message: `Đã import thành công ${importedCourses.length} khóa học`,
        data: importedCourses
      });
    } catch (error) {
      next(error);
    }
  };
  getStats = async (req, res, next) => {
    try {
      const teacherId = req.user.id;

      // 1. Tổng số khóa học
      const totalCourses = await Course.count({ where: { teacher_id: teacherId } });

      // 2. Tổng số bài học (thông qua các khóa học của giáo viên)
      const totalLessons = await Lesson.count({
        include: [{
          model: Course,
          as: 'course',
          required: true,
          where: { teacher_id: teacherId }
        }]
      });

      // 3. Tổng số Quiz
      const totalQuizzes = await Quiz.count({
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
            include: [{
              model: Course,
              as: 'course',
              required: true,
              where: { teacher_id: teacherId }
            }]
          }
        ],
        where: {
          [Op.or]: [
            { '$course.teacher_id$': teacherId },
            { '$lesson.course.teacher_id$': teacherId }
          ]
        }
      });

      // getCourses = async (req, res, next) => {
      //   try {
      //     const courses = await courseService.getCoursesByTeacher(req.user.id);

      //     res.json({
      //       status: 'success',
      //       data: courses
      //     });
      //   } catch (error) {
      //     next(error);
      //   }
      // };

      // 4. Tổng số lượt làm bài & Điểm trung bình
      const quizResults = await QuizResult.findAll({
        include: [{
          model: Quiz,
          as: 'quiz',
          required: true,
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
              include: [{
                model: Course,
                as: 'course',
                required: true,
                where: { teacher_id: teacherId }
              }]
            }
          ]
        }],
        where: {
          [Op.or]: [
            { '$quiz.course.teacher_id$': teacherId },
            { '$quiz.lesson.course.teacher_id$': teacherId }
          ]
        }
      });

      const totalAttempts = quizResults.length;
      const averageScore = totalAttempts > 0
        ? quizResults.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts
        : 0;

      res.json({
        status: 'success',
        data: {
          totalCourses,
          totalLessons,
          totalQuizzes,
          totalAttempts,
          averageScore: parseFloat(averageScore.toFixed(2))
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new TeacherController();
