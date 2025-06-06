// server/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const sendEmail = require('../utils/email');

const generateToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  const { name, email,contact, password } = req.body;

  // Check for existing user
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Hash and create
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    contact,
    password: hashed
  });

  // Send welcome email
  try {
    await sendEmail({
      to: user.email,
subject: '🌟 Welcome to BASE 97 – Your Journey Begins',
html: `
<div style="background-color: #0f172a; padding: 32px; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; max-width: 600px; margin: 0 auto; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
      <path d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h1 style="color: #7dd3fc; font-size: 28px; margin-bottom: 8px; margin-top: 16px; letter-spacing: -0.5px;">Welcome to BASE 97</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 16px;">Where premium quality meets exceptional service</p>
  </div>

  <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; margin-bottom: 24px; line-height: 1.6;">
    <p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
    <p style="font-size: 16px;">Thank you for joining the BASE 97 community. We're thrilled to have you on board and can't wait to serve you.</p>
    
    <div style="background-color: #0f172a; border-left: 3px solid #7dd3fc; padding: 16px; margin: 24px 0; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-style: italic; color: #94a3b8;">"The first step to getting what you want is becoming part of something exceptional."</p>
    </div>

    <div style="display: flex; justify-content: center; margin: 28px 0;">
      <a href="https://base97.com/shop" style="background-color: #7dd3fc; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; display: inline-block;">Explore Our Collection</a>
    </div>

    <p style="font-size: 16px;">As a new member, you'll enjoy:</p>
    <ul style="padding-left: 20px; margin: 16px 0; font-size: 15px;">
      <li style="margin-bottom: 8px;">Exclusive first-order discounts</li>
      <li style="margin-bottom: 8px;">Priority customer support</li>
      <li style="margin-bottom: 8px;">Early access to new arrivals</li>
    </ul>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 14px; line-height: 1.5;">
    <p>Need help? Our support team is available at<br><a href="mailto:support@base97.com" style="color: #7dd3fc; text-decoration: none; font-weight: 500;">support@base97.com</a></p>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b;">
      <p style="margin: 0;">© ${new Date().getFullYear()} BASE 97. All rights reserved.</p>
      <p style="margin: 8px 0 0 0;">Follow us: [Social Icons]</p>
    </div>
  </div>
</div>
`
    });
  } catch (err) {
    console.error('Error sending welcome email:', err);
  }

  // Respond with token
  res.status(201).json({
    id:      user.id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user.id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Respond with token
  res.json({
    id:      user.id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user.id)
  });
};
