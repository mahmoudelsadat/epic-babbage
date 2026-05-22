'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';

export default function Hero() {
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
          <div className="max-w-xl">
            {/* Trust chip */}
            <div className="hero-reveal flex items-center gap-2 mb-6" style={{ transitionDelay: '0ms' }}>
              <span className="badge badge-red-soft text-[11px] px-3 py-1">
                <Star size={9} className="inline mr-1 fill-[#C8102E] text-[#C8102E]" /> Egypt's Most Trusted
              </span>
              <span className="badge badge-light text-[11px] px-3 py-1">🇪🇬 Cairo</span>
            </div>

            {/* Headline */}
            <h1
              className="hero-reveal text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem] font-black leading-[1.1] tracking-tight text-[#1C1917] mb-5"
              style={{ transitionDelay: '60ms' }}
            >
              Premium Health
              <br />
              <span className="text-gradient-red">& Wellness</span>
              <br />
              <span style={{ color: '#B8922A', fontStyle: 'italic' }}>Delivered.</span>
            </h1>

            {/* Subheading */}
            <p
              className="hero-reveal text-[1.05rem] text-[#6B6560] leading-relaxed mb-9 max-w-[40ch]"
              style={{ transitionDelay: '120ms' }}
            >
              Authentic vitamins, pharmacy products, and premium beauty brands — curated by pharmacists, delivered across Egypt.
            </p>

            {/* CTAs */}
            <div className="hero-reveal flex flex-wrap items-center gap-3 mb-10" style={{ transitionDelay: '180ms' }}>
              <Link href="/pharmacy" id="hero-cta-shop" className="btn btn-primary text-[0.95rem] px-7 py-3.5">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/about" id="hero-cta-about" className="btn btn-ghost text-[0.95rem] px-7 py-3.5">
                Our Story
              </Link>
            </div>

            {/* Trust row */}
            <div
              className="hero-reveal flex flex-wrap items-center gap-5 text-[0.82rem] text-[#6B6560]"
              style={{ transitionDelay: '240ms' }}
            >
              {[
                { icon: ShieldCheck, text: '100% Authentic', color: '#4A90C4' },
                { icon: Truck, text: 'Egypt-Wide Delivery', color: '#6B8F71' },
                { icon: Star, text: 'Pharmacist Curated', color: '#B8922A', fill: true },
              ].map(({ icon: Icon, text, color, fill }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={14} style={{ color }} className={fill ? 'fill-current' : ''} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Visual */}
          <div className="hero-reveal hidden lg:flex items-center justify-center" style={{ transitionDelay: '80ms' }}>
            <div className="relative">
              {/* Central product showcase */}
              <div
                className="w-80 h-80 rounded-[32px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F3EEE8 100%)',
                  boxShadow: '0 32px 80px rgba(28,25,23,0.12), 0 8px 24px rgba(28,25,23,0.06)',
                  border: '1px solid rgba(228,224,216,0.8)',
                }}
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
                className="absolute -left-14 top-1/4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#E4E0D8]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="text-xl font-black text-[#1C1917]">10K+</div>
                <div className="text-[11px] text-[#6B6560]">Happy Customers</div>
              </div>

              <div
                className="absolute -right-10 bottom-1/4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#E4E0D8]"
                style={{ animation: 'float 8s ease-in-out infinite reverse' }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[#B8922A] text-[#B8922A]" />)}
                </div>
                <div className="text-[11px] text-[#6B6560]">4.9 Rating</div>
              </div>

              <div
                className="absolute -top-6 right-8 bg-[#EDF3EE] rounded-2xl px-4 py-3 border border-[#D8EAD9]"
                style={{ animation: 'float 7s ease-in-out infinite 2s' }}
              >
                <div className="text-xl font-black text-[#4A7C59]">500+</div>
                <div className="text-[11px] text-[#6B8F71]">Brands</div>
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
