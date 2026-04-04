import { useRef } from 'react';
import { FiUsers, FiWifi } from 'react-icons/fi';
import { animateCardHover, animateCardLeave } from '../animations/microInteractions';

function RoomCard({ room, onSelect, isSelected }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const cover =
    room.photoUrl ||
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80';
    
  return (
    <article 
      ref={cardRef}
      className={`room-card ${isSelected ? 'room-card--selected' : ''}`}
      onMouseEnter={() => animateCardHover(cardRef.current, imgRef.current)}
      onMouseLeave={() => animateCardLeave(cardRef.current, imgRef.current)}
    >
      <div style={{ overflow: 'hidden' }}>
        <div ref={imgRef} className="room-card__image" style={{ backgroundImage: `url(${cover})`, transformOrigin: 'center' }} />
      </div>
      <div className="room-card__body">
        <div className="room-card__header">
          <h3>{room.name || `Room ${room.roomNumber}`}</h3>
          <span className="badge">{room.type}</span>
        </div>
        <p className="room-card__description">{room.description}</p>
        <ul className="room-card__meta">
          <li>
            <FiUsers /> {room.capacity || 1} guests
          </li>
          <li>
            <FiWifi /> {(room.amenities || ['WiFi']).slice(0, 2).join(' · ')}
          </li>
          <li>{(room.rating || 4.5).toFixed?.(1) || room.rating}/5</li>
        </ul>
        <div className="room-card__footer">
          <p className="price">₹{room.price * 85}/night</p>
          {onSelect && (
            <button className="btn btn--outline" onClick={() => onSelect(room)}>
              {isSelected ? 'Selected' : 'Select'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default RoomCard;
