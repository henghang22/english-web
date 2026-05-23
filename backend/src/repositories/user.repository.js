const { User } = require('../models');

class UserRepository {
  async findAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    
    // Nếu mật khẩu rỗng (khi edit không nhập mới), hãy loại bỏ nó khỏi dữ liệu update
    if (data.password === '' || data.password === null || data.password === undefined) {
      delete data.password;
    }
    
    return await user.update(data);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return await user.destroy();
  }
}

module.exports = new UserRepository();
