import { useEffect, useState } from 'react';
import api from '../services/api';

function StatsStrip() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchStats() {
      try {
        const { data } = await api.get('/insights/overview');
        if (!ignore) {
          setStats(data);
        }
      } catch (err) {
        if (!ignore) {
          setError('Unable to load stats right now.');
        }
      }
    }

    fetchStats();
    return () => {
      ignore = true;
    };
  }, []);

  const items = stats
    ? [
        { label: 'Total beds', value: stats.totals.rooms },
        { label: 'Open rooms', value: stats.totals.availableRooms },
        { label: 'Residents', value: stats.totals.users },
        { label: 'Occupancy', value: `${stats.occupancyRate}%` },
      ]
    : [
        { label: 'Total beds', value: '—' },
        { label: 'Open rooms', value: '—' },
        { label: 'Residents', value: '—' },
        { label: 'Occupancy', value: '—' },
      ];

  return (
    <section className="stats-strip">
      {items.map((item) => (
        <div key={item.label} className="stats-strip__item">
          <p className="stats-strip__value">{item.value}</p>
          <p className="stats-strip__label">{item.label}</p>
        </div>
      ))}
      {error && <p className="error stats-strip__error">{error}</p>}
    </section>
  );
}

export default StatsStrip;
