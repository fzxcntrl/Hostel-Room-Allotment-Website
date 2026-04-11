import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsStrip from '../components/StatsStrip';
import PageWrapper from '../animations/PageWrapper';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { animateHero, animateButtonHover, animateButtonLeave } from '../animations/microInteractions';

function LiveCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft < 0) {
    return <span className="badge">Checked-in today</span>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
      <div className="countdown-box"><h4>{days}</h4><small>Days</small></div>
      <div className="countdown-box"><h4>{hours}</h4><small>Hours</small></div>
      <div className="countdown-box"><h4>{mins}</h4><small>Mins</small></div>
      <div className="countdown-box"><h4>{secs}</h4><small>Secs</small></div>
    </div>
  );
}

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
  const contentRef = useRef(null);
  const ctaRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    animateHero(contentRef, ctaRef);

    if (isAuthenticated && user) {
      api.get(`/bookings/user/${user.id || user._id}`).then(res => {
         const now = new Date();
         now.setHours(0,0,0,0);
         const upcoming = res.data.data.find(b => b.status === 'Confirmed' && new Date(b.date) >= now);
         if(upcoming) setActiveBooking(upcoming);
      }).catch(err => console.error(err));
    }
  }, [isAuthenticated, user]);

  return (
    <PageWrapper>
      <section className="hero">
        <div className="hero__content" ref={contentRef} style={{ opacity: 0 }}>
          <p className="eyebrow">Boutique hostel management</p>
          <h1>Curate thoughtful stays for every student.</h1>
          <p className="lead">
            HostelBloom pairs a tasteful React experience with a pragmatic Node.js API so admins and residents stay in sync.
          </p>
          <div className="hero__cta" ref={ctaRef}>
            <Link 
              to="/rooms" 
              className="btn btn--primary"
              onMouseEnter={(e) => animateButtonHover(e.currentTarget)}
              onMouseLeave={(e) => animateButtonLeave(e.currentTarget)}
            >
              Explore rooms
            </Link>
            <Link 
              to="/book" 
              className="btn btn--ghost"
              onMouseEnter={(e) => animateButtonHover(e.currentTarget)}
              onMouseLeave={(e) => animateButtonLeave(e.currentTarget)}
            >
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

      {activeBooking && (
        <section className="section" style={{ padding: '2rem 1rem', background: 'var(--primary)', color: 'white' }}>
          <div className="section__header" style={{ marginBottom: 0 }}>
            <h2 style={{ color: 'white' }}>Your stay is confirmed!</h2>
            <p>Your upcoming stay at <strong style={{color:"white"}}>{activeBooking.roomId?.name || 'Room ' + activeBooking.roomId?.roomNumber}</strong> is blooming soon.</p>
            <LiveCountdown targetDate={new Date(activeBooking.date)} />
          </div>
        </section>
      )}

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
    </PageWrapper>
  );
}

export default Home;
