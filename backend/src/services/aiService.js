
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

  throw new Error("No AI Provider configured. Please set GROQ_API_KEY.");
}

module.exports = {
  generateResponse,
};
