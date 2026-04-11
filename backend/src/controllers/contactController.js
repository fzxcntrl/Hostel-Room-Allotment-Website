const { validationResult } = require('express-validator');
const { getDb } = require('../config/db');
const { sendContactEmail, sendContactAutoReplyEmail } = require('../utils/sendEmail');

async function submitContactForm(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;
    const db = getDb();

    const contactMessage = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : '',
      message: message.trim(),
      createdAt: new Date(),
    };

    console.log('Incoming Contact Request:', {
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
    });

    await db.collection('messages').insertOne(contactMessage);

    const adminEmailResult = await sendContactEmail(contactMessage);

    let userEmailResult = { success: false };
    if (adminEmailResult.success) {
      userEmailResult = await sendContactAutoReplyEmail(contactMessage);
    } else {
      console.error('Admin email failed:', adminEmailResult.message);
    }

    const bothEmailsSent = adminEmailResult.success && userEmailResult.success;

    return res.status(201).json({
      success: true,
      emailSent: bothEmailsSent,
      message: bothEmailsSent
        ? 'Message received successfully and forwarded to the admin inbox.'
        : 'Message recorded, but email service is currently unavailable.',
    });
  } catch (error) {
    console.error('Error while processing contact form:', error);
    next(error);
  }
}

module.exports = {
  submitContactForm,
};
