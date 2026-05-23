const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  time_limit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 15
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  underscored: true
});

module.exports = Quiz;
