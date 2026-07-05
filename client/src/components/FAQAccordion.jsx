import { useState } from 'react';

export default function FAQAccordion({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="faq-accordion">
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div className={`faq-item ${isOpen ? 'open' : ''}`} key={i}>
            <button className="faq-question" onClick={() => setOpenIdx(isOpen ? null : i)}>
              <span>{item.question}</span>
              <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="faq-answer">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
