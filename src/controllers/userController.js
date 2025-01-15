const pool = require('../config/db');

exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await pool.query('SELECT user_id, user_name, user_profile_img FROM user WHERE user_id = ?', [userId]);
    console.log(user[0]);
    res.json(user[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, profile_picture } = req.body;
    await query('UPDATE users SET name = ?, profile_picture = ? WHERE id = ?', [name, profile_picture, req.user.id]);
    res.json({ msg: 'Profile updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;
    const users = await query('SELECT id, name, profile_picture FROM users WHERE name LIKE ?', [`%${searchQuery}%`]);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
