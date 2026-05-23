const { Lesson } = require('../models');

class LessonRepository {
  async findByCourseId(courseId) {
    return await Lesson.findAll({
      where: { course_id: courseId },
      order: [['order_index', 'ASC']]
    });
  }

  async findById(id) {
    return await Lesson.findByPk(id);
  }

  async create(data) {
    return await Lesson.create(data);
  }

  async update(id, data) {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) throw new Error('Lesson not found');
    return await lesson.update(data);
  }

  async delete(id) {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) throw new Error('Lesson not found');
    return await lesson.destroy();
  }

  async reorder(orderedIds) {
    const promises = orderedIds.map((id, index) => {
      return Lesson.update({ order_index: index + 1 }, { where: { id } });
    });
    return await Promise.all(promises);
  }
}

module.exports = new LessonRepository();
