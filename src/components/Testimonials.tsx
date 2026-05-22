'use client';

import { useState, useEffect, useRef } from 'react';
import { testimonials } from '@/lib/data';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="p-6 rounded-2xl border border-[#E4E0D8] bg-white flex flex-col gap-4 h-full"
      style={{ boxShadow: '0 2px 12px rgba(28,25,23,0.06)' }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} size={14} className={s <= t.rating ? 'fill-[#B8922A] text-[#B8922A]' : 'text-[#E4E0D8]'} />
        ))}
      </div>

      {/* Quote */}
      <p className="text-[0.9rem] text-[#1C1917] leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>

      {/* Product label */}
      <div className="text-[11px] font-semibold text-[#C8102E] bg-[#fce8ec] rounded-full px-3 py-1 w-fit">
        {t.product}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#F3F0EB]">
        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#E4E0D8]" loading="lazy" />
        <div>
          <div className="flex items-center gap-1.5 text-[0.875rem] font-semibold text-[#1C1917]">
            {t.name}
            {t.verified && <CheckCircle size={12} className="text-[#4A90C4]" />}
          </div>
          <div className="text-[11px] text-[#A8A39C]">{t.date}</div>
        </div>
        {t.verified && (
          <span className="ml-auto badge badge-sky text-[10px]">Verified</span>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);

  useEffect(() => {
    if (!autoplay) return;
    intervalRef.current = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, [autoplay]);

  const prev = () => { setAutoplay(false); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setAutoplay(false); setCurrent((c) => (c + 1) % testimonials.length); };

  const visible = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 bg-white border-t border-[#E4E0D8]">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">Social Proof</div>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <div className="flex items-center gap-2">
            <button id="testimonials-prev" onClick={prev}
              className="w-9 h-9 rounded-full border border-[#E4E0D8] bg-white flex items-center justify-center text-[#6B6560] hover:text-[#C8102E] hover:border-[#C8102E]/30 transition-all duration-200 shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button id="testimonials-next" onClick={next}
              className="w-9 h-9 rounded-full border border-[#E4E0D8] bg-white flex items-center justify-center text-[#6B6560] hover:text-[#C8102E] hover:border-[#C8102E]/30 transition-all duration-200 shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Overall rating strip */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl mb-8 border border-[#EDD2A0]"
          style={{ background: '#FDF6E8' }}
        >
          <div className="text-3xl font-black text-[#B8922A]">4.9</div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-[#B8922A] text-[#B8922A]" />)}
            </div>
            <div className="text-sm text-[#6B6560]">
              Based on <span className="font-bold text-[#1C1917]">10,000+</span> verified reviews
            </div>
          </div>
          <div className="ml-auto hidden sm:block text-xs text-[#A8A39C] italic">&ldquo;Egypt&apos;s most trusted pharmacy brand&rdquo;</div>
        </div>

        {/* Desktop: 3-col */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {visible.map((t, i) => <TestimonialCard key={`${t.id}-${current}-${i}`} t={t} />)}
        </div>

        {/* Mobile: 1 */}
        <div className="md:hidden">
          <TestimonialCard t={testimonials[current]} />
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-7">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => { setAutoplay(false); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-[#C8102E]' : 'w-2 h-2 bg-[#D4CCC0] hover:bg-[#A8A39C]'}`}
              aria-label={`Go to review ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
