const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const lessonController = require('../controllers/lesson.controller');
const quizController = require('../controllers/quiz.controller');
const teacherController = require('../controllers/teacher.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Tất cả các route dành cho Giáo viên đều yêu cầu Đăng nhập + Quyền 'teacher' hoặc 'admin'
router.use(protect);
router.use(authorize('teacher', 'admin'));

// 1. Quản lý Khóa học của tôi
// Lưu ý: courseController sẽ được cập nhật để xử lý lọc theo req.user.id nếu là giáo viên
router.get('/courses', courseController.getAllCourses); 
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// 2. Quản lý Bài học
router.get('/courses/:courseId/lessons', lessonController.getLessonsByCourse);
router.post('/lessons', lessonController.createLesson);
router.put('/lessons/:id', lessonController.updateLesson);
router.delete('/lessons/:id', lessonController.deleteLesson);

// 3. Quản lý Quiz & Câu hỏi
router.get('/quizzes', quizController.getAllQuizzes);
router.get('/lessons/:lessonId/quiz', quizController.getQuizByLesson);
router.get('/courses/:courseId/quiz', quizController.getQuizByCourse);
router.post('/quizzes', quizController.createQuiz);
router.post('/quizzes/:quizId/questions', quizController.addQuestion);
router.put('/questions/:id', quizController.updateQuestion);
router.delete('/questions/:id', quizController.deleteQuestion);

// 4. Import dữ liệu hàng loạt
router.post('/import/questions', teacherController.importQuestions);
router.post('/import/lessons', teacherController.importLessons);
router.post('/import/courses', teacherController.importCourses);

// 5. Thống kê & Kết quả
router.get('/quiz-results', teacherController.getQuizResults);
router.get('/stats', teacherController.getStats);

router.put(
  '/quizzes/:id',
  protect,
  authorize('teacher', 'admin'),
  quizController.updateQuiz
);
module.exports = router;
