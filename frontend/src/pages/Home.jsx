import { Link } from 'react-router-dom';
import StatsStrip from '../components/StatsStrip';

const highlights = [
  { title: 'Soft aesthetics', text: 'Warm palettes, rounded corners and calm typography welcome your guests.' },
  { title: 'Live availability', text: 'Powered by a lightweight API so students always see honest room updates.' },
  { title: 'Frictionless booking', text: 'Reserve a bed, share preferences and receive confirmation in moments.' },
];

const testimonials = [
  {
    quote: 'Students finally see exactly what a room feels like. Cancellations dropped 32% after switching.',
    author: 'Hostel Director, Pune',
  },
  {
    quote: 'Room allotment used to take days. HostelBloom sends confirmations in under five minutes.',
    author: 'Student Affairs Lead',
  },
];

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Boutique hostel management</p>
          <h1>Curate thoughtful stays for every student.</h1>
          <p className="lead">
            HostelBloom pairs a tasteful React experience with a pragmatic Node.js API so admins and residents stay in sync.
          </p>
          <div className="hero__cta">
            <Link to="/rooms" className="btn btn--primary">
              Explore rooms
            </Link>
            <Link to="/book" className="btn btn--ghost">
              Book a stay
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          {highlights.map((item) => (
            <div key={item.title} className="hero-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <StatsStrip />

      <section className="section">
        <div className="section__header">
          <h2>Stories from campus</h2>
          <p>Designed with students, facility teams and architects so every release feels human.</p>
        </div>
        <div className="grid grid--two">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="card testimonial">
              <p className="lead">“{testimonial.quote}”</p>
              <p className="muted">{testimonial.author}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
