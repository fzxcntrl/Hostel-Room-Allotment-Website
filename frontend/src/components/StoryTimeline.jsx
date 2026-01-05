const milestones = [
  {
    year: '2018',
    title: 'Idea is born',
    detail: 'We mapped the pains of manual allotment and began sketching a calmer digital experience.',
  },
  {
    year: '2020',
    title: 'Pilot launch',
    detail: 'First deployment across two campus hostels, introducing instant confirmations + waitlists.',
  },
  {
    year: '2023',
    title: 'Hybrid rooms',
    detail: 'Added flexible suites, seasonal pricing and richer amenity tagging for admins.',
  },
  {
    year: '2025',
    title: 'Design refresh',
    detail: 'Reimagined HostelBloom with a boutique aesthetic and API-first backend you see today.',
  },
];

function StoryTimeline() {
  return (
    <div className="timeline">
      {milestones.map((item) => (
        <article key={item.year} className="timeline__item">
          <span className="timeline__year">{item.year}</span>
          <h4>{item.title}</h4>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export default StoryTimeline;
