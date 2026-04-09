const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// genAI will be instantiated inside the route to prevent top-level crashes if API key is missing

router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ reply: 'Chatbot is currently down (missing API Key).' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: "You are a helpful assistant for HostelBloom, a modern boutique hostel management system. Keep your answers concise, friendly, and helpful. You help with room availability, pricing, and booking help."
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ reply: 'Sorry, I am having trouble connecting right now.' });
  }
});

module.exports = router;
