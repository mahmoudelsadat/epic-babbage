'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { navLinks } from '@/lib/data';

interface NavbarProps { cartCount?: number; }

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container-2m flex items-center justify-center gap-5 text-xs">
          <span>🚚 Free delivery on orders over <strong>EGP 500</strong></span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline">💳 Cash on Delivery Available</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:inline">✅ 100% Authentic Products</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-dark' : 'bg-[#F8F7F4]/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-2m">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="2M Premium Pharmacy">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm transition-transform duration-300 group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #C8102E 0%, #A00D24 100%)' }}
                >
                  2M
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#F8F7F4] bg-[#B8922A]" />
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-[#1C1917] text-base leading-none tracking-tight">2M Pharmacy</div>
                <div className="text-[10px] text-[#A8A39C] leading-none font-medium tracking-wider uppercase mt-0.5">Premium Health</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(link.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3.5 py-2 text-xs font-semibold tracking-wider transition-all duration-150 rounded-lg ${
                      link.label === 'OFFERS'
                        ? 'text-[#C8102E] hover:bg-[#fce8ec]'
                        : 'text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F3F0EB]'
                    }`}
                  >
                    {link.label}
                    {link.submenu.length > 0 && (
                      <ChevronDown size={11} className={`transition-transform duration-150 ${activeMenu === link.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {link.submenu.length > 0 && (
                    <div
                      className={`absolute top-full left-0 w-52 bg-white rounded-xl border border-[#E4E0D8] shadow-xl p-1.5 transition-all duration-200 ${
                        activeMenu === link.label ? 'opacity-100 translate-y-1 pointer-events-auto' : 'opacity-0 translate-y-0 pointer-events-none'
                      }`}
                      style={{ boxShadow: '0 12px 40px rgba(28,25,23,0.10)' }}
                    >
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-3 py-2 text-sm text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F8F7F4] rounded-lg transition-all duration-100"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                id="nav-search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F3F0EB] rounded-lg transition-all duration-150"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex p-2.5 text-[#6B8F71] hover:bg-[#EDF3EE] rounded-lg transition-all duration-150"
                aria-label="WhatsApp Support"
              >
                <Phone size={17} />
              </a>

              {/* Language */}
              <button
                id="nav-lang-btn"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F3F0EB] rounded-lg transition-all duration-150 border border-[#E4E0D8]"
              >
                EN
              </button>

              {/* Account */}
              <Link
                href="/account"
                id="nav-account-btn"
                className="p-2.5 text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F3F0EB] rounded-lg transition-all duration-150"
                aria-label="Account"
              >
                <User size={17} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                id="nav-cart-btn"
                className="relative flex items-center gap-2 pl-2.5 pr-3.5 py-2 bg-[#C8102E] text-white rounded-lg transition-all duration-150 hover:bg-[#A80D26] text-sm font-semibold"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingCart size={15} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 text-[10px] font-black bg-white text-[#C8102E] rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu */}
              <button
                id="nav-mobile-menu-btn"
                className="lg:hidden p-2.5 text-[#6B6560] hover:text-[#1C1917] hover:bg-[#F3F0EB] rounded-lg transition-all duration-150 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-16 pb-3' : 'max-h-0'}`}>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A39C]" />
              <input
                ref={searchRef}
                id="nav-search-input"
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E4E0D8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1C1917] placeholder-[#A8A39C] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all duration-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A39C] hover:text-[#1C1917]">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        {scrolled && <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.3) 40%, rgba(200,16,46,0.3) 60%, transparent)' }} />}
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className="absolute top-0 right-0 bottom-0 w-72 overflow-y-auto"
          style={{ background: '#FFFFFF', boxShadow: '-20px 0 60px rgba(28,25,23,0.12)' }}
        >
          <div className="p-5 border-b border-[#F3F0EB] flex items-center justify-between">
            <span className="font-black text-[#1C1917]">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 text-[#6B6560] hover:bg-[#F3F0EB] rounded-lg">
              <X size={18} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  link.label === 'OFFERS'
                    ? 'text-[#C8102E] bg-[#fce8ec]'
                    : 'text-[#1C1917] hover:bg-[#F8F7F4]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#F3F0EB] space-y-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="btn btn-sage w-full text-sm">
              <Phone size={14} /> WhatsApp Support
            </a>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full text-sm">
              <ShoppingCart size={14} /> View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
