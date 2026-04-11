const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const nodemailer = require('nodemailer');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
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

    // Send Email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
      });

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: `"HostelBloom Contact" <${process.env.EMAIL_USER}>`,
          to: 'farzain0.1n@gmail.com',
          subject: subject ? `Contact Form: ${subject}` : 'New Contact Form Submission',
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
      } else {
         console.warn("EMAIL_USER or EMAIL_PASS missing in .env. Skipping email sending.");
      }
    } catch (mailError) {
      console.error('Error sending email via nodemailer:', mailError);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
