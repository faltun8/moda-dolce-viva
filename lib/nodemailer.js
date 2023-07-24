const nodemailer = require('nodemailer');

const email = 'info@modadolceviva.pl';
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', // Replace with your email service provider's SMTP host
  port: 587, // Replace with the SMTP port (587 for TLS, 465 for SSL)
  secure: false, // True for 465, false for other ports
  auth: {
    user: 'info@modadolceviva.pl', // Replace with your email address
    pass: pass, // Replace with your email password
  },
});

export const mailOptions = {
  from: email,
  to: email,
};