const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'questions',
  timestamps: true,
  underscored: true
});

module.exports = Question;
