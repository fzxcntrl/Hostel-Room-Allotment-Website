import { FiUsers, FiWifi } from 'react-icons/fi';

function RoomCard({ room, onSelect, isSelected }) {
  const cover =
    room.photoUrl ||
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80';
  return (
    <article className={`room-card ${isSelected ? 'room-card--selected' : ''}`}>
      <div className="room-card__image" style={{ backgroundImage: `url(${cover})` }} />
      <div className="room-card__body">
        <div className="room-card__header">
          <h3>{room.name}</h3>
          <span className="badge">{room.type}</span>
        </div>
        <p className="room-card__description">{room.description}</p>
        <ul className="room-card__meta">
          <li>
            <FiUsers /> {room.capacity} guests
          </li>
          <li>
            <FiWifi /> {(room.amenities || []).slice(0, 2).join(' · ')}
          </li>
          <li>{room.rating?.toFixed?.(1) || room.rating}/5</li>
        </ul>
        <div className="room-card__footer">
          <p className="price">${room.pricePerNight}/night</p>
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
