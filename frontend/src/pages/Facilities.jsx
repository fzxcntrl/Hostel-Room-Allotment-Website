const facilityList = [
  {
    title: 'Wellness corners',
    description: 'Meditation nooks, aromatherapy diffusers and daylight lamps to offset study fatigue.',
    tags: ['Meditation', 'Sunrise lamps', 'Green tea bar'],
  },
  {
    title: 'Makers kitchen',
    description: 'Shared kitchenette with smart induction tops, labeled storage and recipe screens.',
    tags: ['Induction stove', 'Snack hub', 'Compost bins'],
  },
  {
    title: 'Laundry atelier',
    description: 'App-connected washers, air-dry balconies and garment-care tutorials.',
    tags: ['Smart washers', 'Air dry', 'Steam press'],
  },
  {
    title: 'Community commons',
    description: 'Acoustic panels, projector wall, vinyl player and board games for slow evenings.',
    tags: ['Projector', 'Acoustic panels', 'Vinyl'],
  },
];

function Facilities() {
  return (
    <section className="section">
      <div className="section__header">
        <h1>Facilities & rituals</h1>
        <p>More than beds — HostelBloom pairs mindful spaces with tech so residents feel grounded.</p>
      </div>

      <div className="grid grid--two">
        {facilityList.map((facility) => (
          <article key={facility.title} className="card facility">
            <header>
              <h3>{facility.title}</h3>
              <p>{facility.description}</p>
            </header>
            <ul>
              {facility.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Facilities;
