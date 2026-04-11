const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and strictly constrained assistant for HostelBloom, a modern boutique hostel.
Your goal is to answer questions strictly about rooms, booking, facilities, policies, availability, pricing, and hostel support.
- Keep responses concise, friendly, and user-friendly. No long rambling.
- If the user asks about availability or booking a room, guide them warmly to use the "Rooms" or "Book" page on the website.
- If asked about pricing: Single is roughly 40-45 EUR/night, Double is 65-70 EUR, Suite is 95-130 EUR depending on exact room. Offer them to check the Rooms page for exact availability.
- Do NOT hallucinate. If you don't know something, honestly say "I don't have that information right now, please reach out to our front desk via the Contact page."
- Do not provide code or answer questions unrelated to HostelBloom. Address the previous messages contextually.`;

/**
 * Generate AI Response with Conversation History
 * @param {Array<{role: string, content: string}>} messages
 */
async function generateResponse(messages) {
  // If GROQ is available, default to it as requested
  if (process.env.GROQ_API_KEY) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant', 
      max_tokens: 400,
    });
    
    return chatCompletion.choices[0]?.message?.content || "I'm sorry, I encountered an issue.";
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_PROMPT
    });

    // Gemini API requires chat history formatted as: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const latestQuery = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latestQuery);
    return result.response.text();
  }

  throw new Error("No AI Provider configured. Please set GROQ_API_KEY or GEMINI_API_KEY.");
}

module.exports = {
  generateResponse,
};
