import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" onClick={closeMenu}>
          Hostel<span>Bloom</span>
        </Link>
      </div>
      <button className="navbar__toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        {open ? <FiX /> : <FiMenu />}
      </button>
      <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/rooms" onClick={closeMenu}>
          Rooms
        </NavLink>
        <NavLink to="/book" onClick={closeMenu}>
          Book
        </NavLink>
        <NavLink to="/facilities" onClick={closeMenu}>
          Facilities
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/gallery" onClick={closeMenu}>
          Gallery
        </NavLink>
        <NavLink to="/policies" onClick={closeMenu}>
          Policies
        </NavLink>
        <NavLink to="/faq" onClick={closeMenu}>
          FAQ
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/history" onClick={closeMenu}>
            History
          </NavLink>
        )}
        {isAuthenticated ? (
          <div className="navbar__auth">
            <span className="navbar__user">{user?.fullName?.split(' ')[0]}</span>
            <button className="btn btn--ghost" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar__auth">
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn--primary" onClick={closeMenu}>
              Join us
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
