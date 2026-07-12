import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <>
      {/* Responsive layout styles tailored for standard footer setups */}
      <style>{`
        .footer {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 32px;
          padding: 40px 24px;
        }

        .footer div {
          display: flex;
          flex-direction: column;
        }

        .fl {
          display: block;
          margin-bottom: 8px;
          text-decoration: none;
        }

        .footer-bot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
          .footer-logo{
            width: 100px;
            height: auto;
          }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .footer {
            grid-template-columns: 1fr 1fr; /* 2 columns on mobile grids */
            gap: 24px;
          }
          
          .footer > div:first-child {
            grid-column: 1 / -1; /* Branding statement takes full width */
          }

          .footer-bot {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }

          .footer-bot-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            grid-template-columns: 1fr; /* Pure vertical stack on tiny devices */
          }
        }
      `}</style>

      <footer className="footer">
        <div>
          <img src={logo} alt="AK Computer Solutions" className="footer-logo" />
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, paddingTop: 4 }}>
            Premium computing storefront offering brand new rigs, elite certified
            refurbished laptops, and custom enterprise workstation solutions.
          </p>
        </div>
        <div>
          <h5 className="ft">Shop</h5>
          <Link to="/category/new-laptops" className="fl">New Laptops</Link>
          <Link to="/category/refurbished-laptops" className="fl">Refurbished Units</Link>
          <Link to="/category/custom-pc-builds" className="fl">Custom PC Builder</Link>
          <Link to="/deals" className="fl">Today's Deals</Link>
          <Link to="/accessories" className="fl">Accessories</Link>
        </div>
        <div>
          <h5 className="ft">Brands</h5>
          <Link to="/brand/dell" className="fl">Dell</Link>
          <Link to="/brand/hp" className="fl">HP</Link>
          <Link to="/brand/lenovo" className="fl">Lenovo</Link>
          <Link to="/brand/asus" className="fl">ASUS</Link>
        </div>
        <div>
          <h5 className="ft">Support</h5>
          <Link to="/contact" className="fl">Contact Us</Link>
          <Link to="/about" className="fl">About Us</Link>
          {/* <Link to="/services" className="fl">Services</Link>
          <Link to="/faq" className="fl">FAQs</Link> */}
        </div>
      </footer>

      <div className="footer-bot">
        <span>© 2026 AK Computer Solutions. All rights reserved.</span>
        
        <div className="footer-bot-links" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/privacy-policy" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          <Link to="/admin/login" style={{ color: 'var(--t3)', textDecoration: 'none', opacity: 0.5 }}>
            Admin
          </Link>
        </div>

        <span style={{ fontSize: 13, color: 'var(--t3)' }}>
          Design & Development By{' '}
          <a 
            href="https://www.techinnovationit.in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Tech Innovation
          </a>
        </span>
      </div>
    </>
  );
}