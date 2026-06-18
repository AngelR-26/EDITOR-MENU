const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware, refreshTokenMiddleware } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit.middleware');

// Rutas públicas (con rate limiting)
router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);

// Rutas protegidas
router.post('/refresh', refreshTokenMiddleware, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.put('/password', authMiddleware, authController.changePassword);

module.exports = router;