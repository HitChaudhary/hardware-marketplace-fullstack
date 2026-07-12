import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent — we'll get back to you within 24 hours", 'success');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className="sec a3">
      {/* Dynamic responsive styles injected directly for ease of integration */}
      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .contact-map-placeholder {
          grid-column: 1 / -1;
          position: relative;
          width: 100%;
          padding-top: 40%; /* Maintains a wide aspect ratio on desktop */
          min-height: 300px;
          border-radius: 8px;
          overflow: hidden;
        }

        .contact-map-placeholder iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
        }

        .checkout-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        /* Mobile Responsive Breakpoint */
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr; /* Stacks form and info cards vertically */
            gap: 16px;
          }

          .contact-map-placeholder {
            padding-top: 56.25%; /* 16:9 Aspect ratio better suited for mobile screens */
            min-height: 250px;
          }

          .checkout-form-grid {
            grid-template-columns: 1fr; /* Inputs stack vertically instead of side-by-side */
          }
        }
      `}</style>

      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      <div className="sec-head">
        <h3 className="sec-title">Contact Us</h3>
      </div>

      <div className="contact-layout">
        <div className="contact-map-placeholder">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235014.29918781322!2d72.41493017951211!3d23.02015808459388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1783859779926!5m2!1sen!2sin"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>

        <div className="dashboard-card">
          <h4>Send us a message</h4>
          <form className="checkout-form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ gridColumn: '1 / -1', minHeight: 120, resize: 'vertical' }}
              required
            />
            <button type="submit" className="ncall" style={{ animation: 'none', gridColumn: '1 / -1', justifyContent: 'center' }}>
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info-grid">
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h4>Phone</h4>
            <p>+91 63538 99466</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✉️</div>
            <h4>Email</h4>
            <p>support@akcomputersolutions.in</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕐</div>
            <h4>Working Hours</h4>
            <p>Mon–Sat, 10:00 AM – 8:00 PM</p>
          </div>
        </div>
      </div>
    </main>
  );
}