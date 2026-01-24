import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../animations/PageWrapper';

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
        const { data } = await api.get(`/bookings/user/${user.id || user._id}`);
        if (!ignore && data.success) {
          setBookings(data.data);
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
      setBookings((prev) => prev.map((booking) => ((booking._id || booking.id) === bookingId ? { ...booking, status: 'Cancelled' } : booking)));
      toast.success('Booking cancelled successfully.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to cancel booking.');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <section className="section">
          <div className="section__header">
            <h2>Your stays</h2>
            <p>Please log in to view confirmations and digital receipts.</p>
          </div>
          <Link to="/login" className="btn btn--primary">
            Login
          </Link>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h2>Booking history</h2>
          <p>Track confirmations, download proofs and manage cancellations.</p>
        </div>

        {status.loading && <p className="muted">Loading your bookings...</p>}
        {status.error && <p className="error">{status.error}</p>}

        <div className="grid">
          {bookings.map((booking) => (
            <article key={booking._id || booking.id} className="card">
              <header className="booking-card__header">
                <div>
                  <h3>{booking.roomId?.name || `Room ${booking.roomId?.roomNumber}`}</h3>
                  <p className="muted">{booking.roomId?.type}</p>
                </div>
                <span className={`badge badge--${(booking.status || 'Confirmed').toLowerCase()}`}>{(booking.status || 'Confirmed')}</span>
              </header>
              <dl className="booking-card__details">
                <div>
                  <dt>Check-in</dt>
                  <dd>{new Date(booking.date).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>${booking.roomId?.price}</dd>
                </div>
              </dl>
              {booking.status !== 'Cancelled' && (
                <button className="btn btn--outline" onClick={() => handleCancel(booking._id || booking.id)}>
                  Cancel booking
                </button>
              )}
            </article>
          ))}
        </div>

        {!status.loading && bookings.length === 0 && <p className="muted">No bookings yet. Reserve your first stay!</p>}
      </section>
    </PageWrapper>
  );
}

export default BookingHistory;
