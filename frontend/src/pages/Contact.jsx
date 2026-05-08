import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageWrapper from '../animations/PageWrapper';
import { animateButtonHover, animateButtonLeave, animateInputFocus, animateInputBlur } from '../animations/microInteractions';
import { animate } from 'animejs';

const defaultForm = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

const contactCards = [
  { title: 'Front desk', info: '+91 98765 11223', hint: '7am – 11pm IST' },
  { title: 'Wellness team', info: 'wellness@hostelbloom.com', hint: 'Care circles & dorm rituals' },
  { title: 'Logistics', info: 'logistics@hostelbloom.com', hint: 'Move-ins, luggage, maintenance' },
];

function Contact() {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const submitBtnRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    
    // Simple pulsing animation while sending
    const loadingAnim = animate(submitBtnRef.current, {
      opacity: [1, 0.6],
      scale: [1, 0.98],
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine',
      duration: 600
    });

    try {
      const response = await api.post('/contact', {
        name: form.fullName,
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      
      if (response.data?.emailSent === false) {
        toast.success('Message saved to our system, though the email receipt failed to send.');
      } else {
        toast.success('We received your note and will reply shortly.');
      }
      setForm(defaultForm);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      loadingAnim.pause();
      // Reset button
      animate(submitBtnRef.current, { opacity: 1, scale: 1, duration: 300 });
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h1>Contact & concierge</h1>
          <p>We keep response times under 30 minutes. Send a note or drop by the studio lounge.</p>
        </div>

        <div className="grid grid--two">
          {contactCards.map((card) => (
            <article key={card.title} className="card">
              <h3>{card.title}</h3>
              <p className="lead">{card.info}</p>
              <p className="muted">{card.hint}</p>
            </article>
          ))}
        </div>

        <div className="grid grid--two contact">
          <form className="card form" onSubmit={handleSubmit}>
            <h3>Send us a message</h3>
            
            <label>
              Full name
              <input 
                type="text" name="fullName" value={form.fullName} onChange={handleChange} required disabled={submitting} 
                onFocus={(e) => animateInputFocus(e.target)} onBlur={(e) => animateInputBlur(e.target)}
              />
            </label>
            <label>
              Email
              <input 
                type="email" name="email" value={form.email} onChange={handleChange} required disabled={submitting} 
                onFocus={(e) => animateInputFocus(e.target)} onBlur={(e) => animateInputBlur(e.target)}
              />
            </label>
            <label>
              Subject
              <input 
                 type="text" name="subject" value={form.subject} onChange={handleChange} required disabled={submitting} 
                 onFocus={(e) => animateInputFocus(e.target)} onBlur={(e) => animateInputBlur(e.target)}
              />
            </label>
            <label>
              Message
              <textarea 
                 name="message" rows="4" value={form.message} onChange={handleChange} required disabled={submitting} 
                 onFocus={(e) => animateInputFocus(e.target)} onBlur={(e) => animateInputBlur(e.target)}
              />
            </label>
            <button 
              ref={submitBtnRef}
              className="btn btn--primary" 
              type="submit" 
              disabled={submitting}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget)}
              onMouseLeave={(e) => animateButtonLeave(e.currentTarget)}
            >
              {submitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
          <article className="card contact__map">
            <h3>Studio lounge</h3>
            <p className="muted">Visit the experience center for walkthrough demos and mock room setups.</p>
            <div className="contact__map-embed">
              <iframe
                title="HostelBloom map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1182.3091754440698!2d73.91040006511909!3d18.61214719151932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7b1fbd9b787%3A0x221bcf0e858ad2a1!2sYour%20space%20Students%20Hostel%20-%20Lohegaon%2C%20Pune!5e0!3m2!1sen!2sin!4v1764582343052!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Contact;
