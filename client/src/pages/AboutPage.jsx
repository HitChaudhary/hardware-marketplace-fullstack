import Breadcrumb from '../components/Breadcrumb';
import FeatureCard from '../components/FeatureCard';

const WHY_US = [
  { icon: '✅', title: '100% Genuine Products', description: 'Every product is sourced from authorized distributors.' },
  { icon: '🔧', title: 'In-house Technicians', description: 'Custom builds and repairs handled by our own certified team.' },
  { icon: '💸', title: 'Honest Pricing', description: 'No inflated MRPs — transparent pricing on every listing.' },
  { icon: '🤝', title: 'After-sales Support', description: 'Real human support, before and after your purchase.' },
];

export default function AboutPage() {
  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'About Us' }]} />
      <div className="sec-head">
        <h3 className="sec-title">About AK Computer Solutions</h3>
      </div>

      <div className="about-story">
        <p>
          AK Computer Solutions started as a small neighbourhood computer repair shop, built on a simple
          idea: give people honest advice and reliable hardware without the upsell. Today we sell brand new
          and certified refurbished laptops, build custom PCs in-house, and stock everything from RAM to
          printer ink — backed by the same hands-on service we started with.
        </p>
      </div>

      <div className="about-grid">
        <div className="dashboard-card">
          <h4>🎯 Our Mission</h4>
          <p>Make reliable computing accessible — whether that means a budget refurbished laptop for a student or a fully custom workstation for a studio.</p>
        </div>
        <div className="dashboard-card">
          <h4>🔭 Our Vision</h4>
          <p>To be the most trusted local name in computer retail and service, known for honesty as much as for hardware.</p>
        </div>
      </div>

      <div className="sec-head" style={{ marginTop: 32 }}>
        <h3 className="sec-title">Why Choose Us</h3>
      </div>
      <div className="feature-grid">
        {WHY_US.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </main>
  );
}
