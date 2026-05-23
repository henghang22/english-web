const { UserProgress, Lesson, Course } = require('../models');

exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { isCompleted } = req.body;
    const userId = req.user.id;

    // Lấy thông tin bài học để biết thuộc khóa học nào
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: 'error', message: 'Bài học không tồn tại' });
    }

    const courseId = lesson.course_id;

    // Tìm hoặc tạo tiến độ
    let progress = await UserProgress.findOne({
      where: { user_id: userId, lesson_id: lessonId }
    });

    if (progress) {
      progress.is_completed = isCompleted !== undefined ? isCompleted : true;
      progress.last_accessed_at = new Date();
      await progress.save();
    } else {
      progress = await UserProgress.create({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        is_completed: isCompleted !== undefined ? isCompleted : true,
        last_accessed_at: new Date()
      });
    }

    res.json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progress = await UserProgress.findAll({
      where: { user_id: userId, course_id: courseId }
    });

    res.json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

exports.getResumeInfo = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Lấy bài học gần nhất mà user truy cập trong khóa học này
    const lastProgress = await UserProgress.findOne({
      where: { user_id: userId, course_id: courseId },
      order: [['last_accessed_at', 'DESC']],
      include: [{ model: Lesson, as: 'lesson' }]
    });

    res.json({
      status: 'success',
      data: lastProgress
    });
  } catch (error) {
    next(error);
  }
};
