const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/authMiddleware');

// router.get('/:categoryId', getCategoryBookmarks)
router.get('/', getBookmarks);
router.post('/', authMiddleware, addBookmark);
router.delete('/:id', deleteBookmark);

module.exports = router;
