const nodemailer = require("nodemailer");
const logger = require("../config/logger"); // ✅ FIXED

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendNotificationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Email send error: ${error.message}`);
  }
};

module.exports = { sendNotificationEmail };
