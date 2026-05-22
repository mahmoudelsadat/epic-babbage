'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { products } from '@/lib/data';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck } from 'lucide-react';

// Mock cart state using first 3 products
const INITIAL_CART = products.slice(0, 3).map((p) => ({ ...p, qty: 1 }));

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const updateQty = (id: string, delta: number) => {
    setCart((c) => c.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id: string) => {
    setCart((c) => c.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;

  const handlePromo = () => {
    if (promoCode.toUpperCase() === '2MWELCOME') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try 2MWELCOME for 10% off!');
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center py-20" style={{ background: '#060700' }}>
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-black text-white mb-3">Your cart is empty</h1>
          <p className="text-gray-400 mb-8 text-center max-w-sm">Looks like you haven't added anything yet. Browse our premium products!</p>
          <Link href="/pharmacy" className="btn btn-primary px-10">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </main>
        <Footer />
        <FloatingButtons />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar cartCount={cart.reduce((s, i) => s + i.qty, 0)} />
      <main className="min-h-screen py-10" style={{ background: '#060700' }}>
        <div className="container-2m">
          <h1 className="text-3xl font-black text-white mb-8">
            Your Cart <span className="text-gray-500 text-xl font-normal">({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl border border-white/7 group hover:border-white/12 transition-all duration-200"
                  style={{ background: '#111' }}
                >
                  {/* Image */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: '#1A1A1A' }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">{item.brand}</p>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-gray-200 transition-colors">{item.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      {/* Qty */}
                      <div className="flex items-center gap-1 rounded-lg overflow-hidden border border-white/10" style={{ background: '#0E0E0E' }}>
                        <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-base font-black text-white">EGP {(item.price * item.qty).toLocaleString()}</div>
                        {item.qty > 1 && <div className="text-[11px] text-gray-500">EGP {item.price.toLocaleString()} each</div>}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link href="/pharmacy" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2">
                <ShoppingBag size={14} /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#111' }}>
                <div className="p-5 border-b border-white/6">
                  <h2 className="text-white font-black text-lg">Order Summary</h2>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-semibold">EGP {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-400 font-semibold' : 'text-white font-semibold'}>
                      {deliveryFee === 0 ? 'FREE 🎉' : `EGP ${deliveryFee}`}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <div className="text-[11px] text-gray-500 bg-white/3 rounded-lg px-3 py-2">
                      Add <span className="text-white font-bold">EGP {(500 - subtotal).toLocaleString()}</span> more for free delivery
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Promo (10% off)</span>
                      <span className="text-green-400 font-semibold">-EGP {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/8 pt-3 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-black text-xl">EGP {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="px-5 pb-5">
                  {!promoApplied ? (
                    <div>
                      <div className="flex gap-2 mb-1">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                          placeholder="Promo code"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50"
                        />
                        <button onClick={handlePromo} className="btn btn-ghost px-4 py-2 text-xs">
                          <Tag size={12} /> Apply
                        </button>
                      </div>
                      {promoError && <p className="text-red-400 text-xs">{promoError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                      ✓ Promo applied — 10% off!
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <div className="p-5 pt-0 space-y-3">
                  <Link
                    href="/checkout"
                    id="cart-checkout-btn"
                    className="btn btn-primary w-full py-4 text-base"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><Shield size={11} className="text-[#4facfe]" /> Secure</span>
                    <span className="flex items-center gap-1"><Truck size={11} className="text-[#43e97b]" /> Fast Delivery</span>
                  </div>

                  {/* Payment logos */}
                  <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/6">
                    {['💵 COD', '💳 Visa', '💳 MC', '⚡ InstaPay'].map((p) => (
                      <span key={p} className="text-[10px] text-gray-600">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
