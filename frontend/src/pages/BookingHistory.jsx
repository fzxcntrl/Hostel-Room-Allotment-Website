import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookingHistory() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    let ignore = false;
    async function fetchBookings() {
      try {
        const { data } = await api.get(`/bookings/user/${user.id}`);
        if (!ignore) {
          setBookings(data);
          setStatus({ loading: false, error: null });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ loading: false, error: 'Unable to load bookings right now.' });
        }
      }
    }

    fetchBookings();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user]);

  const handleCancel = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking)));
    } catch (error) {
      alert(error?.response?.data?.message || 'Unable to cancel booking.');
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section">
        <div className="section__header">
          <h2>Your stays</h2>
          <p>Please log in to view confirmations and digital receipts.</p>
        </div>
        <Link to="/login" className="btn btn--primary">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section__header">
        <h2>Booking history</h2>
        <p>Track confirmations, download proofs and manage cancellations.</p>
      </div>

      {status.loading && <p className="muted">Loading your bookings...</p>}
      {status.error && <p className="error">{status.error}</p>}

      <div className="grid">
        {bookings.map((booking) => (
          <article key={booking.id} className="card">
            <header className="booking-card__header">
              <div>
                <h3>{booking.room?.name}</h3>
                <p className="muted">{booking.room?.type}</p>
              </div>
              <span className={`badge badge--${booking.status.toLowerCase()}`}>{booking.status}</span>
            </header>
            <dl className="booking-card__details">
              <div>
                <dt>Check-in</dt>
                <dd>{booking.checkIn}</dd>
              </div>
              <div>
                <dt>Check-out</dt>
                <dd>{booking.checkOut}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{booking.guests}</dd>
              </div>
            </dl>
            {booking.status !== 'Cancelled' && (
              <button className="btn btn--outline" onClick={() => handleCancel(booking.id)}>
                Cancel booking
              </button>
            )}
          </article>
        ))}
      </div>

      {!status.loading && bookings.length === 0 && <p className="muted">No bookings yet. Reserve your first stay!</p>}
    </section>
  );
}

export default BookingHistory;
