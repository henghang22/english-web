const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/lessons/:lessonId', progressController.updateProgress);
router.get('/courses/:courseId', progressController.getProgress);
router.get('/courses/:courseId/resume', progressController.getResumeInfo);

module.exports = router;
