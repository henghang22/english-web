const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizResult = sequelize.define('QuizResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correct_answers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answers_data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Lưu chi tiết các đáp án học viên đã chọn'
  }
}, {
  tableName: 'quiz_results',
  timestamps: true,
  underscored: true
});

module.exports = QuizResult;
