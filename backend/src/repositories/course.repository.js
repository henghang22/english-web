const { Course, Lesson, User } = require('../models');

class CourseRepository {
  async findAll(options = {}) {
    console.log('DEBUG: CourseRepository.findAll called with creator alias');
    return await Course.findAll({
      ...options,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'avatar'] }
      ]
    });
  }

  async findById(id) {
    return await Course.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'avatar'] },
        { model: Lesson, as: 'lessons' }
      ],
      order: [[{ model: Lesson, as: 'lessons' }, 'order_index', 'ASC']]
    });
  }

  async create(courseData) {
    return await Course.create(courseData);
  }

  async update(id, courseData) {
    const course = await Course.findByPk(id);
    if (!course) return null;
    return await course.update(courseData);
  }

  async delete(id) {
    const course = await Course.findByPk(id);
    if (!course) return false;
    await course.destroy();
    return true;
  }
}

module.exports = new CourseRepository();
