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

//북마크 추가
exports.addBookmark = async (req, res) => {
  try {
    const { category_id, bookmark_title, bookmark_url, bookmark_description } = req.body;
    const result = await pool.query(
      'INSERT INTO bookmark (category_id, bookmark_title, bookmark_url, bookmark_description) VALUES (?, ?, ?, ?)',
      [category_id, bookmark_title, bookmark_url, bookmark_description]
    );
    res.json(req.body);
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
