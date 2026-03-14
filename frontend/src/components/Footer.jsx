import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer" style={{ padding: '4rem 2rem', background: 'var(--card)', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
      <div className="grid grid--two" style={{ maxWidth: '1200px', margin: '0 auto', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>HostelBloom</h3>
          <p className="muted" style={{ maxWidth: '300px' }}>Crafted with care for modern campus living. Bringing mindful spaces and technology together.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="#" style={{ color: 'var(--text)' }}>Twitter</a>
            <a href="#" style={{ color: 'var(--text)' }}>Instagram</a>
            <a href="#" style={{ color: 'var(--text)' }}>LinkedIn</a>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div>
             <h4 style={{ marginBottom: '1rem' }}>Support</h4>
             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/policies">Policies</Link></li>
              <li><Link to="/history">Bookings</Link></li>
             </ul>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '3rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
         <p className="muted">© {new Date().getFullYear()} HostelBloom. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
