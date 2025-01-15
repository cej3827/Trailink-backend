const express = require('express');
const { getActivities, deleteActivity, getCategoryBookmarks } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


// 활동 목록 API
router.get('/', authMiddleware, getActivities);

// 활동 삭제 API
router.delete('/:activityId', deleteActivity);

// 카테고리별 북마크 API
// router.get('/category/:categoryId', getCategoryBookmarks);

module.exports = router;
