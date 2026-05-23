const lessonRepository = require('../repositories/lesson.repository');

class LessonController {
  getLessonsByCourse = async (req, res, next) => {
    try {
      const lessons = await lessonRepository.findByCourseId(req.params.courseId);
      res.json({ status: 'success', data: lessons });
    } catch (error) {
      next(error);
    }
  };

  createLesson = async (req, res, next) => {
    try {
      const { title, course_id } = req.body;
      
      // Kiểm tra xem bài học đã tồn tại trong khóa học này chưa
      const existingLesson = await require('../models/lesson.model').findOne({
        where: { title, course_id }
      });

      if (existingLesson) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Bài học với tiêu đề này đã tồn tại trong khóa học' 
        });
      }

      const lesson = await lessonRepository.create(req.body);
      res.status(201).json({ status: 'success', data: lesson });
    } catch (error) {
      next(error);
    }
  };

  updateLesson = async (req, res, next) => {
    try {
      const lesson = await lessonRepository.update(req.params.id, req.body);
      res.json({ status: 'success', data: lesson });
    } catch (error) {
      next(error);
    }
  };

  deleteLesson = async (req, res, next) => {
    try {
      await lessonRepository.delete(req.params.id);
      res.json({ status: 'success', message: 'Lesson deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  reorderLessons = async (req, res, next) => {
    try {
      const { orderedIds } = req.body;
      await lessonRepository.reorder(orderedIds);
      res.json({ status: 'success', message: 'Lessons reordered successfully' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new LessonController();
