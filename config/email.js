const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: String(process.env.SMTP_PORT) === '465', // auto secure detection
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Render an EJS template file from the views directory
 * @param {string} templateName - file name inside /views (e.g., 'singup.ejs')
 * @param {object} data - data to interpolate into template
 * @returns {Promise<string>} compiled HTML
 */
async function renderTemplate(templateName, data = {}) {
  const templatePath = path.join(__dirname, '..', 'views', templateName);
  const templateContent = await fs.promises.readFile(templatePath, 'utf8');
  return ejs.render(templateContent, data, { async: false });
}

/**
 * Send email with optional HTML template.
 * If html is not provided but template is, the template will be rendered.
 * Falls back to plain text.
 */
async function sendEmail(to, subject, text, { template, data } = {}) {
  let html = undefined;
  if (template) {
    try {
      html = await renderTemplate(template, data);
    } catch (err) {
      console.error('Template render error:', err.message);
    }
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: text || ' ',
    html
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
