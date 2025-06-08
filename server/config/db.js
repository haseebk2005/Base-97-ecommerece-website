// // server/config/db.js

// const mysql = require('mysql2/promise');
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // —— DEBUG: print out what dotenv actually loaded ——
// console.log('→ [ENV] DB_HOST:', process.env.DB_HOST);
// console.log('→ [ENV] DB_NAME:', process.env.DB_NAME);
// console.log('→ [ENV] DB_USER:', process.env.DB_USER);
// console.log('→ [ENV] DB_PASS:', process.env.DB_PASS ? '••••••••' : undefined);

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false,
//   }
// );

// // …rest of db.js remains unchanged…


// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ MySQL Connected');
//   } catch (err) {
//     console.error('❌ MySQL connection error:', err);
//     process.exit(1);
//   }
// };

// module.exports = { sequelize, connectDB };
// server/config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// —— DEBUG: print out what dotenv actually loaded ——
console.log('→ [ENV] DB_HOST:', process.env.DB_HOST);
console.log('→ [ENV] DB_PORT:', process.env.DB_PORT);
console.log('→ [ENV] DB_NAME:', process.env.DB_NAME);
console.log('→ [ENV] DB_USER:', process.env.DB_USER);
console.log('→ [ENV] DB_PASS:', process.env.DB_PASS ? '••••••••' : undefined);

// Initialize Sequelize with port configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),  // ensure correct port
    dialect: 'mysql',
    logging: false,
  }
);

// Function to test and authenticate connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
