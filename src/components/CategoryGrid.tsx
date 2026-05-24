'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

const COLORS = {
  pharmacy:      { bg: 'var(--color-brand-primary-soft)', accent: 'var(--color-brand-primary)', text: 'var(--color-brand-primary)', border: 'var(--color-brand-primary)/20' },
  beauty:        { bg: 'var(--color-brand-accent-soft)', accent: 'var(--color-brand-accent)', text: 'var(--color-brand-accent)', border: 'var(--color-brand-accent)/20' },
  wellness:      { bg: '#E0F8F6', accent: '#2FA9A0', text: '#1A6F69', border: '#A8D8D4' },
  'personal-care': { bg: '#F0F4FF', accent: '#667EC9', text: '#3B5A9C', border: '#D4DCF7' },
};

export default function CategoryGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.cat-card');
    if (!cards) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80); });
    }, { threshold: 0.1 });
    cards.forEach((c) => { c.classList.add('reveal'); obs.observe(c); });
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16" style={{ background: 'var(--color-page-bg)' }}>
      <div className="container-2m">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label">Browse</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mt-1">Find exactly what you need across our curated departments</p>
          </div>
          <Link href="/pharmacy" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors group">
            All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => {
            const palette = COLORS[cat.id as keyof typeof COLORS] || COLORS['pharmacy'];
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                id={`category-${cat.slug}`}
                className="cat-card group block rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-md"
                style={{
                  background: palette.bg,
                  borderColor: palette.border,
                  transitionDelay: `${i * 50}ms`,
                  boxShadow: '0 1px 2px rgba(26,35,50,0.04)',
                }}
                data-category={cat.id}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'white', boxShadow: '0 2px 4px rgba(26,35,50,0.06)' }}
                >
                  {cat.icon}
                </div>

                {/* Text */}
                <h3 className="text-[1rem] font-semibold mb-1" style={{ color: palette.text }}>{cat.name}</h3>
                <p className="text-[0.8rem] text-[var(--color-text-secondary)] leading-snug mb-4 line-clamp-2">{cat.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-wider" style={{ color: palette.accent }}>
                    {cat.productCount}+ Products
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5"
                    style={{ background: palette.accent }}
                  >
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
