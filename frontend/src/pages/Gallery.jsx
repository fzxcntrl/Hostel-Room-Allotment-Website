import PageWrapper from '../animations/PageWrapper';

const galleryItems = [
  {
    title: 'Sunrise suites',
    description: 'Warm amber lighting, sheer curtains and linen bedding for early risers.',
    photo: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Study pods',
    description: 'Acoustic panels, dual monitors and standing desks for deep work.',
    photo: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Community supper',
    description: 'Weekly plant-based dinners curated by resident chefs and local farms.',
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Wellness garden',
    description: 'Yoga deck, botanicals and hammocks stitched between teak pillars.',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
  },
];

function Gallery() {
  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h1>Gallery</h1>
          <p>Peek into the textures, lighting palettes and rituals shaping HostelBloom stays.</p>
        </div>

        <div className="grid gallery">
          {galleryItems.map((item) => (
            <figure key={item.title} className="gallery__item">
              <div className="gallery__image" style={{ backgroundImage: `url(${item.photo})` }} />
              <figcaption>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

export default Gallery;
