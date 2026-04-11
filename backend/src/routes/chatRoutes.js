const express = require('express');
const router = express.Router();
const { generateResponse } = require('../services/aiService');

router.post('/', async (req, res, next) => {
  try {
    const { messages, query } = req.body;

    // Support legacy 'query' payload or new 'messages' array
    const chatHistory = messages || (query ? [{ role: 'user', content: query }] : null);

    if (!chatHistory || chatHistory.length === 0) {
      return res.status(400).json({ message: 'Conversation messages are required.' });
    }

    const reply = await generateResponse(chatHistory);

    res.json({ reply });
  } catch (error) {
    console.error('AI Service API Error:', error);
    res.status(500).json({ reply: 'Sorry, I am having trouble connecting right now.' });
  }
});

module.exports = router;
