const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // 요청 헤더에서 토큰 추출
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '액세스 토큰이 필요합니다',
        error: 'MISSING_TOKEN'
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user; // payload의 user 필드 사용
    next()
  } catch (error) {
    console.error('토큰 검증 실패: ', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다',
        error: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다',
        error: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다',
      error: 'SERVER_ERROR'
    });
  }

  // try {
  //   // 토큰 검증
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //   // 사용자 정보를 요청 객체에 추가
  //   req.user = decoded.user; // payload의 user 필드 사용
  //   next();
  // } catch (err) {
  //   console.error('JWT verification failed:', err.message);
  //   res.status(401).json({ msg: 'Token is not valid' });
  // }
};

module.exports = authMiddleware;
