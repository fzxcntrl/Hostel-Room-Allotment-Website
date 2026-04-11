const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

// Optional: verify connection at startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Error:', error);
    } else {
      console.log('SMTP Server is ready to take our messages');
    }
  });
}

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // 1. Debug: Log the incoming request to verify frontend passes data correctly
    console.log('Incoming Contact Request:', { name, email, subject, message });
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const db = getDb();
    await db.collection('messages').insertOne({
        name,
        email,
        subject,
        message,
        createdAt: new Date()
    });

    // 2. Email Sending Logic
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const info = await transporter.sendMail({
          from: `"HostelBloom Contact" <${process.env.EMAIL_USER}>`,
          to: 'farzain0.1n@gmail.com', // Recipient
          subject: subject ? `Contact Form: ${subject}` : 'New Contact Form Submission',
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          replyTo: email // Allows direct reply to sender
        });
        
        console.log('Email successfully dispatched:', info.response);
        return res.status(201).json({ success: true, message: 'Message sent and email delivered successfully.' });
      } catch (mailError) {
        console.error('Error sending email via nodemailer:', mailError);
        return res.status(500).json({ success: false, message: 'Message saved, but failed to send email.' });
      }
    } else {
       console.warn("EMAIL_USER or EMAIL_PASS missing in .env. Skipping email sending.");
       return res.status(201).json({ success: true, message: 'Message saved securely (Email skipped due to missing config).' });
    }

  } catch (error) {
    console.error('Server logic error in /contact:', error);
    next(error);
  }
});

module.exports = router;
