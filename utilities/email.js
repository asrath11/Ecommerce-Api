const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'Your Name <your-email@example.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response); // Debug log
  } catch (error) {
    console.error('Error sending email: ', error); // Debug log
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
