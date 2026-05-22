'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

export default function Hero() {
  const { t, isRtl } = useTranslation();
  const animFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Soft floating blobs on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize);

    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 80 + Math.random() * 120,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      hue: [200, 16, 46, 107, 146, 30][i % 6],
      alpha: 0.04 + Math.random() * 0.04,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue},60%,75%,${b.alpha})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrameRef.current); };
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const items = document.querySelectorAll('.hero-reveal');
    setTimeout(() => items.forEach((el) => { el.classList.add('reveal', 'visible'); }), 60);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F8F7F4 40%, #F3EEE8 100%)', minHeight: '88vh' }}
    >
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      {/* Decorative arch */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8102E 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B8922A 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="container-2m relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[88vh] py-20">

          {/* LEFT — Copy */}
          <div className="max-w-xl text-start">
            {/* Trust chip */}
            <div className="hero-reveal flex items-center gap-2 mb-6" style={{ transitionDelay: '0ms' }}>
              <span className="badge badge-red-soft text-[11px] px-3 py-1 flex items-center">
                <Star size={9} className="inline me-1 fill-[#C8102E] text-[#C8102E]" />
                {isRtl ? 'الأكثر ثقة في مصر' : "Egypt's Most Trusted"}
              </span>
              <span className="badge badge-light text-[11px] px-3 py-1">{isRtl ? 'القاهرة 🇪🇬' : '🇪🇬 Cairo'}</span>
            </div>

            {/* Headline */}
            <h1
              className="hero-reveal text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem] font-black leading-[1.1] tracking-tight text-[#1C1917] mb-5 text-start"
              style={{ transitionDelay: '60ms' }}
            >
              {isRtl ? (
                <>
                  صحتك وعافيتك
                  <br />
                  <span className="text-gradient-red">بأعلى جودة</span>
                  <br />
                  <span style={{ color: '#B8922A', fontStyle: 'italic' }}>تصلك لباب بيتك.</span>
                </>
              ) : (
                <>
                  Premium Health
                  <br />
                  <span className="text-gradient-red">& Wellness</span>
                  <br />
                  <span style={{ color: '#B8922A', fontStyle: 'italic' }}>Delivered.</span>
                </>
              )}
            </h1>

            {/* Subheading */}
            <p
              className="hero-reveal text-[1.05rem] text-[#6B6560] leading-relaxed mb-9 max-w-[40ch] text-start"
              style={{ transitionDelay: '120ms' }}
            >
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="hero-reveal flex flex-wrap items-center gap-3 mb-10 text-start" style={{ transitionDelay: '180ms' }}>
              <Link href="/pharmacy" id="hero-cta-shop" className="btn btn-primary text-[0.95rem] px-7 py-3.5 flex items-center gap-2">
                {t('shopNow')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
              <Link href="/about" id="hero-cta-about" className="btn btn-ghost text-[0.95rem] px-7 py-3.5">
                {isRtl ? 'قصتنا' : 'Our Story'}
              </Link>
            </div>

            {/* Trust row */}
            <div
              className="hero-reveal flex flex-wrap items-center gap-5 text-[0.82rem] text-[#6B6560] text-start"
              style={{ transitionDelay: '240ms' }}
            >
              {[
                { icon: ShieldCheck, text: isRtl ? 'أصلي 100%' : '100% Authentic', color: '#4A90C4' },
                { icon: Truck, text: isRtl ? 'توصيل لكافة أنحاء مصر' : 'Egypt-Wide Delivery', color: '#6B8F71' },
                { icon: Star, text: isRtl ? 'تحت إشراف صيادلة' : 'Pharmacist Curated', color: '#B8922A', fill: true },
              ].map(({ icon: Icon, text, color, fill }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={14} style={{ color }} className={fill ? 'fill-current' : ''} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Visual */}
          <div className="hero-reveal hidden lg:flex items-center justify-center animate-fade-in" style={{ transitionDelay: '80ms' }}>
            <div className="relative">
              {/* Central product showcase */}
              <div
                className="w-80 h-80 rounded-[32px] flex items-center justify-center bg-gradient-to-br from-white to-[var(--color-surface-2)] shadow-xl border border-[var(--color-border-soft)]"
              >
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=85"
                  alt="Premium health products"
                  className="w-56 h-56 object-contain"
                  style={{ filter: 'drop-shadow(0 8px 24px rgba(28,25,23,0.12))' }}
                />
              </div>

              {/* Floating stat cards */}
              <div
                className="absolute -start-14 top-1/4 bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-2xl px-4 py-3 shadow-lg border border-[var(--color-border)]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="text-xl font-black font-display">10K+</div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-semibold">{isRtl ? 'عميل سعيد' : 'Happy Customers'}</div>
              </div>

              <div
                className="absolute -end-10 bottom-1/4 bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-2xl px-4 py-3 shadow-lg border border-[var(--color-border)]"
                style={{ animation: 'float 8s ease-in-out infinite reverse' }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]" />)}
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-semibold">{isRtl ? 'تقييم 4.9' : '4.9 Rating'}</div>
              </div>

              <div
                className="absolute -top-6 end-8 bg-[var(--color-sage-soft)] rounded-2xl px-4 py-3 border border-[var(--color-sage)]/20"
                style={{ animation: 'float 7s ease-in-out infinite 2s' }}
              >
                <div className="text-xl font-black text-[var(--color-sage)] font-display">500+</div>
                <div className="text-[11px] text-[var(--color-sage)] font-semibold">{isRtl ? 'علامة تجارية' : 'Brands'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #F8F7F4, transparent)' }} aria-hidden="true" />
    </section>
  );
}
