import Accordion from '../components/Accordion';
import PageWrapper from '../animations/PageWrapper';

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

function FAQ() {
  return (
    <PageWrapper>
      <section className="section">
        <div className="section__header">
          <h1>Frequently asked questions</h1>
          <p>Quick answers for students, parents and admin teams exploring HostelBloom.</p>
        </div>
        <Accordion items={questions} />
      </section>
    </PageWrapper>
  );
}

export default FAQ;
