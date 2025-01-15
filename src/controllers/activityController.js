const pool = require('../config/db');

// 활동 목록 가져오기
exports.getActivities = async (req, res) => {
  try {
    const { user_id } = req.user;
    const query = `
      SELECT 
        fa.activity_id,
        u.user_id,
        u.user_name,
        u.user_profile_img,
        c.category_id,
        c.category_name
      FROM followingActivity fa
      JOIN user u ON fa.user_id = u.user_id
      JOIN category c ON fa.category_id = c.category_id
      JOIN follow f ON fa.user_id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY fa.created_at DESC;
    `;
    const [rows] = await pool.query(query, [user_id]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).send('Server error');
  }
};

// 활동 제거
// DELETE /api/activity/:activityId
exports.deleteActivity = async (req, res) => {
  const { activityId } = req.params;

  try {
    console.log('Received activityId:', activityId);
    const query = 'DELETE FROM followingActivity WHERE activity_id = ?';
    const [result] = await pool.query(query, [activityId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).send('Server error');
  }
};
