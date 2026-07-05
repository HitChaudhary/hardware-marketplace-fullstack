import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <>
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
          <Link to="/services" className="fl">Services</Link>
          {/* <Link to="/faq" className="fl">FAQs</Link> */}
          {/* <Link to="/account/orders" className="fl">Track Order</Link> */}
        </div>
      </footer>

      <div className="footer-bot">
        <span>© 2026 AK Computer Solutions. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/privacy-policy" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          {/* <Link to="/return-policy" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Return Policy
          </Link> */}
          {/* <Link to="/shipping-policy" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
            Shipping Policy
          </Link> */}
          <Link to="/admin/login" style={{ color: 'var(--t3)', textDecoration: 'none', opacity: 0.5 }}>
            Admin
          </Link>
        </div>
      </div>
    </>
  );
}
