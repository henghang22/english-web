const User = require('./user.model');
const Course = require('./course.model');
const Lesson = require('./lesson.model');
const Quiz = require('./quiz.model');
const Question = require('./question.model');
const Answer = require('./answer.model');
const QuizResult = require('./quiz_result.model');
const ChatMessage = require('./chat_message.model');
const UserProgress = require('./user_progress.model');

// Define Associations

// User - Course (Creator)
User.hasMany(Course, { foreignKey: 'teacher_id', as: 'managedCourses' });
Course.belongsTo(User, { foreignKey: 'teacher_id', as: 'creator' });

// Course - Lesson (One-to-Many)
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Lesson - Quiz (One-to-One or One-to-Many)
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id', as: 'quizzes' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

// Course - Quiz (One-to-Many for final exam)
Course.hasMany(Quiz, { foreignKey: 'course_id', as: 'quizzes' });
Quiz.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Quiz - Question (One-to-Many)
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Question - Answer (One-to-Many)
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// QuizResult associations
User.hasMany(QuizResult, { foreignKey: 'user_id', as: 'quiz_results' });
QuizResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Quiz.hasMany(QuizResult, { foreignKey: 'quiz_id', as: 'results' });
QuizResult.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// ChatMessage associations
User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'chat_messages' });
ChatMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// UserProgress associations
User.hasMany(UserProgress, { foreignKey: 'user_id', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(UserProgress, { foreignKey: 'course_id', as: 'user_progress' });
UserProgress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Lesson.hasMany(UserProgress, { foreignKey: 'lesson_id', as: 'user_progress' });
UserProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

module.exports = {
  User,
  Course,
  Lesson,
  Quiz,
  Question,
  Answer,
  QuizResult,
  ChatMessage,
  UserProgress
};
