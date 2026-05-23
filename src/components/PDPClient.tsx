/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Shield, Truck, RefreshCw, ChevronRight, Plus, Minus, Share2, Check, Zap, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/data';

function StarRating({ rating, reviewCount, large }: { rating: number; reviewCount: number; large?: boolean }) {
  const size = large ? 16 : 12;
  return (
    <div className="flex items-center gap-1.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#C9A84C' : 'rgba(201,168,76,0.2)'}>
          <path d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.75L6 7.25 3.53 8.63 4 5.88 2 3.93l2.76-.42L6 1z" />
        </svg>
      ))}
      <span className={`text-gray-400 ${large ? 'text-sm' : 'text-xs'}`}>({reviewCount.toLocaleString()} reviews)</span>
    </div>
  );
}

interface PDPClientProps {
  product: Product;
  related: Product[];
}

export default function PDPClient({ product, related }: PDPClientProps) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewersCount, setViewersCount] = useState(8);

  useEffect(() => {
    setViewersCount(Math.floor(Math.random() * 15) + 5);
  }, []);

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'usage', label: 'How to Use' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Placeholder images (use same product image for demo)
  const images = [product.image, product.image, product.image];

  const MOCK_REVIEWS = [
    { name: 'Sara A.', rating: 5, text: 'Amazing product! Noticed results within 2 weeks. Will definitely reorder.', date: '3 days ago', verified: true },
    { name: 'Mohamed H.', rating: 5, text: 'Genuine product, arrived quickly. Great price compared to pharmacies.', date: '1 week ago', verified: true },
    { name: 'Nour K.', rating: 4, text: 'Good quality. Packaging was perfect. Delivery to Alexandria was fast!', date: '2 weeks ago', verified: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#060700' }}>
      <div className="container-2m py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${product.category}`} className="hover:text-white transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* Left — Gallery */}
          <div>
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden mb-4 group"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="badge badge-primary text-sm px-3 py-1">-{discount}%</span>
                </div>
              )}
              {product.badge === 'pharmacist-pick' && (
                <div className="absolute top-4 right-4">
                  <span
                    className="badge text-xs"
                    style={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', border: '1px solid rgba(79,172,254,0.3)' }}
                  >
                    ✅ Pharmacist Pick
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                    activeImage === i ? 'ring-2 ring-[var(--color-brand-primary)] opacity-100' : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{ background: '#111' }}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div>
            <div className="mb-2">
              <Link
                href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-bold text-[#C9A84C] hover:text-yellow-300 uppercase tracking-widest transition-colors"
              >
                {product.brand}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
              {product.name}
            </h1>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} large />

            {/* Social signals */}
            <div className="flex items-center gap-3 mt-3 mb-5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {viewersCount} people viewing now
              </span>
              {product.stockCount && product.stockCount < 20 && (
                <span className="flex items-center gap-1 text-orange-400 font-semibold">
                  <Zap size={11} className="fill-current" />
                  Only {product.stockCount} left
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-white/8">
              <span className="text-4xl font-black text-white">
                EGP {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="flex flex-col items-start mb-1">
                  <span className="text-sm text-gray-500 line-through">EGP {product.originalPrice.toLocaleString()}</span>
                  <span className="text-xs text-green-400 font-bold">
                    Save EGP {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* Qty Stepper */}
              <div
                className="flex items-center rounded-xl overflow-hidden border border-white/10"
                style={{ background: '#111' }}
              >
                <button
                  id="pdp-qty-minus"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-12 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-white font-bold text-sm">
                  {qty}
                </span>
                <button
                  id="pdp-qty-plus"
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-12 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="pdp-add-to-cart"
                onClick={handleAddToCart}
                className={`btn flex-1 text-sm py-3 transition-all duration-300 ${added ? 'bg-green-600 border-green-600' : 'btn-primary'}`}
                style={{ minHeight: '48px' }}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart — EGP {(product.price * qty).toLocaleString()}</>
                )}
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-3 mb-7">
              <button
                id="pdp-wishlist"
                onClick={() => setWishlisted(!wishlisted)}
                className={`btn btn-ghost flex-1 text-xs py-2.5 ${wishlisted ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : ''}`}
              >
                <Heart size={14} className={wishlisted ? 'fill-[var(--color-brand-primary)]' : ''} />
                {wishlisted ? 'Saved' : 'Save to Wishlist'}
              </button>
              <button
                id="pdp-share"
                onClick={handleShare}
                className="btn btn-ghost text-xs py-2.5 px-4"
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share</>}
              </button>
            </div>

            {/* Trust micro-bar */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { icon: Shield, label: '100% Authentic', color: '#4facfe' },
                { icon: Truck, label: '2–5 Day Delivery', color: '#43e97b' },
                { icon: RefreshCw, label: 'Easy Returns', color: '#C9A84C' },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Icon size={16} style={{ color }} />
                  <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/201115160947?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.name)}%20at%202M%20Premium%20Pharmacy`}
              target="_blank"
              rel="noopener noreferrer"
              id="pdp-whatsapp-cta"
              className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all duration-200 group"
            >
              <MessageCircle size={20} className="text-green-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">Have questions about this product?</div>
                <div className="text-xs text-green-400 group-hover:text-green-300 transition-colors">Chat with our pharmacist on WhatsApp →</div>
              </div>
            </a>
          </div>
        </div>

        {/* Product Detail Tabs */}
        <div className="mb-16">
          <div className="flex gap-0 border-b border-white/8 mb-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`pdp-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-[var(--color-brand-primary)] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {activeTab === 'description' && (
              <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                <p>{product.description}</p>
                <p>At 2M Premium Pharmacy, all products are sourced directly from authorized distributors and verified for authenticity. Every batch is traceable.</p>
                <ul className="space-y-2">
                  {product.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2">
                      <Check size={14} className="text-[#C9A84C] flex-shrink-0" />
                      <span className="capitalize">{tag.replace(/-/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="text-gray-300 text-sm leading-relaxed">
                <p className="mb-4">Full ingredient list and supplement facts:</p>
                <div className="p-4 rounded-xl border border-white/8" style={{ background: '#111' }}>
                  <p className="text-gray-400 text-xs">Please refer to the product label or contact our pharmacist for the full ingredient list specific to this product batch.</p>
                </div>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="space-y-3 text-gray-300 text-sm">
                <p>Follow the recommended dosage on the product label or as directed by your healthcare provider.</p>
                <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">⚠️ Important</p>
                  <p className="text-gray-400 text-xs">Keep out of reach of children. Store in a cool, dry place away from direct sunlight. Consult a healthcare professional if pregnant or nursing.</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Rating Summary */}
                <div
                  className="flex items-center gap-6 p-5 rounded-2xl mb-6"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-black text-white">{product.rating}</div>
                    <div className="flex gap-0.5 justify-center mt-1 mb-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} className={s <= Math.round(product.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-700'} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5,4,3,2,1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 w-4">{stars}</span>
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A84C] rounded-full"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/7" style={{ background: '#0E0E0E' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[#8B0000] flex items-center justify-center text-xs font-bold text-white">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          {review.name}
                          {review.verified && (
                            <span className="text-[10px] text-[#4facfe] bg-[#4facfe]/10 border border-[#4facfe]/20 rounded-full px-1.5 py-0.5">Verified</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => <Star key={s} size={9} className={s <= review.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-700'} />)}
                          </div>
                          <span className="text-[10px] text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="section-header mb-8">
              <div>
                <div className="section-label">You May Also Like</div>
                <h2 className="text-2xl font-black text-white">Related Products</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="product-card group block"
                >
                  <div className="product-card-image">
                    <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h3 className="text-xs font-semibold text-white leading-tight mb-1 line-clamp-2">{p.name}</h3>
                    <span className="text-sm font-black text-white">EGP {p.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
