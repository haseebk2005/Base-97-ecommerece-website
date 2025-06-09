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

// server/config/db.js

const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// —— DEBUG: print out what dotenv actually loaded ——
console.log('→ [ENV] DB_HOST:', process.env.DB_HOST);
console.log('→ [ENV] DB_PORT:', process.env.DB_PORT);
console.log('→ [ENV] DB_NAME:', process.env.DB_NAME);
console.log('→ [ENV] DB_USER:', process.env.DB_USER);
console.log('→ [ENV] DB_PASS:', process.env.DB_PASS ? '••••••••' : undefined);

/**
 * Ensure the target database exists.
 * Connects as root (or your DB_USER) without specifying a DB,
 * then runs CREATE DATABASE IF NOT EXISTS.
 */
async function ensureDatabase() {
  // 1) Connect to the server (no database selected)
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  // 2) Create the database if it doesn't exist
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  console.log(`✅ Ensured database "${process.env.DB_NAME}" exists`);

  // 3) Close the admin connection
  await conn.end();
}

// 4) Instantiate Sequelize (no connection yet)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);

/**
 * Call this on app startup.
 *  - First ensures the DB exists
 *  - Then authenticates via Sequelize
 */
const connectDB = async () => {
  try {
    // Bootstrap the database
    await ensureDatabase();

    // Now connect with Sequelize
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');

    // OPTIONAL: sync all models
    // await sequelize.sync({ alter: true });
    // console.log('✅ Sequelize models synced');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
