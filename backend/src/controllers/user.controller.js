const userRepository = require('../repositories/user.repository');

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      const users = await userRepository.findAll();
      res.json({ status: 'success', data: users });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const user = await userRepository.create(req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const user = await userRepository.update(req.params.id, req.body);
      res.json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await userRepository.delete(req.params.id);
      res.json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserController();
