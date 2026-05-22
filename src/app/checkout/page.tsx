'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { products } from '@/lib/data';
import { Check, ChevronRight, MapPin, CreditCard, Truck, Shield, Phone } from 'lucide-react';
import Link from 'next/link';

type Step = 'cart' | 'delivery' | 'payment' | 'confirmation';

const GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
  'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qaliubiya', 'New Valley',
  'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta',
  'Sharkia', 'South Sinai', 'Kafr Al sheikh', 'Matruh', 'Luxor',
  'Qena', 'North Sinai', 'Sohag',
];

const MOCK_CART = products.slice(0, 2);

function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-white' : done ? 'text-[#C9A84C]' : 'text-gray-600'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
        done ? 'bg-[#C9A84C] border-[#C9A84C] text-black' :
        active ? 'bg-[#C8102E] border-[#C8102E] text-white' :
        'border-gray-700 text-gray-600'
      }`}>
        {done ? <Check size={13} /> : step}
      </div>
      <span className="text-xs font-semibold hidden sm:inline">{label}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '', email: '',
    governorate: '', city: '', address: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderNumber] = useState(`2M-${Date.now().toString().slice(-6)}`);

  const subtotal = MOCK_CART.reduce((s, p) => s + p.price, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const steps = ['Cart Review', 'Delivery Details', 'Payment'];

  if (step === 4) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-20" style={{ background: '#060700' }}>
          <div className="container-2m max-w-lg text-center">
            {/* Animated success */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                boxShadow: '0 0 40px rgba(67,233,123,0.4)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>

            <h1 className="text-4xl font-black text-white mb-3">Order Confirmed! 🎉</h1>
            <p className="text-gray-400 mb-6">
              Your order <span className="text-white font-bold">{orderNumber}</span> has been received and is being prepared.
            </p>

            <div
              className="p-5 rounded-2xl mb-6 text-left space-y-3"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Order Number</span>
                <span className="text-white font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment</span>
                <span className="text-white font-bold">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div
                  className="p-3 rounded-xl text-xs text-amber-300"
                  style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)' }}
                >
                  💵 You will pay <strong>EGP {total.toLocaleString()}</strong> in cash when your order arrives.
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Delivery</span>
                <span className="text-white font-bold">2–5 Business Days</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Total</span>
                <span className="text-white text-lg">EGP {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn btn-ghost flex-1">Back to Home</Link>
              <a
                href={`https://wa.me/201000000000?text=Hi!%20My%20order%20is%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex-1 text-white"
                style={{ background: '#25D366' }}
              >
                <Phone size={15} /> Track on WhatsApp
              </a>
            </div>
          </div>
        </main>
        <Footer />
        <FloatingButtons />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10" style={{ background: '#060700' }}>
        <div className="container-2m max-w-5xl">
          {/* Progress Steps */}
          <div className="flex items-center gap-3 sm:gap-6 mb-10 justify-center">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <StepIndicator current={step} step={i + 1} label={label} />
                {i < steps.length - 1 && (
                  <ChevronRight size={14} className={`${step > i + 1 ? 'text-[#C9A84C]' : 'text-gray-700'} flex-shrink-0`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Side */}
            <div className="lg:col-span-2">
              {/* Step 1 — Cart Review */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-black text-white mb-5">Review Your Items</h2>
                  <div className="space-y-3 mb-6">
                    {MOCK_CART.map((p) => (
                      <div key={p.id} className="flex gap-3 p-4 rounded-xl border border-white/7" style={{ background: '#111' }}>
                        <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: '#1A1A1A' }}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{p.brand}</p>
                          <p className="text-sm font-semibold text-white line-clamp-2">{p.name}</p>
                          <p className="text-sm font-black text-white mt-1">EGP {p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="btn btn-primary w-full py-4">
                    Continue to Delivery <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2 — Delivery */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                    <MapPin size={20} className="text-[#C8102E]" /> Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name *', placeholder: 'Your full name', required: true },
                        { key: 'phone', label: 'Phone Number *', placeholder: '01X XXXX XXXX', required: true },
                        { key: 'altPhone', label: 'Alternative Phone', placeholder: 'Optional', required: false },
                        { key: 'email', label: 'Email Address', placeholder: 'For order updates', required: false },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5">{field.label}</label>
                          <input
                            type={field.key === 'email' ? 'email' : 'text'}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={form[field.key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Governorate *</label>
                        <select
                          required
                          value={form.governorate}
                          onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#C8102E]/50 transition-all"
                          style={{ background: '#1a1a1a' }}
                        >
                          <option value="">Select Governorate</option>
                          {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">City / District *</label>
                        <input
                          type="text"
                          placeholder="e.g. Maadi, Nasr City"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Street Address *</label>
                      <input
                        type="text"
                        placeholder="Building, Street, Apartment..."
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Delivery Notes</label>
                      <textarea
                        placeholder="Any special delivery instructions?"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="btn btn-ghost flex-1">Back</button>
                      <button onClick={() => setStep(3)} className="btn btn-primary flex-1 py-4">
                        Continue to Payment <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                    <CreditCard size={20} className="text-[#C8102E]" /> Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {/* COD */}
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        paymentMethod === 'cod'
                          ? 'border-[#C8102E] bg-[#C8102E]/8'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      style={{ background: paymentMethod === 'cod' ? 'rgba(200,16,46,0.08)' : '#111' }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'border-[#C8102E]' : 'border-gray-600'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />}
                      </div>
                      <div className="text-3xl">💵</div>
                      <div>
                        <div className="font-bold text-white">Cash on Delivery (COD)</div>
                        <div className="text-xs text-gray-400 mt-0.5">Pay in cash when your order arrives at your door</div>
                      </div>
                      <div className="ml-auto">
                        <span className="badge badge-gold text-xs">Recommended</span>
                      </div>
                    </button>

                    {/* Card */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        paymentMethod === 'card' ? 'border-[#C8102E] bg-[#C8102E]/8' : 'border-white/10 hover:border-white/20'
                      }`}
                      style={{ background: paymentMethod === 'card' ? 'rgba(200,16,46,0.08)' : '#111' }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'card' ? 'border-[#C8102E]' : 'border-gray-600'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />}
                      </div>
                      <div className="text-3xl">💳</div>
                      <div>
                        <div className="font-bold text-white">Credit / Debit Card</div>
                        <div className="text-xs text-gray-400 mt-0.5">Visa, Mastercard — secure encrypted payment</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Shield size={12} className="text-[#4facfe]" />
                        <span className="text-[10px] text-[#4facfe]">Secure</span>
                      </div>
                    </button>
                  </div>

                  {/* COD note */}
                  {paymentMethod === 'cod' && (
                    <div
                      className="p-4 rounded-xl mb-6 text-sm"
                      style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)' }}
                    >
                      <p className="text-amber-300 font-semibold mb-1">💵 Cash on Delivery</p>
                      <p className="text-gray-400 text-xs">You will pay <strong className="text-white">EGP {total.toLocaleString()}</strong> in cash when the delivery person arrives at your door. Please have the exact amount ready.</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn btn-ghost flex-1">Back</button>
                    <button
                      onClick={() => setStep(4)}
                      className="btn btn-primary flex-1 py-4 text-base"
                    >
                      Place Order — EGP {total.toLocaleString()} <Check size={16} />
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                    <Shield size={11} /> <Truck size={11} /> Secure checkout · Easy returns · Authentic products
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#111' }}>
                <div className="p-4 border-b border-white/6">
                  <h3 className="text-white font-bold text-sm">Order Summary</h3>
                </div>
                <div className="p-4 space-y-3">
                  {MOCK_CART.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: '#1A1A1A' }}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                      <span className="text-xs font-bold text-white flex-shrink-0">EGP {p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/6 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">EGP {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Delivery</span>
                      <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>{deliveryFee === 0 ? 'FREE' : `EGP ${deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-white">EGP {total.toLocaleString()}</span>
                    </div>
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
