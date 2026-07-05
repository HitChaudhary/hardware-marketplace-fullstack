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
      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      <div className="sec-head">
        <h3 className="sec-title">Contact Us</h3>
      </div>

      <div className="contact-layout">
        <div className="contact-map-placeholder">
          <span>🗺️</span>
          <p>Map placeholder — store location goes here</p>
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
