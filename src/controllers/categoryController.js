const pool = require('../config/db');

// 카테고리별 북마크 가져오기
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
exports.getCategoryBookmarks = async (req, res) => {
  try {
    // const { categoryId } = req.params;
    const { categoryId } = req.params;
    console.log('Category ID:', categoryId); // 확인을 위한 로그 추가

    // 조인 쿼리로 카테고리와 해당 북마크 데이터를 가져오기
    const [rows] = await pool.query(
      `SELECT 
        c.category_id, 
        c.category_name, 
        b.bookmark_id, 
        b.bookmark_title, 
        b.bookmark_url, 
        b.bookmark_description 
      FROM 
        category c
      LEFT JOIN 
        bookmark b 
      ON 
        c.category_id = b.category_id
      WHERE 
        c.category_id = ?`,
      [categoryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // 데이터 가공
    const category = {
      category_id: rows[0].category_id,
      category_name: rows[0].category_name,
      bookmarks: rows
        .filter((row) => row.bookmark_id !== null) // bookmark 데이터가 없는 경우 필터링
        .map((row) => ({
          bookmark_id: row.bookmark_id,
          bookmark_title: row.bookmark_title,
          bookmark_url: row.bookmark_url,
          bookmark_description: row.bookmark_description,
        })),
    };

    res.json(category);
  } catch (err) {
    console.error('Error fetching category bookmarks:', err);
    res.status(500).send('Server error');
  }
};

//특정 사용자의 카테고리 가져오기
exports.getCategories = async (req, res) => {
  const user_id = req.query.userId;
  const { requesterUserId } = req.user;
  try {
    const [categories] = await pool.query('SELECT category_id, category_name FROM category WHERE user_id = ?', [user_id]);
    console.log(categories);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//카테고리 추가
exports.addCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { category_name, category_description } = req.body;
    await pool.query('INSERT INTO category (user_id, category_name, category_description) VALUES (?, ?, ?)', [user_id, category_name, category_description]);
    // res.json({ id: result.insertId, category_name, category_description, user_id: req.user.id });
    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await query('DELETE FROM categories WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
