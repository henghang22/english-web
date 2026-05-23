const authService = require('../services/auth.service');
const { v4: uuidv4 } = require('uuid');
class AuthController {
  register = async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        code: 'REGISTER_SUCCESS',
        message: 'Đăng ký tài khoản thành công',
        data: result,
        trace_id: uuidv4()
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        status: 'success',
        code: 'LOGIN_SUCCESS',
        message: 'Đăng nhập thành công',
        data: result,
        trace_id: uuidv4()
      });
    } catch (error) {
      res.status(401).json({
        status: 'fail',
        code: 'AUTH_FAILED',
        message: error.message
      });
    }
  }

  getMe = async (req, res, next) => {
    try {
      res.status(200).json({
        status: 'success',
        data: { user: req.user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
