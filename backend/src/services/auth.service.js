const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email đã tồn tại trên hệ thống');
    }

    const user = await userRepository.create(userData);
    return this.generateTokenResponse(user);
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    return this.generateTokenResponse(user);
  }

  generateTokenResponse(user) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.APP_SECRET_KEY || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    };
  }
}

module.exports = new AuthService();
