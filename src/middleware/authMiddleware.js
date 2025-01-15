const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 요청 헤더에서 토큰 추출
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 사용자 정보를 요청 객체에 추가
    req.user = decoded.user; // payload의 user 필드 사용
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
