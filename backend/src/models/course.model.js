const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner'
  },
  duration: {
    type: DataTypes.INTEGER, // Phút hoặc Giờ
    defaultValue: 0
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

module.exports = Course;
