const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      code: 'UNAUTHORIZED',
      message: 'Vui lòng đăng nhập để truy cập'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.APP_SECRET_KEY || process.env.JWT_SECRET);

    // Get user from DB
    req.user = await userRepository.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        code: 'USER_NOT_FOUND',
        message: 'Người dùng không tồn tại'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      code: 'INVALID_TOKEN',
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
