// server/models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price:       { type: DataTypes.FLOAT, allowNull: false },
  image:       { type: DataTypes.STRING },
  category:    { type: DataTypes.STRING },
  sizes:       { 
    type: DataTypes.JSON,    // store an array of strings
    allowNull: false,
    defaultValue: []
  },
  countInStock:{ type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  timestamps: true
});

module.exports = Product;
