import StatsStrip from '../components/StatsStrip';
import StoryTimeline from '../components/StoryTimeline';

const values = [
  {
    title: 'Carefully curated',
    detail: 'Every room card shares textures, aroma cues and policies so students feel informed before arrival.',
  },
  {
    title: 'Transparent operations',
    detail: 'Admins access real-time insights, nudges for maintenance and easy exports for compliance.',
  },
  {
    title: 'Human warmth',
    detail: 'Automations are paired with personal moments: handwritten welcomes, wellness reminders, cozy lighting.',
  },
];

function About() {
  return (
    <section className="section about">
      <div className="section__header">
        <h1>About HostelBloom</h1>
        <p>We craft thoughtful hostel tech that feels like a boutique stay while staying incredibly practical.</p>
      </div>

      <StatsStrip />

      <div className="grid grid--two">
        {values.map((value) => (
          <article key={value.title} className="card">
            <h3>{value.title}</h3>
            <p>{value.detail}</p>
          </article>
        ))}
      </div>

      <div className="section__header">
        <h2>Our timeline</h2>
        <p>Seven years of shaping calmer campus living, one shipping sprint at a time.</p>
      </div>
      <StoryTimeline />
    </section>
  );
}

export default About;
