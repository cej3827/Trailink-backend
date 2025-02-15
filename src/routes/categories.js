const express = require('express');
const router = express.Router();
const { getCategoryBookmarks, getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:categoryId', getCategoryBookmarks)
router.get('/', authMiddleware, getCategories);
router.post('/', authMiddleware, addCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
