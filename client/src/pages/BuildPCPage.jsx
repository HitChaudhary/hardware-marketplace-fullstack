import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { formatPrice } from '../components/PriceBox';
import { useToast } from '../context/ToastContext';
import { useBuildOptionsStore } from '../context/BuildOptionsStoreContext';
import { useAuth } from '../context/AuthContext';

export default function BuildPCPage() {
  const [selection, setSelection] = useState({});
  const { showToast } = useToast();
  const { buildOptions, buildSteps } = useBuildOptionsStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const select = (key, id) => setSelection((prev) => ({ ...prev, [key]: id }));

  const findOption = (key, id) => buildOptions[key]?.find((o) => o.id === id);

  const cpu = findOption('cpu', selection.cpu);
  const motherboard = findOption('motherboard', selection.motherboard);

  const compatibility = useMemo(() => {
    if (!cpu || !motherboard) return null;
    return cpu.socket === motherboard.socket
      ? { ok: true, message: `Compatible — both use the ${cpu.socket} socket.` }
      : { ok: false, message: `Incompatible: ${cpu.name} uses ${cpu.socket}, but ${motherboard.name} uses ${motherboard.socket}.` };
  }, [cpu, motherboard]);

  const total = buildSteps.reduce((sum, step) => {
    const opt = findOption(step.key, selection[step.key]);
    return sum + (opt ? opt.price : 0);
  }, 0);

  const missingRequired = buildSteps.filter((s) => s.required && !selection[s.key]);
  const canSubmit = missingRequired.length === 0 && (!compatibility || compatibility.ok);

  const handleSubmit = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to submit a build inquiry', 'error');
      navigate('/login?redirect=/build-pc');
      return;
    }
    if (!canSubmit) {
      showToast('Please complete all required components first', 'error');
      return;
    }
    showToast("Build request sent — our team will reach out to confirm pricing & availability", 'success');
  };

  return (
    <main className="sec a3">
      <Breadcrumb items={[{ label: 'Build Your PC' }]} />
      <div className="sec-head">
        <div>
          <h3 className="sec-title">Build Your PC</h3>
          <div className="sec-sub">Pick your components — we'll check compatibility and estimate the price</div>
        </div>
      </div>

      <div className="build-pc-layout">
        <div className="build-pc-steps">
          {buildSteps.map((step) => (
            <div className="build-pc-step" key={step.key}>
              <h5>
                {step.label} {step.required && <span className="build-required">Required</span>}
              </h5>
              <div className="build-pc-options">
                {buildOptions[step.key].map((opt) => (
                  <label
                    key={opt.id}
                    className={`payment-card ${selection[step.key] === opt.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={step.key}
                      style={{ display: 'none' }}
                      checked={selection[step.key] === opt.id}
                      onChange={() => select(step.key, opt.id)}
                    />
                    <div>
                      <div className="payment-label">{opt.name}</div>
                      {opt.socket && <div className="payment-sub">Socket: {opt.socket}</div>}
                    </div>
                    <span className="payment-sub" style={{ marginLeft: 'auto' }}>
                      {opt.price === 0 ? 'Included' : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="build-pc-summary">
          <h4>Build Summary</h4>
          {compatibility && (
            <div className={`compat-banner ${compatibility.ok ? 'ok' : 'error'}`}>
              {compatibility.ok ? '✓' : '⚠'} {compatibility.message}
            </div>
          )}
          <ul className="build-pc-summary-list">
            {buildSteps.map((step) => {
              const opt = findOption(step.key, selection[step.key]);
              return (
                <li key={step.key}>
                  <span>{step.label}</span>
                  <span>{opt ? opt.name : <em>Not selected</em>}</span>
                </li>
              );
            })}
          </ul>
          <div className="build-pc-total">
            <span>Estimated Price</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button className="ncall" style={{ width: '100%', justifyContent: 'center', animation: 'none' }} onClick={handleSubmit}>
            {isAuthenticated ? 'Request This Build' : 'Sign In to Request Build'}
          </button>
          <p className="order-summary-note">Final pricing confirmed by our team based on live stock.</p>
        </div>
      </div>
    </main>
  );
}
