import StatsStrip from '../components/StatsStrip';
import StoryTimeline from '../components/StoryTimeline';
import Accordion from '../components/Accordion';
import PageWrapper from '../animations/PageWrapper';

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

const questions = [
  {
    question: 'Can I request a specific roommate?',
    answer: 'Yes. Mention it in the booking notes or email logistics@hostelbloom.com and we will pair you when beds are available.',
  },
  {
    question: 'How do cancellations work?',
    answer: 'Cancel from the booking history page up to 48 hours before check-in for an automatic refund/reschedule.',
  },
  {
    question: 'Do you support parents/guardians?',
    answer: 'Absolutely. We share guest passes, weekend schedules, and parental dashboards upon request.',
  },
  {
    question: 'Is HostelBloom accessible?',
    answer: 'We collaborate with architects to ensure lifts, tactile signage, adjustable desks and quiet floors are always available.',
  },
  {
    question: 'How secure is my data?',
    answer: 'Passwords are hashed using bcrypt, JWT tokens are signed, and API requests run over HTTPS in production.',
  },
];

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
    <PageWrapper>
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

        <div className="section__header" style={{ marginTop: '4rem' }}>
          <h2>Facilities & rituals</h2>
          <p>More than beds — HostelBloom pairs mindful spaces with tech so residents feel grounded.</p>
        </div>
        <div className="grid grid--two">
          {facilityList.map((facility) => (
            <article key={facility.title} className="card facility" style={{ border: '1px solid var(--border)' }}>
              <header>
                <h3>{facility.title}</h3>
                <p className="muted">{facility.description}</p>
              </header>
              <ul style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', listStyle: 'none', padding: 0, marginTop: '16px' }}>
                {facility.tags.map((tag) => (
                  <li key={tag} className="badge">{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="section__header" style={{ marginTop: '4rem' }}>
          <h2>Frequently asked questions</h2>
          <p>Quick answers for students, parents and admin teams exploring HostelBloom.</p>
        </div>
        <Accordion items={questions} />
      </section>
    </PageWrapper>
  );
}

export default About;
