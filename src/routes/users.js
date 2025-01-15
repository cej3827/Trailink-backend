const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, searchUsers } = require('../controllers/userController');

router.get('/profile/:userId', getProfile);
router.put('/profile', updateProfile);
router.get('/search', searchUsers);

module.exports = router;
