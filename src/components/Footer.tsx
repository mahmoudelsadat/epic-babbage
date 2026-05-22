import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight, Shield, Truck, CreditCard, RefreshCw } from 'lucide-react';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: 'Pharmacy', href: '/pharmacy' },
    { label: 'Beauty', href: '/beauty' },
    { label: 'Wellness', href: '/wellness' },
    { label: 'Personal Care', href: '/personal-care' },
    { label: 'Offers & Deals', href: '/offers' },
    { label: 'All Brands', href: '/brands' },
  ],
  service: [
    { label: 'Delivery Information', href: '/delivery' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Your Order', href: '/track' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Wellness Blog', href: '/blog' },
    { label: 'Authenticity Policy', href: '/authenticity' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

const TRUST_FOOTER = [
  { icon: Shield, label: '100% Authentic', color: '#4A90C4' },
  { icon: Truck, label: 'Egypt-Wide', color: '#6B8F71' },
  { icon: CreditCard, label: 'Secure Payment', color: '#B8922A' },
  { icon: RefreshCw, label: 'Easy Returns', color: '#D4856A' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#1C1917', color: '#F8F7F4' }}>

      {/* Newsletter Strip */}
      <div style={{ borderBottom: '1px solid rgba(248,247,244,0.07)' }}>
        <div className="container-2m py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Get Wellness Tips & Exclusive Offers</h3>
              <p className="text-[0.875rem] text-[#9E9890]">Join 10,000+ health-conscious Egyptians. No spam, ever.</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-md">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder-[#6B6560] focus:outline-none focus:border-[#C8102E]/60 min-w-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
              <button id="newsletter-submit" className="btn btn-primary px-5 flex-shrink-0 text-sm">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-2m py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #C8102E, #A00D24)' }}>
                2M
              </div>
              <div>
                <div className="font-black text-white text-base leading-none">2M Pharmacy</div>
                <div className="text-[10px] text-[#6B6560] font-medium tracking-wider uppercase mt-0.5">Premium Health</div>
              </div>
            </div>

            <p className="text-[0.875rem] text-[#9E9890] leading-relaxed mb-6 max-w-xs">
              Egypt's trusted destination for authentic health, wellness, and beauty products. Curated by pharmacists, delivered to your door.
            </p>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TRUST_FOOTER.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 text-[0.8rem] text-[#9E9890]">
                  <Icon size={13} style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-2.5">
              {[
                { href: 'https://www.instagram.com/2m_pharmcy', Icon: InstagramIcon, id: 'footer-instagram', hoverBg: 'hover:bg-pink-500/10 hover:border-pink-400/30', label: 'Instagram' },
                { href: 'https://www.facebook.com/people/2M-Pharmacy/100068944428141/', Icon: FacebookIcon, id: 'footer-facebook', hoverBg: 'hover:bg-blue-500/10 hover:border-blue-400/30', label: 'Facebook' },
                { href: 'https://wa.me/201000000000', Icon: Phone, id: 'footer-whatsapp', hoverBg: 'hover:bg-green-500/10 hover:border-green-400/30', label: 'WhatsApp' },
              ].map(({ href, Icon, id, hoverBg, label }) => (
                <a key={id} href={href} target="_blank" rel="noopener noreferrer" id={id}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-[#9E9890] hover:text-white transition-all duration-200 ${hoverBg}`}
                  aria-label={label}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Shop', links: footerLinks.shop },
            { title: 'Customer Service', links: footerLinks.service },
            { title: 'Company', links: footerLinks.company },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-[0.8rem] uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.875rem] text-[#9E9890] hover:text-white transition-colors duration-150 hover:pl-1 block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.title === 'Company' && (
                <div className="mt-6 space-y-2">
                  <a href="https://wa.me/201000000000" className="flex items-center gap-2 text-[0.8rem] text-[#9E9890] hover:text-[#43e97b] transition-colors">
                    <Phone size={11} /> +20 100 000 0000
                  </a>
                  <a href="mailto:info@2mpharmacy.com" className="flex items-center gap-2 text-[0.8rem] text-[#9E9890] hover:text-white transition-colors">
                    <Mail size={11} /> info@2mpharmacy.com
                  </a>
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#9E9890]">
                    <MapPin size={11} /> Egypt — Nationwide Delivery
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(248,247,244,0.06)' }}>
        <div className="container-2m py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.78rem] text-[#6B6560]">
            © {new Date().getFullYear()} 2M Premium Pharmacy. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['💵 COD', '💳 Visa', '💳 Mastercard', '⚡ InstaPay'].map((p) => (
              <span key={p} className="text-[0.75rem] text-[#6B6560]">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
