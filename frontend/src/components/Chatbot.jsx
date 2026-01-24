import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../services/api';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the HostelBloom assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { query: userMessage.content });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          zIndex: 9999
        }}>
          <button
            className="chatbot-toggle"
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: '50%', width: '56px', height: '56px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            aria-label="Open chat"
          >
            <MessageCircle size={28} />
          </button>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '4px 10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            Bloom AI Assistant
          </span>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window" style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '350px', height: '450px', backgroundColor: 'var(--card)',
          borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', zIndex: 10000, overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <div className="chatbot-header" style={{
            backgroundColor: 'var(--primary)', color: 'white',
            padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>HostelBloom Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages" style={{
            flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f9fafb'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                padding: '10px 14px', borderRadius: '12px',
                maxWidth: '80%', fontSize: '0.9rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: msg.role === 'user' ? 'none' : '1px solid #e5e7eb'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid #e5e7eb' }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{
            padding: '12px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: '8px', backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '10px', borderRadius: '6px',
                border: '1px solid var(--border)', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: '6px', padding: '10px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
