import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../animations/PageWrapper';

function BookRoom() {
  const { isAuthenticated, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    email: '',
    contactNumber: '',
    guests: 1,
    notes: '',
  });  
  const [status, setStatus] = useState({ loadingRooms: true, submitting: false, error: null });

  useEffect(() => {
    let ignore = false;
    async function fetchAvailableRooms() {
      try {
        const { data } = await api.get('/rooms/available');
        if (!ignore && data.success) {
          setRooms(data.data);
          setStatus((prev) => ({ ...prev, loadingRooms: false, error: null }));
        }
      } catch (error) {
        if (!ignore) {
          setStatus((prev) => ({
            ...prev,
            loadingRooms: false,
            error: error?.response?.data?.message || 'Unable to load rooms right now.',
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
      toast.error('Please select a room first.');
      return;
    }

    setStatus((prev) => ({ ...prev, submitting: true, error: null }));

    try {
      const payload = {
        ...formData,
        guests: Number(formData.guests),
        roomId: selectedRoom._id || selectedRoom.id,
        userId: user.id || user._id,
      };
      const { data } = await api.post('/bookings', payload);
      setStatus((prev) => ({ ...prev, submitting: false, error: null }));
      toast.success(data.message || 'Room booked successfully!');
      
      setRooms((prev) => prev.filter((room) => (room._id || room.id) !== (selectedRoom._id || selectedRoom.id)));
      setFormData({ checkIn: '', checkOut: '', guests: 1, notes: '' });
      setSelectedRoom(null);
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Booking failed. Please try again.';
      setStatus((prev) => ({
        ...prev,
        submitting: false,
        error: errMsg,
      }));
      toast.error(errMsg);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h2>Reserve your sanctuary</h2>
          <p>Select a room, choose your dates and we will handle the rest.</p>
        </div>

        {status.error && <p className="error">{status.error}</p>}

        {status.loadingRooms && <p className="muted">Loading rooms...</p>}

        <div className="grid">
          {rooms.map((room) => (
            <RoomCard
              key={room._id || room.id}
              room={room}
              onSelect={setSelectedRoom}
              isSelected={(selectedRoom?._id || selectedRoom?.id) === (room._id || room.id)}
            />
          ))}
        </div>
        {!status.loadingRooms && rooms.length === 0 && <p className="muted">All rooms are currently booked.</p>}

        <form className="card form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="checkIn">Check-in</label>
            <input type="date" id="checkIn" name="checkIn" value={formData.checkIn} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required disabled={status.submitting} />
          </div>
          <div className="form__group">
            <label htmlFor="checkOut">Check-out</label>
            <input 
              type="date" 
              id="checkOut" 
              name="checkOut" 
              value={formData.checkOut} 
              onChange={handleChange} 
              required 
              min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} 
              disabled={status.submitting || !formData.checkIn} 
            />
          </div>
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={status.submitting} placeholder="john@example.com" />
          </div>
          <div className="form__group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required disabled={status.submitting} placeholder="+1 ..." />
          </div>
          <div className="form__group">
            <label htmlFor="guests">Guests</label>
            <input type="number" id="guests" min="1" max="3" name="guests" value={formData.guests} onChange={handleChange} disabled={status.submitting} />
          </div>
          <div className="form__group">
            <label htmlFor="notes">Preferences</label>
            <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Soft bedding, window seat, dietary notes..." disabled={status.submitting} />
          </div>
          <button className="btn btn--primary" type="submit" disabled={status.submitting}>
            {status.submitting ? 'Processing...' : 'Confirm booking'}
          </button>
        </form>
      </section>
    </PageWrapper>
  );
}

export default BookRoom;
