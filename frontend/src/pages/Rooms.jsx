import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import PageWrapper from '../animations/PageWrapper';

const SkeletonRoomCard = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
    <div style={{ height: '200px', backgroundColor: '#e5e7eb', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ height: '24px', width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ height: '16px', width: '40%', backgroundColor: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ height: '16px', width: '80%', backgroundColor: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
  </div>
);

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    async function fetchRooms() {
      try {
        const { data } = await api.get('/rooms');
        if (!ignore && data.success) {
          setRooms(data.data);
          setStatus({ loading: false, error: null });
        }
      } catch (error) {
        if (!ignore) {
          const errMsg = error?.response?.data?.message || 'Unable to fetch rooms right now.';
          setStatus({ loading: false, error: errMsg });
          toast.error(errMsg);
        }
      }
    }
    fetchRooms();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <PageWrapper>
      <section className="section">
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: .5; }
              100% { opacity: 1; }
            }
          `}
        </style>
        <div className="section__header">
          <h2>Available rooms</h2>
          <p>Choose from curated rooms designed for calm, collaborative living.</p>
        </div>
        {status.error && <p className="error">{status.error}</p>}
        <div className="grid">
          {status.loading 
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRoomCard key={i} />)
            : rooms.map((room) => <RoomCard key={room._id || room.id} room={room} />)
          }
        </div>
        {!status.loading && rooms.length === 0 && <p className="muted">No rooms available at the moment.</p>}
      </section>
    </PageWrapper>
  );
}

export default Rooms;
