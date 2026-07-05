const ANNOUNCEMENTS = [
  'Up to 40% off refurbished laptops this week',
  'Free delivery on orders above ₹5,000',
  'Custom PC builds starting at ₹25,000 — configure yours today',
  'Easy No-cost EMI available on select models',
];

export default function Announce() {
  return (
    <div className="announce a1">
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {ANNOUNCEMENTS.map((text, i) => (
            <span className="tick-item" key={`a-${i}`}>
              {text} <span className="tick-dot"></span>
            </span>
          ))}
          {/* duplicate set so the marquee loops seamlessly, same as the CSS ticker keyframe expects (-50%) */}
          {ANNOUNCEMENTS.map((text, i) => (
            <span className="tick-item" key={`b-${i}`}>
              {text} <span className="tick-dot"></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
