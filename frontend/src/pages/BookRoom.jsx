import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookRoom() {
  const { isAuthenticated, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: '',
  });
  const [status, setStatus] = useState({ loadingRooms: true, submitting: false, error: null, success: null });

  useEffect(() => {
    let ignore = false;
    async function fetchAvailableRooms() {
      try {
        const { data } = await api.get('/rooms/available');
        if (!ignore) {
          setRooms(data);
          setStatus((prev) => ({ ...prev, loadingRooms: false, error: null }));
        }
      } catch (error) {
        if (!ignore) {
          setStatus((prev) => ({
            ...prev,
            loadingRooms: false,
            error: error?.response?.data?.message || 'Unable to load rooms right now.',
            success: null,
          }));
        }
      }
    }

    fetchAvailableRooms();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRoom) {
      setStatus((prev) => ({ ...prev, error: 'Please select a room first.' }));
      return;
    }

    setStatus((prev) => ({ ...prev, submitting: true, error: null, success: null }));

    try {
      const payload = {
        ...formData,
        guests: Number(formData.guests),
        roomId: selectedRoom.id,
        userId: user.id,
      };
      const { data } = await api.post('/bookings', payload);
      setStatus((prev) => ({ ...prev, submitting: false, error: null, success: data.message }));
      setRooms((prev) => prev.filter((room) => room.id !== selectedRoom.id));
      setFormData({ checkIn: '', checkOut: '', guests: 1, notes: '' });
      setSelectedRoom(null);
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        submitting: false,
        success: null,
        error: error?.response?.data?.message || 'Booking failed. Please try again.',
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section">
        <div className="section__header">
          <h2>Book a stay</h2>
          <p>Please log in so we can attach the reservation to your profile.</p>
        </div>
        <p>
          <Link to="/login" className="btn btn--primary">
            Go to login
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section__header">
        <h2>Reserve your sanctuary</h2>
        <p>Select a room, choose your dates and we will handle the rest.</p>
      </div>

      {status.error && <p className="error">{status.error}</p>}
      {status.success && <p className="success">{status.success}</p>}

      {status.loadingRooms && <p className="muted">Loading rooms...</p>}

      <div className="grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onSelect={setSelectedRoom}
            isSelected={selectedRoom?.id === room.id}
          />
        ))}
      </div>
      {!status.loadingRooms && rooms.length === 0 && <p className="muted">All rooms are currently booked.</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="checkIn">Check-in</label>
          <input type="date" id="checkIn" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
        </div>
        <div className="form__group">
          <label htmlFor="checkOut">Check-out</label>
          <input type="date" id="checkOut" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
        </div>
        <div className="form__group">
          <label htmlFor="guests">Guests</label>
          <input type="number" id="guests" min="1" max="3" name="guests" value={formData.guests} onChange={handleChange} />
        </div>
        <div className="form__group">
          <label htmlFor="notes">Preferences</label>
          <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Soft bedding, window seat, dietary notes..." />
        </div>
        <button className="btn btn--primary" type="submit" disabled={status.submitting}>
          {status.submitting ? 'Processing...' : 'Confirm booking'}
        </button>
      </form>
    </section>
  );
}

export default BookRoom;
