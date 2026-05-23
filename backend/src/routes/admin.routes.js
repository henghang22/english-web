const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const courseController = require('../controllers/course.controller');
const lessonController = require('../controllers/lesson.controller');
const quizController = require('../controllers/quiz.controller');
const quizResultController = require('../controllers/quiz_result.controller');
const userController = require('../controllers/user.controller');
const adminStatsController = require('../controllers/admin_stats.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Thống kê hệ thống
router.get('/stats', protect, authorize('admin'), adminStatsController.getOverview);
router.get('/courses/:courseId/learners', protect, authorize('admin'), adminStatsController.getCourseLearners);

// Tất cả các route trong này đều phải Đăng nhập + là Admin
router.use(protect);
router.use(authorize('admin'));

// 1. Quản lý Người dùng
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// 2. Quản lý Khóa học
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// 3. Quản lý Bài học
router.get('/courses/:courseId/lessons', lessonController.getLessonsByCourse);
router.post('/lessons', lessonController.createLesson);
router.put('/lessons/:id', lessonController.updateLesson);
router.delete('/lessons/:id', lessonController.deleteLesson);
router.post('/lessons/reorder', lessonController.reorderLessons);

// 4. Quản lý Quiz
router.get('/lessons/:lessonId/quiz', quizController.getQuizByLesson);
router.get('/courses/:courseId/quiz', quizController.getQuizByCourse);
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.post('/quizzes/:quizId/questions', quizController.addQuestion);
router.put('/questions/:id', quizController.updateQuestion);
router.delete('/questions/:id', quizController.deleteQuestion);

// 5. Quản lý Kết quả thi
router.get('/quiz-results', quizResultController.getAllResults);

module.exports = router;
