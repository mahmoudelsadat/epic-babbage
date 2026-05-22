'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, ArrowRight, Zap, Check } from 'lucide-react';
import { products, type Product } from '@/lib/data';

const TABS = [
  { label: 'All Products', value: 'all' },
  { label: '💊 Pharmacy', value: 'pharmacy' },
  { label: '✨ Beauty', value: 'beauty' },
  { label: '🌿 Wellness', value: 'wellness' },
  { label: '🔖 On Sale', value: 'sale' },
];

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} size={11} className={s <= Math.round(rating) ? 'fill-[#B8922A] text-[#B8922A]' : 'text-[#D4CCC0]'} />
        ))}
      </div>
      <span className="text-[11px] text-[#A8A39C]">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

const BADGE_MAP: Record<string, { label: string; className: string }> = {
  sale:              { label: 'SALE',      className: 'badge badge-red' },
  new:               { label: 'NEW',       className: 'badge badge-sage' },
  hot:               { label: '🔥 HOT',    className: 'badge badge-gold-soft' },
  'pharmacist-pick': { label: '✅ RX PICK', className: 'badge badge-sky' },
};

function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const badge = product.badge ? BADGE_MAP[product.badge] : null;

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {badge && <span className={badge.className}>{badge.label}</span>}
          {discount > 0 && <span className="badge badge-red">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white border border-[#E4E0D8] shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-[#C8102E]"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={13} className={wishlisted ? 'fill-[#C8102E] text-[#C8102E]' : 'text-[#A8A39C]'} />
        </button>

        {/* Low stock */}
        {product.stockCount && product.stockCount < 15 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold text-[#D4856A] bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
            <Zap size={9} className="fill-current" /> Only {product.stockCount} left
          </div>
        )}

        {/* Quick Add */}
        <div className="product-card-actions">
          <button
            onClick={(e) => { e.preventDefault(); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
            className={`btn w-full text-xs py-2.5 ${added ? 'bg-[#6B8F71] border-[#6B8F71] text-white' : 'btn-primary'}`}
          >
            {added ? <><Check size={12} /> Added!</> : <><ShoppingCart size={12} /> Add to Cart</>}
          </button>
        </div>
      </div>

      {/* Body */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="product-card-body">
          <p className="text-[11px] text-[#A8A39C] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-[0.875rem] font-semibold text-[#1C1917] leading-snug mb-2 line-clamp-2 group-hover:text-[#C8102E] transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[1.05rem] font-black text-[#1C1917]">EGP {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#A8A39C] line-through">EGP {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return products;
    if (activeTab === 'sale') return products.filter((p) => p.badge === 'sale' || p.originalPrice);
    return products.filter((p) => p.category === activeTab);
  }, [activeTab]);

  return (
    <section className="py-16 bg-white">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">Best Sellers</div>
            <h2 className="section-title">Trending Products</h2>
          </div>
          <Link href="/pharmacy" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6B6560] hover:text-[#C8102E] transition-colors group">
            View All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              id={`filter-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[0.8rem] font-semibold transition-all duration-200 ${
                activeTab === tab.value
                  ? 'bg-[#C8102E] text-white shadow-sm'
                  : 'bg-[#F3F0EB] text-[#6B6560] hover:bg-[#EBE8E1] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/pharmacy" id="products-view-all" className="btn btn-ghost px-8 py-3">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
