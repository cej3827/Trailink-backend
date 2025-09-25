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

// 최근 북마크
exports.recentBookmark = async (req, res) => {
  try {
    const { user_id } = req.user;
    const limit = parseInt(req.query.limit) || 8;
    
    // limit 값 검증 (최대 50개)
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    console.log(`최근 북마크 조회 - 사용자: ${user_id}, 개수: ${safeLimit}`);

    const query = `
      SELECT 
        b.bookmark_id,
        b.bookmark_title,
        b.bookmark_url,
        b.bookmark_description,
        b.created_at,
        b.updated_at,
        c.category_name,
        c.category_id
      FROM bookmark b
      LEFT JOIN category c ON b.category_id = c.category_id
      WHERE c.user_id = ?
      ORDER BY b.updated_at DESC
      LIMIT ?
    `;

    const [bookmarks] = await pool.query(query, [user_id, safeLimit]);

    res.json({
      success: true,
      message: '최근 북마크 조회 성공',
      bookmarks: bookmarks,
      total: bookmarks.length
    });

  } catch (error) {
    console.error('최근 북마크 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '최근 북마크 조회 중 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}