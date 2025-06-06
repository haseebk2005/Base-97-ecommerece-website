const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User          = require('./User');
const Product       = require('./Product');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT, allowNull: true
  }
}, {
  timestamps: true
});

Review.belongsTo(User,    { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Review;
