// server/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const EXCHANGE_RATE_USD_TO_PKR = 280;

const Order = sequelize.define('Order', {
  shippingAddress:   { type: DataTypes.JSON, allowNull: false },
  paymentMethod:     { type: DataTypes.STRING, allowNull: false },
  itemsPrice:        { type: DataTypes.FLOAT, allowNull: false },
  shippingPrice:     { type: DataTypes.FLOAT, allowNull: false },
  totalPrice:        { type: DataTypes.FLOAT, allowNull: false },
  isPaid:            { type: DataTypes.BOOLEAN, defaultValue: false },
  paidAt:            { type: DataTypes.DATE },
  isDelivered:       { type: DataTypes.BOOLEAN, defaultValue: false },
  deliveredAt:       { type: DataTypes.DATE },
  affiliateCodeUsed: { type: DataTypes.STRING(9), allowNull: true },
  affiliateOwnerId:  { type: DataTypes.INTEGER, allowNull: true },
  paymentResult:     { type: DataTypes.JSON },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Dispatched','Delivered', 'Cancelled'),
    defaultValue: 'Pending'
  }
}, {
  timestamps: true
});

// 👇 Define with aliases
Order.belongsTo(User, { foreignKey: 'userId', as: 'User', onDelete: 'SET NULL' });
User.hasMany(Order,  { foreignKey: 'userId', as: 'Orders', onDelete: 'SET NULL' });

module.exports = Order;
