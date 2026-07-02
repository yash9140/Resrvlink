const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { registerValidators, loginValidators } = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidators, validate, register);
router.post('/login', authLimiter, loginValidators, validate, login);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
