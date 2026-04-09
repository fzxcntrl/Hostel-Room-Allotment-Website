import PageWrapper from '../animations/PageWrapper';

const policies = [
  {
    title: 'Quiet hours',
    detail: 'Weeknights 10pm – 6am, weekends midnight – 7am. Acoustic sensors send gentle reminders before escalation.',
  },
  {
    title: 'Guest passes',
    detail: 'Residents receive four guest passes per month. Submit visitor IDs 24 hours prior for seamless entry.',
  },
  {
    title: 'Safety & security',
    detail: '24/7 concierge, biometric access, CCTV stored for 30 days, on-call counselors and paramedics.',
  },
  {
    title: 'Sustainability pledge',
    detail: 'Compost-first kitchens, refill stations, zero single-use plastics, and energy dashboards per floor.',
  },
  {
    title: 'Payments & refunds',
    detail: 'UPI, cards, or bank transfer. 100% refund up to 14 days before check-in; 50% refund up to 72 hours.',
  },
];

function Policies() {
  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h1>House policies</h1>
          <p>Designed to balance calm living, safety, and freedom for every resident.</p>
        </div>

        <div className="grid grid--two">
          {policies.map((policy) => (
            <article key={policy.title} className="card">
              <h3>{policy.title}</h3>
              <p>{policy.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

export default Policies;
