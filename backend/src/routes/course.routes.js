const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const quizController = require('../controllers/quiz.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const quizResultController = require('../controllers/quiz_result.controller');
const dashboardController = require('../controllers/dashboard.controller');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/my-courses', protect, courseController.getMyCourses);
router.get('/:id', courseController.getCourseDetail);
router.get('/:courseId/quiz', quizController.getQuizByCourse);
router.get('/lessons/:id', courseController.getLessonDetail);
router.get('/lessons/:lessonId/quiz', quizController.getQuizByLesson);

// Protected routes
router.post('/', protect, authorize('admin'), courseController.createCourse);
router.get('/dashboard/stats', protect, dashboardController.getStudentStats);
router.post('/quizzes/:quizId/results', protect, quizResultController.saveResult);
router.get('/my-quiz-results', protect, quizResultController.getMyResults);
router.get('/quiz-results/:id', protect, quizResultController.getResultDetail);

module.exports = router;
