require('dotenv').config();
const nodemailer = require('nodemailer');

// Crear transporter una sola vez
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailController = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html, // opcional
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmailController;
