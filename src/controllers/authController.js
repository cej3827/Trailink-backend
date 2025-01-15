const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 회원가입
exports.register = async (req, res) => {
  try {
    const { user_id, user_password, user_name } = req.body;

    // 아이디
    const existingUser = await pool.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    // 사용자 추가
    await pool.query('INSERT INTO user (user_id, user_password, user_name) VALUES (?, ?, ?)', [user_id, hashedPassword, user_name]);

    // 새 사용자 가져오기
    const newUser = await pool.query('SELECT user_id FROM user WHERE user_id = ?', [user_id]);

    // JWT 생성
    const payload = {
      user: {
        user_id: newUser[0].user_id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).send('Server error');
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { user_id, user_password } = req.body;

    // 사용자 조회
    const [rows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
    console.log('User data from DB:', rows); // 디버깅

    if (!rows || rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const user = rows[0];

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // JWT 생성
    const payload = {
      user: {
        user_id: user.user_id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      res.json({
        success: true,
        message: "Login successful",
        token,
        data: {
          user_id: user.user_id,
          user_name: user.user_name,
          profile_img: user.profile_img,
        },
      });
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
};
