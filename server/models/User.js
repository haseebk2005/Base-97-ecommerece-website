// server/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name:       { type: DataTypes.STRING, allowNull:false },
  email:      { type: DataTypes.STRING, allowNull:false, unique:true },
  password:   { type: DataTypes.STRING, allowNull:false },
  contact:   { type: DataTypes.STRING, allowNull:true },
  isAdmin:    { type: DataTypes.BOOLEAN, defaultValue:false }
}, {
  timestamps: true
});

module.exports = User;
