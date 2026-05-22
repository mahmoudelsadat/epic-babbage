'use client';

import { useEffect, useRef, useState } from 'react';
import { trustStats } from '@/lib/data';

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function Stat({ value, suffix, label, delay, color }: { value: number; suffix: string; label: string; delay: number; color: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, visible);
  const formatted = value >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toString();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4">
      <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {formatted}{suffix}
      </div>
      <div className="text-sm text-[#6B6560] font-medium">{label}</div>
    </div>
  );
}

const STATS_CONFIG = [
  { ...trustStats[0], color: '#4A90C4' },
  { ...trustStats[1], color: '#C8102E' },
  { ...trustStats[2], color: '#6B8F71' },
  { ...trustStats[3], color: '#B8922A' },
];

const TRUST_ITEMS = [
  { icon: '✅', text: 'Authentic Products Guaranteed' },
  { icon: '💳', text: 'Cash on Delivery' },
  { icon: '🔒', text: 'Secure Checkout' },
  { icon: '↩️', text: '14-Day Easy Returns' },
  { icon: '💊', text: 'Pharmacist Curated' },
];

export default function TrustBar() {
  return (
    <section className="py-14 bg-white border-y border-[#E4E0D8]">
      <div className="container-2m">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {STATS_CONFIG.map((s, i) => (
            <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 80} color={s.color} />
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-[0.82rem] text-[#6B6560]">
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
