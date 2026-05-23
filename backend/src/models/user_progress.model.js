const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_progress',
  timestamps: true,
  underscored: true
});

module.exports = UserProgress;
