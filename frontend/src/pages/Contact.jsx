import { useState } from 'react';

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
  const [status, setStatus] = useState({ submitted: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus({ submitted: true });
    setForm(defaultForm);
  };

  return (
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
          {status.submitted && <p className="success">We received your note and will reply shortly.</p>}
          <label>
            Full name
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Subject
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required />
          </label>
          <label>
            Message
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} required />
          </label>
          <button className="btn btn--primary" type="submit">
            Send message
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
  );
}

export default Contact;
