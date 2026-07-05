import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  {
    tag: 'Custom Builds',
    title: 'Build Your Dream PC From Scratch',
    desc: 'Select components tailored perfectly to your dynamic workload. We assemble, optimize, stress test, and ship your personal setup with precision safety features right to your doorstep.',
    cta: 'Start Building Setup',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    alt: 'Custom Built Gaming PC',
  },
  {
    tag: 'Brand New',
    title: 'Latest & Greatest Ultra Portable Laptops',
    desc: 'Stay ahead with modern generations of premium processing architectures. Explore slim business units, ultrabooks, and extreme performance gaming setups from elite brands.',
    cta: 'Browse New Arrivals',
    img: 'https://images.unsplash.com/photo-1654119895136-6aad918f412c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Premium New Laptop',
  },
  {
    tag: 'Certified Refurbished',
    title: 'Uncompromising Quality, Sensible Savings',
    desc: 'Every machine undergoes a rigorous 40-point structural and diagnostic verification program. Get absolute flagship enterprise reliability at up to a fraction of traditional premium pricing.',
    cta: 'Explore Certified Deals',
    img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    alt: 'Refurbished Professional Laptop',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => setCurrent(idx);
  const move = (dir) =>
    setCurrent((c) => (c + dir + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(() => move(1), 7000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="hero-slider-container a2">
      <button className="slider-btn prev" onClick={() => move(-1)}>
        &#10094;
      </button>
      <button className="slider-btn next" onClick={() => move(1)}>
        &#10095;
      </button>

      <div className="slider-dots">
        {SLIDES.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>

      {SLIDES.map((slide, idx) => (
        <div className={`slide ${idx === current ? 'active' : ''}`} key={idx}>
          <div className="slide-content">
            <span className="slide-tag">{slide.tag}</span>
            <h2 className="slide-title">{slide.title}</h2>
            <p className="slide-desc">{slide.desc}</p>
            <button className="ncall" style={{ fontSize: 13, padding: '12px 24px', animation: 'none' }}>
              {slide.cta}
            </button>
          </div>
          <div className="slide-image-wrap">
            <img src={slide.img} alt={slide.alt} className="slide-img" />
          </div>
        </div>
      ))}
    </section>
  );
}
