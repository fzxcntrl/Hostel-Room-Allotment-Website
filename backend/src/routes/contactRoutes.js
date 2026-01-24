const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');

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

    res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
