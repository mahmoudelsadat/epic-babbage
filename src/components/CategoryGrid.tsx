'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

const COLORS = {
  pharmacy:      { bg: '#EBF4FB', accent: '#4A90C4', text: '#2A6496', border: '#C6E0F5' },
  beauty:        { bg: '#FAEEE9', accent: '#D4856A', text: '#9E4A2E', border: '#F4CCBA' },
  wellness:      { bg: '#EDF3EE', accent: '#6B8F71', text: '#3D6644', border: '#C0D9C2' },
  'personal-care': { bg: '#FDF2E4', accent: '#C9873A', text: '#8A5A1E', border: '#EDD2A0' },
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
    <section ref={sectionRef} className="py-16 bg-[#F8F7F4]">
      <div className="container-2m">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label">Browse</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mt-1">Find exactly what you need across our curated departments</p>
          </div>
          <Link href="/pharmacy" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6B6560] hover:text-[#C8102E] transition-colors group">
            All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const palette = COLORS[cat.id as keyof typeof COLORS] || COLORS['pharmacy'];
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                id={`category-${cat.slug}`}
                className="cat-card group block rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                style={{
                  background: palette.bg,
                  borderColor: palette.border,
                  transitionDelay: `${i * 50}ms`,
                  boxShadow: '0 1px 4px rgba(28,25,23,0.05)',
                }}
                data-category={cat.id}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'white', boxShadow: '0 2px 8px rgba(28,25,23,0.07)' }}
                >
                  {cat.icon}
                </div>

                {/* Text */}
                <h3 className="text-[1rem] font-bold mb-1" style={{ color: palette.text }}>{cat.name}</h3>
                <p className="text-[0.8rem] text-[#6B6560] leading-snug mb-4 line-clamp-2">{cat.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                    {cat.productCount}+ Products
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5"
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
