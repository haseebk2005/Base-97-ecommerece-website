const { DataTypes } = require('sequelize');
const { sequelize }  = require('../config/db');
const User           = require('./User');

const AffiliateRequest = sequelize.define('AffiliateRequest', {
  id:           { type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true },
  userId:       { type: DataTypes.INTEGER,  allowNull: false },
  status:       { type: DataTypes.ENUM('Pending','Approved','Rejected'), defaultValue:'Pending' },
  affiliateCode:{ type: DataTypes.STRING(9), allowNull: true }
}, { timestamps: true });

AffiliateRequest.belongsTo(User, { foreignKey: 'userId' });
module.exports = AffiliateRequest;
