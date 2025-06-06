// server/models/OrderItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Order   = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  qty:   { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT,   allowNull: false },
  size:  { type: DataTypes.STRING,  allowNull: true, defaultValue: '' }
}, {
  timestamps: false
});

// Associations with aliases
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'Product',
  onDelete: 'SET NULL',
});
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'OrderItems',
  onDelete: 'SET NULL',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'Order',
  onDelete: 'SET NULL',
});
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'OrderItems',
  onDelete: 'SET NULL',
});

module.exports = OrderItem;
