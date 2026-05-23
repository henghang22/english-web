const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.get('/ping', (req, res) => res.json({ status: 'success', message: 'Pong! Auth API is alive' }));
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;
