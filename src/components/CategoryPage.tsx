'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3X3, List, Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { products, categories, type Product } from '@/lib/data';

interface FilterState {
  priceMin: number;
  priceMax: number;
  rating: number;
  brands: string[];
  badges: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 5000,
  rating: 0,
  brands: [],
  badges: [],
  inStockOnly: false,
  onSaleOnly: false,
};

const ALL_BRANDS = [...new Set(products.map((p) => p.brand))].sort();

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/6 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold text-white mb-3 hover:text-gray-200 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#C9A84C' : 'rgba(201,168,76,0.2)'}>
          <path d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.75L6 7.25 3.53 8.63 4 5.88 2 3.93l2.76-.42L6 1z" />
        </svg>
      ))}
      <span className="text-[10px] text-gray-500">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="product-card group relative">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" className="transition-transform duration-500 group-hover:scale-105" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && <span className="badge badge-primary">-{discount}%</span>}
          {product.badge === 'new' && <span className="badge" style={{ background: '#1a3a1a', color: '#43e97b', border: '1px solid rgba(67,233,123,0.3)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>NEW</span>}
          {product.badge === 'pharmacist-pick' && <span className="badge" style={{ background: 'rgba(79,172,254,0.1)', color: '#4facfe', border: '1px solid rgba(79,172,254,0.3)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>✅ PICK</span>}
          {product.badge === 'hot' && <span className="badge badge-gold">🔥 HOT</span>}
        </div>

        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <Heart size={13} className={wishlisted ? 'fill-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'text-white'} />
        </button>

        {product.stockCount && product.stockCount < 15 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-black/70 rounded-full px-2 py-0.5">
            <Zap size={9} className="fill-current" /> Only {product.stockCount} left
          </div>
        )}

        <div className="product-card-actions">
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
            className={`btn w-full text-xs py-2.5 ${added ? 'bg-green-600' : 'btn-primary'}`}
          >
            {added ? '✓ Added!' : <><ShoppingCart size={12} /> Add to Cart</>}
          </button>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block p-4">
        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-white leading-tight mb-2 line-clamp-2">{product.name}</h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-black text-white">EGP {product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="text-xs text-gray-500 line-through">EGP {product.originalPrice.toLocaleString()}</span>}
        </div>
      </Link>
    </div>
  );
}

interface CategoryPageProps {
  categoryId: string;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId);
  const allCategoryProducts = categoryId === 'all' ? products : products.filter((p) => p.category === categoryId);

  const filtered = useMemo(() => {
    let result = allCategoryProducts.filter((p) => {
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSaleOnly && !p.originalPrice) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (filters.rating > 0 && p.rating < filters.rating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest': result = [...result].filter((p) => p.badge === 'new').concat(result.filter((p) => p.badge !== 'new')); break;
    }
    return result;
  }, [allCategoryProducts, filters, sort]);

  const toggleBrand = useCallback((brand: string) => {
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter((b) => b !== brand) : [...f.brands, brand],
    }));
  }, []);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const activeFilterCount = [
    filters.inStockOnly, filters.onSaleOnly,
    filters.rating > 0,
    filters.brands.length > 0,
    filters.priceMin > 0 || filters.priceMax < 5000,
  ].filter(Boolean).length;

  const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#060700' }}>
      {/* Category Hero Banner */}
      {category && (
        <div
          className="relative py-12 sm:py-16 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${category.color}18, transparent 60%), #0D0D0D` }}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${category.color}, transparent 70%)` }} />
          <div className="container-2m relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${category.color}20`, border: `1px solid ${category.color}40` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">{category.name}</h1>
                <p className="text-gray-400 text-sm">{category.description} · <span className="text-white font-semibold">{category.productCount}+ products</span></p>
              </div>
            </div>

            {/* Subcategory chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['All', ...(category.id === 'pharmacy' ? ['Vitamins', 'Supplements', 'OTC', 'Baby', 'Devices'] :
                category.id === 'beauty' ? ['Skincare', 'Hair Care', 'Body', 'Cosmetics', 'Oral Care'] :
                category.id === 'wellness' ? ['Sports', 'Weight', 'Sleep', 'Immunity', "Women's"] :
                ['Hygiene', 'Grooming', 'Feminine', 'Eye & Ear'])].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip === 'All' ? null : chip)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    (chip === 'All' && !activeChip) || activeChip === chip
                      ? 'text-[#060700] font-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                  style={(chip === 'All' && !activeChip) || activeChip === chip ? { background: category.color } : {}}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-2m py-8">
        <div className="flex gap-7">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[var(--color-brand-primary)]" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[var(--color-brand-primary)] hover:text-red-400 transition-colors flex items-center gap-1">
                    <X size={11} /> Clear ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterSection title="Availability">
                <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
                  <div
                    onClick={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))}
                    className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 cursor-pointer ${filters.inStockOnly ? 'bg-[var(--color-brand-primary)]' : 'bg-white/15'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${filters.inStockOnly ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setFilters((f) => ({ ...f, onSaleOnly: !f.onSaleOnly }))}
                    className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 cursor-pointer ${filters.onSaleOnly ? 'bg-[var(--color-brand-primary)]' : 'bg-white/15'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${filters.onSaleOnly ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors">On Sale Only</span>
                </label>
              </FilterSection>

              <FilterSection title="Price Range (EGP)">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-brand-primary)]/50"
                    placeholder="Min"
                  />
                  <span className="text-gray-500 text-xs">–</span>
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-brand-primary)]/50"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  value={filters.priceMax}
                  onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                  className="w-full accent-[var(--color-brand-primary)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>EGP 0</span><span>EGP 5,000</span>
                </div>
              </FilterSection>

              <FilterSection title="Minimum Rating">
                <div className="space-y-1.5">
                  {[4, 3, 0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters((f) => ({ ...f, rating: r }))}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                        filters.rating === r ? 'bg-[var(--color-brand-primary)]/20 text-white border border-[var(--color-brand-primary)]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {r === 0 ? (
                        <span className="text-gray-400">All Ratings</span>
                      ) : (
                        <>
                          {[...Array(r)].map((_, i) => <Star key={i} size={10} className="fill-[#C9A84C] text-[#C9A84C]" />)}
                          <span>& up</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Brand" defaultOpen={false}>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {ALL_BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className={`w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center flex-shrink-0 ${
                          filters.brands.includes(brand)
                            ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {filters.brands.includes(brand) && <span className="text-white text-[10px] font-black">✓</span>}
                      </div>
                      <span className="text-xs text-gray-300 group-hover:text-white transition-colors leading-tight">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <SlidersHorizontal size={13} />
                  Filters {activeFilterCount > 0 && <span className="badge badge-primary text-[10px] px-1.5 py-0.5">{activeFilterCount}</span>}
                </button>
                <p className="text-xs text-gray-400">
                  <span className="text-white font-bold">{filtered.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[var(--color-brand-primary)]/50 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: '#111' }}>{o.label}</option>)}
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                  <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[var(--color-brand-primary)] text-white' : 'text-gray-400 hover:text-white'}`}><Grid3X3 size={13} /></button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[var(--color-brand-primary)] text-white' : 'text-gray-400 hover:text-white'}`}><List size={13} /></button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.inStockOnly && <span className="badge badge-dark gap-1">In Stock <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, inStockOnly: false}))} /></span>}
                {filters.onSaleOnly && <span className="badge badge-dark gap-1">On Sale <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, onSaleOnly: false}))} /></span>}
                {filters.rating > 0 && <span className="badge badge-dark gap-1">{filters.rating}★+ <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, rating: 0}))} /></span>}
                {filters.brands.map(b => <span key={b} className="badge badge-dark gap-1">{b} <X size={10} className="cursor-pointer" onClick={() => toggleBrand(b)} /></span>)}
              </div>
            )}

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-white font-bold text-xl mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className={view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-4'
              }>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileFiltersOpen(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <FilterSection title="Availability">
              <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
                <div onClick={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))}
                  className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 cursor-pointer ${filters.inStockOnly ? 'bg-[var(--color-brand-primary)]' : 'bg-white/15'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${filters.inStockOnly ? 'left-4' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-gray-300">In Stock Only</span>
              </label>
            </FilterSection>
            <FilterSection title="Price Range (EGP)">
              <div className="flex items-center gap-2 mb-3">
                <input type="number" value={filters.priceMin} onChange={(e) => setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="Min" />
                <span className="text-gray-500">–</span>
                <input type="number" value={filters.priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="Max" />
              </div>
            </FilterSection>
            <div className="flex gap-3 mt-6">
              <button onClick={clearFilters} className="btn btn-ghost flex-1">Clear All</button>
              <button onClick={() => setMobileFiltersOpen(false)} className="btn btn-primary flex-1">View {filtered.length} Products</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
