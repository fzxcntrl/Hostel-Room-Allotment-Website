import { useState } from 'react';

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <article key={item.question} className={`accordion__item ${openIndex === index ? 'accordion__item--open' : ''}`}>
          <button className="accordion__trigger" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <span>{item.question}</span>
            <span>{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && <p className="accordion__content">{item.answer}</p>}
        </article>
      ))}
    </div>
  );
}

export default Accordion;
