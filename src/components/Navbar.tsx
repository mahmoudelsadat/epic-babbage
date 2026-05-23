/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon, Sparkles, ShieldCheck, Heart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import SearchAutocomplete from './SearchAutocomplete';
import { useTranslation } from '@/lib/LanguageContext';

// ─── Dark Mode Toggle ──────────────────────────────────────────
function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('2m-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('2m-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <motion.button
      id="dark-mode-toggle"
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className="p-2.5 rounded-lg border transition-all duration-200 hover:bg-[var(--color-surface-2)]"
      style={{
        background: dark ? '#1C1917' : 'var(--color-surface)',
        borderColor: dark ? 'rgba(255,255,255,0.1)' : 'var(--color-border)',
        color: dark ? '#E8C96B' : 'var(--color-text-secondary)',
      }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </motion.button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────
interface NavbarProps { cartCount?: number; }

export default function Navbar({ cartCount }: NavbarProps) {
  const router = useRouter();
  const { t, locale, setLocale, isRtl } = useTranslation();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  
  const pathname = usePathname();
  const storeCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const displayCount = cartCount ?? storeCount;

  // Track scroll status
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync user status from local storage
  const syncAuthStatus = () => {
    setUserLoggedIn(localStorage.getItem('2m-user-logged-in') === 'true');
    setAdminLoggedIn(localStorage.getItem('2m-admin-logged-in') === 'true');
  };

  useEffect(() => {
    syncAuthStatus();
    // Listen for storage events (emitted by login/logout across tabs/same page)
    window.addEventListener('storage', syncAuthStatus);
    return () => window.removeEventListener('storage', syncAuthStatus);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile drawer on route change
  useEffect(() => { 
    setMobileOpen(false); 
    setSearchOpen(false); 
  }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  // Custom departmental megamenu deals definitions
  const getMegamenuDeal = (categoryLabel: string) => {
    switch (categoryLabel) {
      case 'PHARMACY':
        return {
          title: isRtl ? '💊 اختيار الصيادلة المميز' : '💊 Pharmacist\'s Recommendation',
          desc: isRtl 
            ? 'احصل على فيتامين د3 عالي الفعالية من سولغار لتعزيز المناعة القوية ونشاط اليوم اليومي.'
            : 'Boost immunity with Solgar Vitamin D3 (10,000 IU). Premium high-absorption nutrients.',
          badge: isRtl ? 'خصم 20%' : '20% OFF',
          link: '/product/vitamin-d3-5000iu'
        };
      case 'BEAUTY':
        return {
          title: isRtl ? '✨ حماية طبية معتمدة' : '✨ Dermatologist Choice',
          desc: isRtl
            ? 'واقي الشمس ألترويست SPF50 عالي الحماية المرطب ومقاوم للأشعة الفوق البنفسجية الحساسة.'
            : 'Altruist Sunscreen SPF50. Ultra-hydrating, broad-spectrum dermatological care.',
          badge: isRtl ? 'الأكثر مبيعاً' : 'Best Seller',
          link: '/product/spf-50-sunscreen'
        };
      case 'WELLNESS':
        return {
          title: isRtl ? '🌿 أوميغا 3 الطبيعي النقي' : '🌿 Concentrated Nutrients',
          desc: isRtl
            ? 'نورديك ناتشورالز ثلاثي القوة بنكهة الليمون لتعزيز صحة القلب والنشاط الذهني العام.'
            : 'Nordic Naturals Omega-3. Pure essential fatty acids for brain & active heart vitality.',
          badge: isRtl ? 'نقي 100%' : '100% Pure',
          link: '/product/omega-3-fish-oil'
        };
      case 'PERSONAL CARE':
      default:
        return {
          title: isRtl ? '🧴 أساسيات الترطيب اليومي' : '🧴 Daily Essentials',
          desc: isRtl
            ? 'مرطب سيرافي هيدريتينغ لحماية الحاجز الطبيعي للبشرة وترطيب عميق متواصل.'
            : 'CeraVe Hydrating Cleanser. Fortify skin barrier with essential ceramides daily.',
          badge: isRtl ? 'جديد' : 'NEW',
          link: '/product/whey-protein-chocolate'
        };
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar select-none">
        <div className="container-2m flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-4">
            <span>{t('freeDelivery')}</span>
            <span className="opacity-40 hidden sm:inline">|</span>
            <span className="hidden sm:inline">{t('cod')}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">{t('authentic')}</span>
            {adminLoggedIn && (
              <Link 
                href="/admin/dashboard" 
                className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:brightness-115 transition-all"
              >
                <ShieldCheck size={11} />
                {t('adminDashboard')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass shadow-lg border-b border-[var(--color-border-soft)] py-2' 
            : 'bg-[var(--color-page-bg)]/90 border-b border-transparent py-3'
        }`}
      >
        <div className="container-2m">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="2M Premium Pharmacy home">
              <motion.div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md relative overflow-hidden bg-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Visual shiny effect on logo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-primary)]/20 to-[var(--color-brand-gold)]/20" />
                <span className="text-white font-black text-lg tracking-tight leading-none relative z-10">2M</span>
              </motion.div>
              <div className="hidden sm:block">
                <div className="font-black text-[var(--color-text-primary)] text-[1.05rem] leading-none tracking-tight font-display">
                  {isRtl ? 'صيدلية 2M' : '2M Pharmacy'}
                </div>
                <div className="text-[10px] text-[var(--color-brand-gold)] leading-none font-black tracking-[0.15em] uppercase mt-1">
                  {isRtl ? 'صحة فائقة' : 'Premium Health'}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Megamenu Links */}
            <div className="hidden lg:flex items-center flex-1 justify-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const hasSub = link.submenu && link.submenu.length > 0;
                
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => { if (hasSub) setActiveMenu(link.label); }}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <Link
                      href={link.href}
                      className={`relative flex items-center gap-1 px-4 py-2.5 text-xs font-black tracking-wider transition-all duration-200 rounded-xl ${
                        link.label === 'OFFERS'
                          ? 'text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10'
                          : active
                          ? 'text-[var(--color-text-primary)] bg-[var(--color-surface-2)] shadow-inner'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                      }`}
                    >
                      {isRtl ? link.labelAr : link.label}
                      
                      {/* Active tag indicator line */}
                      {active && link.label !== 'OFFERS' && (
                        <motion.div
                          layoutId="active-nav-dot"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]"
                        />
                      )}
                      
                      {hasSub && (
                        <ChevronDown size={11} className={`transition-transform duration-200 ${activeMenu === link.label ? 'rotate-180 text-[var(--color-brand-gold)]' : 'text-[var(--color-text-muted)]'}`} />
                      )}
                    </Link>

                    {/* TWO-COLUMN HIGH-FIDELITY MEGAMENU BLOCK */}
                    <AnimatePresence>
                      {hasSub && activeMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 4, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className={`absolute top-full ${isRtl ? 'right-0' : 'left-0'} w-[540px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 grid grid-cols-5 gap-6 shadow-2xl backdrop-blur-xl z-50`}
                          style={{
                            boxShadow: '0 25px 50px -12px rgba(28,25,23,0.15)',
                            borderColor: 'var(--color-border-soft)'
                          }}
                        >
                          {/* Accent border top strip */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-gold)] rounded-t-2xl" />

                          {/* Column 1: Subcategories List (3/5 width) */}
                          <div className="col-span-3 space-y-4">
                            <span className="block text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider border-b border-[var(--color-border-soft)] pb-2 mb-2">
                              {isRtl ? 'الأقسام الفرعية المتوفرة' : 'Shop Subcategories'}
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {link.submenu.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--color-surface-2)] border border-transparent hover:border-[var(--color-border-soft)] transition-all duration-150"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                                      {sub.label}
                                    </span>
                                  </div>
                                  <ChevronDown size={12} className={`text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-all ${isRtl ? 'rotate-90' : '-rotate-90'}`} />
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Column 2: Seasonal featured Deal (2/5 width) */}
                          <div className="col-span-2 flex flex-col justify-between bg-gradient-to-br from-[var(--color-brand-primary)]/5 to-[var(--color-brand-gold)]/5 rounded-xl border border-[var(--color-border-soft)] p-4 relative overflow-hidden">
                            {/* Decorative gold ring */}
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[var(--color-brand-gold)]/5 rounded-full blur-xl pointer-events-none" />
                            
                            <div>
                              <div className="flex items-center justify-between mb-3.5">
                                <span className="text-[9px] font-black uppercase tracking-wider bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20 px-2 py-0.5 rounded">
                                  {getMegamenuDeal(link.label).badge}
                                </span>
                                <Sparkles size={13} className="text-[var(--color-brand-gold)] animate-pulse" />
                              </div>
                              <h4 className="text-xs font-black text-[var(--color-text-primary)] font-display mb-1.5">
                                {getMegamenuDeal(link.label).title}
                              </h4>
                              <p className="text-[10px] text-[var(--color-text-secondary)] font-semibold leading-relaxed">
                                {getMegamenuDeal(link.label).desc}
                              </p>
                            </div>

                            <Link
                              href={getMegamenuDeal(link.label).link}
                              className="mt-4 w-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-brand-primary)] hover:text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg text-center shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 text-[var(--color-text-primary)]"
                            >
                              <span>{isRtl ? 'اكتشف الآن' : 'Explore Deal'}</span>
                              <span>⚡</span>
                            </Link>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Actions Panel */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              
              {/* Search Toggle Icon */}
              <motion.button
                id="nav-search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                whileTap={{ scale: 0.9 }}
              >
                {searchOpen ? <X size={17} /> : <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>}
              </motion.button>

              {/* Theme switch */}
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              {/* LANGUAGE SELECTOR DYNAMIC TOGGLE */}
              <motion.button
                id="nav-lang-btn"
                whileTap={{ scale: 0.92 }}
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[10px] font-black text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all duration-200 border border-[var(--color-border)] shadow-sm uppercase tracking-wider select-none"
              >
                <Globe size={13} className="text-[var(--color-brand-gold)]" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </motion.button>

              {/* Account / Dashboard Portal Link */}
              <Link
                href="/account"
                id="nav-account-btn"
                className={`p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors relative flex items-center justify-center ${
                  userLoggedIn ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/10' : ''
                }`}
                aria-label="My account"
              >
                <User size={17} />
                {userLoggedIn && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </Link>

              {/* Shopping Cart button with active badges */}
              <motion.div whileTap={{ scale: 0.93 }}>
                <Link
                  href="/cart"
                  id="nav-cart-btn"
                  className="relative flex items-center gap-2 pl-3 pr-4 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-xl hover:bg-[var(--color-brand-primary)]/90 text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0 btn-shimmer"
                  aria-label={`Cart — ${displayCount} items`}
                >
                  <ShoppingCart size={14} className="shrink-0" />
                  <span className="hidden sm:inline">{t('cart')}</span>
                  <AnimatePresence>
                    {displayCount > 0 && (
                      <motion.span
                        key={displayCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-5 h-5 text-[9px] font-black bg-white text-[var(--color-brand-primary)] rounded-full flex items-center justify-center leading-none shadow-sm"
                      >
                        {displayCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Mobile Drawer trigger */}
              <button
                id="nav-mobile-menu-btn"
                className="lg:hidden p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search Dropdown Overlay */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pb-4"
              >
                <SearchAutocomplete onClose={() => setSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic header accent divider line */}
        {scrolled && (
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/30 to-transparent" />
        )}
      </nav>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-black/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={`fixed top-0 bottom-0 z-40 lg:hidden w-72 overflow-y-auto ${
                isRtl ? 'left-0' : 'right-0'
              }`}
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{ 
                background: 'var(--color-surface)', 
                boxShadow: isRtl ? '20px 0 60px rgba(0,0,0,0.15)' : '-20px 0 60px rgba(0,0,0,0.15)' 
              }}
            >
              <div className="p-5 border-b border-[var(--color-border-soft)] flex items-center justify-between bg-[var(--color-surface-2)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white font-black text-xs">
                    <span>2M</span>
                  </div>
                  <span className="font-black text-[var(--color-text-primary)] font-display uppercase tracking-wider text-xs">
                    {isRtl ? 'القائمة الرئيسية' : '2M Menu'}
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {/* Navigation links drawer */}
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                        link.label === 'OFFERS'
                          ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/10'
                          : active
                          ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/10'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                      }`}
                    >
                      <span>{isRtl ? link.labelAr : link.label}</span>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Drawer Settings footer controls */}
              <div className="p-5 border-t border-[var(--color-border-soft)] space-y-4">
                
                {/* Language button in Drawer */}
                <button
                  onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] text-xs font-black uppercase tracking-wider text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <Globe size={14} className="text-[var(--color-brand-gold)]" />
                  <span>{locale === 'en' ? 'العربية (Arabic)' : 'English (EN)'}</span>
                </button>

                {/* Theme Mode toggle */}
                <div className="flex items-center justify-between bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border-soft)]">
                  <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)]">
                    {isRtl ? 'المظهر الليلي' : 'Dark Theme'}
                  </span>
                  <DarkModeToggle />
                </div>

                <Link href="/cart" className="btn btn-primary w-full text-xs font-black uppercase tracking-wider py-3 flex items-center justify-center gap-1.5 rounded-xl shadow-md">
                  <ShoppingCart size={13} /> 
                  <span>{t('cart')}</span> 
                  {displayCount > 0 && `(${displayCount})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
