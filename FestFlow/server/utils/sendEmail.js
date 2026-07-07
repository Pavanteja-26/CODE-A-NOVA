const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If no credentials, just log
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Nodemailer credentials not found in .env. Skipping email sending.');
    console.log('Email intended for:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another service if not using gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'FestFlow'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
