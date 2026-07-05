export default function BrandBanner({ brand }) {
  return (
    <div className="brand-banner" style={{ backgroundImage: `url(${brand.banner})` }}>
      <div className="brand-banner-overlay">
        <h1>{brand.name}</h1>
        <p>{brand.tagline}</p>
      </div>
    </div>
  );
}
