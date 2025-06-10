// server/seedAdmin.js

require('dotenv').config();
const bcrypt  = require('bcryptjs');
const { sequelize } = require('./config/db');
const User    = require('./models/User');

module.exports = async function seedAdmin() {
  try {
    // Ensure DB connection
    await sequelize.authenticate();
    const ADMIN_PASS = process.env.ADMIN_PASS;
    if (!ADMIN_PASS) {
      throw new Error('Please set ADMIN_PASS in your environment');
    }
    // Hash your chosen admin password
    const passwordHash = await bcrypt.hash(ADMIN_PASS, 10);

    // Find or create the admin user
    const [user, created] = await User.findOrCreate({
      where: { email: 'khanmuhammadabdulhaseeb@gmail.com' },
      defaults: {
        name:    'Haseeb Khan',
        password: passwordHash,
        contact:'123',
        isAdmin:  true
      }
    });

    console.log(created 
      ? '✅ Admin user created' 
      : 'ℹ️  Admin user already exists');
  } catch (err) {
    console.error('🔴 seedAdmin error:', err);
    throw err;
  }
};
