import { useEffect, useState } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    async function fetchRooms() {
      try {
        const { data } = await api.get('/rooms');
        if (!ignore) {
          setRooms(data);
          setStatus({ loading: false, error: null });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            loading: false,
            error: error?.response?.data?.message || 'Unable to fetch rooms right now.',
          });
        }
      }
    }
    fetchRooms();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="section">
      <div className="section__header">
        <h2>Available rooms</h2>
        <p>Choose from curated rooms designed for calm, collaborative living.</p>
      </div>
      {status.loading && <p className="muted">Loading rooms...</p>}
      {status.error && <p className="error">{status.error}</p>}
      <div className="grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      {!status.loading && rooms.length === 0 && <p className="muted">No rooms available at the moment.</p>}
    </section>
  );
}

export default Rooms;
