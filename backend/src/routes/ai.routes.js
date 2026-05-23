const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

// Mọi yêu cầu chat đều phải đăng nhập
router.post('/chat', protect, aiController.chat);
router.get('/history', protect, aiController.getChatHistory);
router.post('/analyze-result', protect, aiController.analyzeResult);

module.exports = router;
