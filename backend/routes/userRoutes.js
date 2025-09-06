const express = require('express');
const router = express.Router();
const { getUserProfile, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers)
router.get('/profile', protect, getUserProfile);

module.exports = router;