import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { animateCountUp } from '../animations/microInteractions';

function StatsStrip() {
  const [stats, setStats] = useState(null);
  const numbersRef = useRef([]);

  useEffect(() => {
    let ignore = false;
    async function fetchStats() {
      try {
        const { data } = await api.get('/insights');
        if (!ignore && data.success) {
          setStats(data.data);
        }
      } catch (err) {
        // ignoring the error silently as requested
      }
    }

    fetchStats();
    return () => {
      ignore = true;
    };
  }, []);
  
  useEffect(() => {
     if (stats && numbersRef.current.length > 0) {
         // Filter out null refs before passing
         const validRefs = numbersRef.current.filter(el => el !== null);
         if (validRefs.length > 0) {
             animateCountUp(validRefs);
         }
     }
  }, [stats]);

  const items = stats
    ? [
        { label: 'Total beds', value: stats.totals.rooms },
        { label: 'Open rooms', value: stats.totals.availableRooms },
        { label: 'Residents', value: stats.totals.users },
        { label: 'Occupancy', value: stats.occupancyRate, suffix: '%' },
      ]
    : [
        { label: 'Total beds', value: 0 },
        { label: 'Open rooms', value: 0 },
        { label: 'Residents', value: 0 },
        { label: 'Occupancy', value: 0, suffix: '%' },
      ];

  return (
    <section className="stats-strip">
      {items.map((item, index) => (
        <div key={item.label} className="stats-strip__item">
          <p className="stats-strip__value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span 
               ref={el => numbersRef.current[index] = el}
               data-value={item.value}
            >
              0
            </span>
            {item.suffix && <span>{item.suffix}</span>}
          </p>
          <p className="stats-strip__label">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

export default StatsStrip;
