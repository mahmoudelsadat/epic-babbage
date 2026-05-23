'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { products } from '@/lib/data';
import { Check, ChevronRight, MapPin, CreditCard, Truck, Shield, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/LanguageContext';

const GOVERNORATES_EN = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
  'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qaliubiya', 'New Valley',
  'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta',
  'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matruh', 'Luxor',
  'Qena', 'North Sinai', 'Sohag',
];

const GOVERNORATES_AR = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم',
  'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد',
  'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد', 'دمياط',
  'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر',
  'قنا', 'شمال سيناء', 'سوهاج',
];

const MOCK_CART = products.slice(0, 2);

function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-[var(--color-text-primary)] font-black' : done ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-text-muted)]'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
        done ? 'bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)] text-black shadow-sm' :
        active ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white shadow-md' :
        'border-[var(--color-border)] text-[var(--color-text-muted)]'
      }`}>
        {done ? <Check size={13} /> : step}
      </div>
      <span className="text-xs font-bold hidden sm:inline uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const { t, isRtl } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '', email: '',
    governorate: '', city: '', address: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderNumber] = useState(() => `2M-${Date.now().toString().slice(-6)}`);

  const subtotal = MOCK_CART.reduce((s, p) => s + p.price, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const steps = [
    isRtl ? 'مراجعة السلة' : 'Cart Review',
    isRtl ? 'تفاصيل التوصيل' : 'Delivery Details',
    isRtl ? 'طريقة الدفع' : 'Payment'
  ];

  const maxNotesLength = 300;

  if (step === 4) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-20" style={{ background: 'var(--color-page-bg)' }}>
          <div className="container-2m max-w-lg text-center px-4">
            
            {/* Animated success visual */}
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
              <Check size={36} className="text-white relative z-10" strokeWidth={3} />
            </div>

            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-3 font-display">
              {isRtl ? 'تم تأكيد طلبك بنجاح! 🎉' : 'Order Confirmed! 🎉'}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-semibold mb-6">
              {isRtl 
                ? <>طلبك ذو الرقم <span className="text-[var(--color-brand-primary)] font-black">{orderNumber}</span> قيد المراجعة والتحضير وسيتواصل معك الصيدلي فوراً.</>
                : <>Your order <span className="text-[var(--color-brand-primary)] font-bold">{orderNumber}</span> has been received and is being prepared by our pharmacists.</>
              }
            </p>

            <div
              className="p-5 rounded-2xl mb-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-3.5"
            >
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'رقم الطلب' : 'Order Number'}</span>
                <span className="text-[var(--color-text-primary)]">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</span>
                <span className="text-[var(--color-text-primary)]">
                  {paymentMethod === 'cod' 
                    ? (isRtl ? 'الدفع عند الاستلام' : 'Cash on Delivery') 
                    : (isRtl ? 'بطاقة الائتمان' : 'Credit Card')
                  }
                </span>
              </div>
              
              {paymentMethod === 'cod' && (
                <div
                  className="p-3 rounded-xl text-[10px] font-bold text-amber-600 bg-amber-500/5 border border-amber-500/10 text-center"
                >
                  💵 {isRtl 
                    ? <>ستقوم بدفع <strong className="text-amber-700 text-xs">EGP {total.toLocaleString()}</strong> نقداً عند استلام شحنتك.</>
                    : <>You will pay <strong className="text-amber-700 text-xs">EGP {total.toLocaleString()}</strong> in cash when your order arrives.</>
                  }
                </div>
              )}
              
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'التوصيل المتوقع' : 'Estimated Delivery'}</span>
                <span className="text-emerald-600 font-black">{isRtl ? '2-5 أيام عمل' : '2–5 Business Days'}</span>
              </div>
              
              <div className="flex justify-between text-xs font-black pt-2">
                <span className="text-[var(--color-text-primary)] uppercase">{isRtl ? 'الإجمالي النهائي' : 'Final Total'}</span>
                <span className="text-[var(--color-brand-primary)] text-base">EGP {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl transition-colors">
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
              <a
                href={`https://wa.me/201115160947?text=Hi!%20My%20order%20is%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Phone size={13} /> 
                {isRtl ? 'تتبع عبر الواتساب' : 'Track on WhatsApp'}
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
      <main className="min-h-screen py-12" style={{ background: 'var(--color-page-bg)' }}>
        <div className="container-2m max-w-5xl px-4">
          
          {/* Progress Steps Indicators */}
          <div className="flex items-center gap-3 sm:gap-6 mb-10 justify-center flex-wrap">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <StepIndicator current={step} step={i + 1} label={label} />
                {i < steps.length - 1 && (
                  <ChevronRight size={14} className={`${step > i + 1 ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-border)]'} ${isRtl ? 'rotate-180' : ''} flex-shrink-0`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Steps Side (2/3 width) */}
            <div className="lg:col-span-2">
              
              {/* Step 1 — Cart Review */}
              {step === 1 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-5 uppercase tracking-wider flex items-center gap-2">
                    <span>🛒</span>
                    {isRtl ? 'مراجعة منتجات السلة المميزة' : 'Review Selected Items'}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {MOCK_CART.map((p) => (
                      <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/30 hover:bg-[var(--color-surface-2)]/50 transition-colors">
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-white border border-[var(--color-border-soft)] p-0.5 shadow-sm">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <p className="text-[10px] text-[var(--color-brand-gold)] uppercase font-black tracking-wider">{p.brand}</p>
                          <p className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-2 mt-0.5">{p.name}</p>
                          <p className="text-xs font-black text-[var(--color-brand-primary)] mt-1.5">EGP {p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setStep(2)} 
                    className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-xl btn-shimmer btn-elevated"
                  >
                    <span>{isRtl ? 'الاستمرار لتفاصيل الشحن' : 'Continue to Delivery'}</span>
                    <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                </div>
              )}

              {/* Step 2 — Delivery details */}
              {step === 2 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--color-brand-primary)]" /> 
                    {isRtl ? 'بيانات الشحن والتوصيل' : 'Delivery Details'}
                  </h2>
                  
                  <div className="space-y-5">
                    
                    {/* Basic info Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('fullName')} *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('phone')} *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01115160947"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Alt Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'رقم هاتف بديل' : 'Alternative Phone'}</label>
                        <input
                          type="tel"
                          value={form.altPhone}
                          onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('email')}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Regional details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Governorate select */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'المحافظة *' : 'Governorate *'}</label>
                        <select
                          required
                          value={form.governorate}
                          onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-all cursor-pointer"
                        >
                          <option value="">{isRtl ? 'اختر محافظة...' : 'Select Governorate...'}</option>
                          {GOVERNORATES_EN.map((g, idx) => (
                            <option key={g} value={g}>
                              {isRtl ? GOVERNORATES_AR[idx] : g}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'المنطقة / الحي *' : 'City / District *'}</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Address Detail */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'العنوان التفصيلي بالكامل *' : 'Street Address *'}</label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'رقم العقار، الشارع، الشقة، أو علامات مميزة للعنوان...' : 'Building number, Street, Apartment, Landmark details...'}
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                      />
                    </div>

                    {/* ENHANCED TEXTAREA FOR DELIVERY NOTES WITH LIMITER */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('orderNotes')}</label>
                        <span className={`text-[9px] font-black ${
                          form.notes.length >= maxNotesLength ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'
                        }`}>
                          {form.notes.length} / {maxNotesLength} {t('charactersLeft')}
                        </span>
                      </div>
                      <textarea
                        maxLength={maxNotesLength}
                        rows={3}
                        placeholder={t('notesPlaceholder')}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Step Actions */}
                    <div className="flex gap-3 pt-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)} 
                        className="btn border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                      >
                        {isRtl ? 'السابق' : 'Back'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setStep(3)} 
                        className="btn btn-primary text-xs font-black uppercase tracking-wider py-3.5 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated"
                      >
                        <span>{isRtl ? 'الاستمرار لطرق الدفع' : 'Continue to Payment'}</span>
                        <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 3 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={18} className="text-[var(--color-brand-primary)]" /> 
                    {isRtl ? 'طريقة الدفع المفضلة' : 'Payment Method'}
                  </h2>

                  <div className="space-y-3.5 mb-6">
                    {/* Cash on Delivery option */}
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        paymentMethod === 'cod'
                          ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-inner'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:border-[var(--color-border-soft)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-text-muted)]'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-primary)]" />}
                      </div>
                      <div className="text-3xl">💵</div>
                      <div className={`text-right ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="font-black text-xs text-[var(--color-text-primary)]">
                          {isRtl ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold mt-0.5">
                          {isRtl ? 'ادفع نقداً في يد مندوب الشحن بمجرد تسلم طلبيتك' : 'Pay in cash when your order arrives at your door'}
                        </div>
                      </div>
                      <div className={`${isRtl ? 'mr-auto' : 'ml-auto'}`}>
                        <span className="text-[9px] font-black uppercase bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20 px-2 py-0.5 rounded">
                          {isRtl ? 'موصى به' : 'Recommended'}
                        </span>
                      </div>
                    </button>

                    {/* Card option (Visa/Mastercard) */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        paymentMethod === 'card' 
                          ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-inner' 
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:border-[var(--color-border-soft)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'card' ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-text-muted)]'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-primary)]" />}
                      </div>
                      <div className="text-3xl">💳</div>
                      <div className={`text-right ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="font-black text-xs text-[var(--color-text-primary)]">
                          {isRtl ? 'بطاقات مدى والائتمان' : 'Credit / Debit Card'}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold mt-0.5">
                          {isRtl ? 'فيزا وماستركارد — خادم تشفير معاملات بنكي آمن' : 'Visa, Mastercard — secure bank-level encrypted payment gateway'}
                        </div>
                      </div>
                      <div className={`${isRtl ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5`}>
                        <Shield size={12} className="text-[#4facfe]" />
                        <span className="text-[9px] text-[#4facfe] font-black uppercase">Secure</span>
                      </div>
                    </button>
                  </div>

                  {/* COD Informative alerts */}
                  {paymentMethod === 'cod' && (
                    <div
                      className="p-4 rounded-xl mb-6 text-xs bg-amber-500/5 border border-amber-500/10"
                    >
                      <p className="text-amber-600 font-black mb-1 flex items-center gap-1">
                        <span>💵</span> {isRtl ? 'الدفع نقدًا عند التوصيل' : 'Cash on Delivery Information'}
                      </p>
                      <p className="text-[var(--color-text-secondary)] font-semibold leading-relaxed">
                        {isRtl 
                          ? <>ستقوم بدفع مبلغ <strong className="text-[var(--color-brand-primary)]">EGP {total.toLocaleString()}</strong> عند التوصيل لمنزلك. يرجى تجهيز المبلغ المطلوب بدقة لتسريع التسليم.</>
                          : <>You will pay <strong className="text-[var(--color-brand-primary)]">EGP {total.toLocaleString()}</strong> in cash when the delivery personnel arrives. Please prepare the exact amount.</>
                        }
                      </p>
                    </div>
                  )}

                  {/* Action step buttons */}
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setStep(2)} 
                      className="btn border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                    >
                      {isRtl ? 'السابق' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="btn btn-primary text-xs font-black uppercase tracking-wider py-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated"
                    >
                      <span>{isRtl ? 'تأكيد الطلب الآن' : 'Place Order'} — EGP {total.toLocaleString()}</span>
                      <Check size={14} />
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-[var(--color-text-muted)] font-semibold mt-4 flex items-center justify-center gap-2">
                    <Shield size={11} />
                    <span>Secure Checkout</span>
                    <span>·</span>
                    <Truck size={11} />
                    <span>Genuine Products Guarantee</span>
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar Panel (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/50">
                  <h3 className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-wider font-display">
                    {isRtl ? 'ملخص الفاتورة والطلب' : 'Order Summary'}
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  {MOCK_CART.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-white border border-[var(--color-border-soft)] p-0.5 shadow-sm">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <p className="text-[11px] font-bold text-[var(--color-text-primary)] truncate">{p.name}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)] font-semibold">{p.brand}</p>
                      </div>
                      <span className="text-[11px] font-black text-[var(--color-text-primary)] flex-shrink-0">EGP {p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-[var(--color-border-soft)] pt-3.5 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[var(--color-text-secondary)]">{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="text-[var(--color-text-primary)]">EGP {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[var(--color-text-secondary)]">{isRtl ? 'قيمة الشحن' : 'Delivery Fee'}</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-600 font-black' : 'text-[var(--color-text-primary)]'}>
                        {deliveryFee === 0 ? (isRtl ? 'مجاني' : 'FREE') : `EGP ${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-black pt-2 border-t border-[var(--color-border-soft)]/60">
                      <span className="text-[var(--color-text-primary)] uppercase">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-[var(--color-brand-primary)] text-sm">EGP {total.toLocaleString()}</span>
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
