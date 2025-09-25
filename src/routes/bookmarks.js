const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, deleteBookmark, recentBookmark } = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/authMiddleware');

// router.get('/:categoryId', getCategoryBookmarks)
router.get('/', getBookmarks);
router.post('/', authMiddleware, addBookmark);
router.delete('/:id', deleteBookmark);
router.get('/recent', authMiddleware, recentBookmark)

module.exports = router;
