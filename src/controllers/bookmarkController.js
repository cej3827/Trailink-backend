const pool = require('../config/db');

// // 카테고리별 북마크 가져오기
// exports.getCategoryBookmarks = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     // console.log('Category ID:', categoryId); // 확인을 위한 로그 추가
//     const [rows] = await pool.query('SELECT * FROM bookmark WHERE category_id = ?', [categoryId]);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching category bookmarks:', err);
//     res.status(500).send('Server error');
//   }
// };

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await query('SELECT * FROM bookmarks WHERE user_id = ?', [req.user.id]);
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const { title, url, description, category_id } = req.body;
    const result = await query(
      'INSERT INTO bookmarks (title, url, description, category_id, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, url, description, category_id, req.user.id]
    );
    res.json({ id: result.insertId, title, url, description, category_id, user_id: req.user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await query('DELETE FROM bookmarks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
