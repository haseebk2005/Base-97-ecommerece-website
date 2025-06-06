// server/utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host:     process.env.EMAIL_HOST,
  port:     Number(process.env.EMAIL_PORT),
  secure:   process.env.EMAIL_PORT == '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"BASE 97 Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
  console.log(`✉️  Email sent: ${info.messageId} to ${to}`);
}

module.exports = sendEmail;
