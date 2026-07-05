import Breadcrumb from '../components/Breadcrumb';
import FAQAccordion from '../components/FAQAccordion';
import { faqs } from '../data/faqs';

export default function FAQPage() {
  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'FAQs' }]} />
      <div className="sec-head">
        <h3 className="sec-title">Frequently Asked Questions</h3>
      </div>
      <div style={{ maxWidth: 760 }}>
        <FAQAccordion items={faqs} />
      </div>
    </main>
  );
}
