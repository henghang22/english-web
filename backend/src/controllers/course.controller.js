const courseService = require('../services/course.service');
const courseRepository = require('../repositories/course.repository');
const { v4: uuidv4 } = require('uuid');

class CourseController {
  getAllCourses = async (req, res, next) => {
    try {
      const filter = {};

      if (req.user && req.user.role === 'teacher') {
      filter.teacher_id = req.user.id;
    }
      const courses = await courseService.getAllCourses(filter);

      res.status(200).json({
        status: 'success',
        code: 'GET_COURSES_SUCCESS',
        message: 'Lấy danh sách khóa học thành công',
        data: courses,
        trace_id: uuidv4()
      });
    } catch (error) {
      next(error);
    }
  }

  getMyCourses = async (req, res, next) => {
    try {
      const courses = await courseService.getMyCourses(req.user.id);
      res.status(200).json({
        status: 'success',
        code: 'GET_MY_COURSES_SUCCESS',
        message: 'Lấy danh sách khóa học của bạn thành công',
        data: courses,
        trace_id: uuidv4()
      });
    } catch (error) {
      next(error);
    }
  }

  getCourseDetail = async (req, res, next) => {
    try {
      const course = await courseService.getCourseDetail(req.params.id);
      res.status(200).json({
        status: 'success',
        code: 'GET_COURSE_DETAIL_SUCCESS',
        message: 'Lấy chi tiết khóa học thành công',
        data: course,
        trace_id: uuidv4()
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        code: 'COURSE_NOT_FOUND',
        message: error.message
      });
    }
  }

  getLessonDetail = async (req, res, next) => {
    try {
      const lesson = await courseService.getLessonDetail(req.params.id);
      res.status(200).json({
        status: 'success',
        code: 'GET_LESSON_DETAIL_SUCCESS',
        message: 'Lấy chi tiết bài học thành công',
        data: lesson,
        trace_id: uuidv4()
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        code: 'LESSON_NOT_FOUND',
        message: error.message
      });
    }
  }

  createCourse = async (req, res, next) => {
    try {
      const { title } = req.body;
      const creatorId = req.user.id;

      // Kiểm tra trùng lặp
      const existingCourse = await require('../models/course.model').findOne({
        where: { title, teacher_id: creatorId }
      });

      if (existingCourse) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Khóa học với tiêu đề này đã tồn tại' 
        });
      }

      const course = await courseService.createCourse(creatorId, req.body);
      res.status(201).json({
        status: 'success',
        code: 'CREATE_COURSE_SUCCESS',
        message: 'Tạo khóa học thành công',
        data: course
      });
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req, res, next) => {
    try {
      const course = await courseRepository.update(req.params.id, req.body);
      res.json({
        status: 'success',
        data: course
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req, res, next) => {
    try {
      await courseRepository.delete(req.params.id);
      res.json({
        status: 'success',
        message: 'Course deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CourseController();
