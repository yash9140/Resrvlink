const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.get('/profile', verifyToken, getProfile);

module.exports = router;
