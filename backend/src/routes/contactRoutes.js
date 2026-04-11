const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const { sendContactEmail } = require('../utils/sendEmail');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
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

    const isSuccess = await sendContactEmail({ name, email, message });
    
    if (isSuccess) {
      return res.status(201).json({ success: true, message: 'Message sent and email delivered successfully.' });
    } else {
       return res.status(500).json({ success: false, message: 'Message saved, but failed to send email.' });
    }

  } catch (error) {
    console.error('Server logic error in /contact:', error);
    next(error);
  }
});

module.exports = router;
