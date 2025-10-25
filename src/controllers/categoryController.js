const pool = require('../config/db');

// 카테고리별 북마크 가져오기 (페이지네이션, 정렬 포함)
// 방문자 모드와 소유자 모드 지원
exports.getCategoryBookmarks = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const isAuthenticated = req.user !== null;
    const user_id = req.user?.user_id;
    
    // 쿼리 파라미터 파싱
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'latest';
    
    // 페이지네이션 계산
    const offset = (page - 1) * limit;
    
    // 정렬 조건 설정
    let orderBy = '';
    switch (sortBy) {
      case 'latest':
        orderBy = 'b.created_at DESC';
        break;
      case 'oldest':
        orderBy = 'b.created_at ASC';
        break;
      case 'name':
        orderBy = 'b.bookmark_title ASC';
        break;
      default:
        orderBy = 'b.created_at DESC';
    }
    
    const mode = isAuthenticated ? '소유자' : '방문자';
    console.log(`카테고리별 북마크 조회 - 모드: ${mode}, 사용자: ${user_id || '없음'}, 카테고리: ${categoryId}, 페이지: ${page}, 정렬: ${sortBy}`);

    // 카테고리 존재 여부 확인
    const [categoryCheck] = await pool.query(
      'SELECT category_id, user_id FROM category WHERE category_id = ?',
      [categoryId]
    );

    if (categoryCheck.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: '카테고리를 찾을 수 없습니다' 
      });
    }

    // 소유자 여부 확인
    const isOwner = isAuthenticated && categoryCheck[0].user_id === user_id;

    // 전체 북마크 개수 조회
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM bookmark WHERE category_id = ?',
      [categoryId]
    );
    const totalBookmarks = countResult[0].total;

    // 페이지네이션된 북마크 조회
    const [bookmarks] = await pool.query(
      `SELECT 
        b.bookmark_id,
        b.bookmark_title,
        b.bookmark_url,
        b.bookmark_description,
        b.created_at,
        b.updated_at
      FROM bookmark b
      WHERE b.category_id = ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalBookmarks / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 응답 데이터 구성
    const response = {
      success: true,
      message: '카테고리별 북마크 조회 성공',
      data: {
        bookmarks: bookmarks,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalBookmarks: totalBookmarks,
          limit: limit,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage
        },
        sortBy: sortBy,
        viewMode: isAuthenticated ? (isOwner ? 'owner' : 'visitor_authenticated') : 'visitor',
        permissions: {
          canEdit: isOwner,
          canDelete: isOwner,
          canAdd: isOwner
        }
      }
    };

    res.json(response);

  } catch (err) {
    console.error('Error fetching category bookmarks:', err);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 사용자의 카테고리 가져오기
exports.getCategories = async (req, res) => {
  const { user_id } = req.user;
  console.log(`카테고리 조회 요청 - 사용자: ${user_id}`);

  try {
    const [categories] = await pool.query(`
      SELECT 
        c.category_id, 
        c.category_name, 
        c.category_description,
        c.created_at,
        c.updated_at,
        c.user_id,
        COUNT(b.bookmark_id) as bookmark_count
      FROM category c
      LEFT JOIN bookmark b ON c.category_id = b.category_id
      WHERE c.user_id = ?
      GROUP BY c.category_id, c.category_name, c.category_description, c.created_at, c.updated_at, c.user_id
      ORDER BY c.created_at DESC
      `, [user_id]);

    console.log('조회된 카테고리:', categories);

    res.json({
      success: true,
      message: '카테고리 목록 조회 성공',
      categories: categories
    });

  } catch (error) {
    console.error('카테고리 조회 오류:', error.message);

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
