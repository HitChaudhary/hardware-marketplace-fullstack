import Breadcrumb from '../components/Breadcrumb';
import FeatureCard from '../components/FeatureCard';
import { useToast } from '../context/ToastContext';

const SERVICES = [
  { icon: '💻', title: 'PC Repair', description: 'Diagnostics, hardware repair, and performance tune-ups for desktops.' },
  { icon: '🛠️', title: 'Laptop Repair', description: 'Screen, keyboard, battery, and motherboard-level laptop repairs.' },
  { icon: '🖥️', title: 'Custom PC Build', description: 'Tell us your budget and use-case — we configure and assemble it.' },
  { icon: '📋', title: 'AMC Plans', description: 'Annual maintenance contracts for homes and small offices.' },
  { icon: '🌐', title: 'Networking', description: 'Wi-Fi setup, structured cabling, and small office network configuration.' },
  { icon: '🧹', title: 'Data Recovery', description: 'Recovery support for accidentally deleted or corrupted drives.' },
];

export default function ServicesPage() {
  const { showToast } = useToast();

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Services' }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">Our Services</h3>
          <div className="sec-sub">Beyond selling hardware — we keep it running</div>
        </div>
      </div>

      <div className="feature-grid">
        {SERVICES.map((s) => (
          <FeatureCard key={s.title} {...s} />
        ))}
      </div>

      <div className="dashboard-card" style={{ marginTop: 32, textAlign: 'center' }}>
        <h4>Need a service visit?</h4>
        <p>Call us or send a message and we'll schedule a technician.</p>
        <button className="ncall" style={{ animation: 'none', margin: '16px auto 0' }} onClick={() => showToast('Service request submitted (demo)', 'success')}>
          Book a Service
        </button>
      </div>
    </main>
  );
}
