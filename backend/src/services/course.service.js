const courseRepository = require('../repositories/course.repository');
const lessonRepository = require('../repositories/lesson.repository');

class CourseService {
  async getAllCourses(filter = {}) {
    return await courseRepository.findAll({ where: filter });
  }

  async getCourseDetail(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }
    return course;
  }

  async createCourse(teacherId, courseData) {
    return await courseRepository.create({
      ...courseData,
      teacher_id: teacherId
    });
  }

  async getLessonDetail(id) {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw new Error('Không tìm thấy bài học');
    }
    return lesson;
  }

  async getCoursesByTeacher(teacherId) {
    return await courseRepository.findAll({
      where: {
        teacher_id: teacherId
      }
    });
  }

  async getMyCourses(userId) {
    const { UserProgress, Course, User } = require('../models');

    // Lấy danh sách course_id từ UserProgress
    const progress = await UserProgress.findAll({
      where: { user_id: userId },
      attributes: ['course_id'],
      group: ['course_id']
    });

    const courseIds = progress.map(p => p.course_id);

    if (courseIds.length === 0) return [];

    return await Course.findAll({
      where: { id: courseIds },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'avatar'] }
      ]
    });
  }
}

module.exports = new CourseService();
