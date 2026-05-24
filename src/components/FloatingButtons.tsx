'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    // Show after 2 seconds
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Pulse label every 8 seconds
    if (!visible) return;
    const t = setTimeout(() => setShowLabel(true), 1200);
    const t2 = setTimeout(() => setShowLabel(false), 5000);
    const interval = setInterval(() => {
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 3500);
    }, 8000);
    return () => { clearTimeout(t); clearTimeout(t2); clearInterval(interval); };
  }, [visible]);

  return (
    <div
      className={`fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* WhatsApp label bubble */}
      <div
        className={`transition-all duration-300 ${
          showLabel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div
          className="text-xs font-bold text-white px-3 py-1.5 rounded-full shadow-lg"
          style={{ background: '#25D366', whiteSpace: 'nowrap' }}
        >
          Chat with us on WhatsApp!
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/201115160947?text=Hi%2C%20I%20have%20a%20question%20about%20a%20product%20at%202M%20Premium%20Pharmacy"
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </a>
    </div>
  );
}

// Mobile Bottom Navigation Bar
export function MobileBottomNav() {
  const [active, setActive] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', href: '/' },
    { id: 'search', label: 'Search', icon: '🔍', href: '/pharmacy' },
    { id: 'categories', label: 'Shop', icon: '🛍️', href: '/pharmacy' },
    { id: 'cart', label: 'Cart', icon: '🛒', href: '/cart', badge: 0 },
    { id: 'account', label: 'Account', icon: '👤', href: '/account' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E4E0D8]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 20px rgba(28,25,23,0.08)' }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            id={`mobile-nav-${item.id}`}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 relative ${active === item.id ? 'opacity-100' : 'opacity-40'}`}
          >
            <span className={`text-lg transition-transform duration-200 ${active === item.id ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold ${active === item.id ? 'text-[var(--color-brand-primary)]' : 'text-[#A8A39C]'}`}>
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-[var(--color-brand-primary)] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            {active === item.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-brand-primary)] rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
