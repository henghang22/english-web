const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  underscored: true
});

module.exports = Lesson;
