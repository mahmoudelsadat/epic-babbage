'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import { Metadata } from 'next';

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    subtitle: 'Fastest response — usually within 30 minutes',
    value: '+20 100 000 0000',
    href: 'https://wa.me/201000000000',
    color: '#25D366',
    cta: 'Chat Now',
  },
  {
    icon: Mail,
    title: 'Email',
    subtitle: 'For detailed inquiries — 24h response',
    value: 'info@2mpharmacy.com',
    href: 'mailto:info@2mpharmacy.com',
    color: '#4facfe',
    cta: 'Send Email',
  },
  {
    icon: Phone,
    title: 'Phone',
    subtitle: 'Call us during business hours',
    value: '+20 100 000 0000',
    href: 'tel:+201000000000',
    color: '#C9A84C',
    cta: 'Call Now',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section
          className="py-20 text-center"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.08) 0%, transparent 70%), #060700' }}
        >
          <div className="container-2m">
            <div className="section-label mx-auto w-fit mb-4">Get in Touch</div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              We're Here to <span className="text-gradient-red">Help</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
              Questions about products, delivery, or your order? Our team is available 6 days a week to assist you.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16" style={{ background: '#0A0A0A' }}>
          <div className="container-2m">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
              {CONTACT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.title}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group p-6 rounded-2xl border border-white/6 hover:border-white/15 transition-all duration-300 block"
                    style={{ background: '#111' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${method.color}15`, border: `1px solid ${method.color}30` }}
                    >
                      <Icon size={22} style={{ color: method.color }} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{method.title}</h3>
                    <p className="text-gray-500 text-xs mb-3">{method.subtitle}</p>
                    <p className="text-gray-300 text-sm font-semibold mb-4">{method.value}</p>
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200"
                      style={{ background: `${method.color}20`, color: method.color, border: `1px solid ${method.color}30` }}
                    >
                      {method.cta} →
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Contact Form + Info */}
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-black text-white mb-6">Send Us a Message</h2>
                {submitted ? (
                  <div
                    className="p-8 rounded-2xl text-center"
                    style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)' }}
                  >
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-white font-black text-xl mb-2">Message Sent!</h3>
                    <p className="text-gray-400 text-sm">We'll get back to you within 24 hours. For faster help, chat with us on WhatsApp.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text', required: true },
                        { key: 'phone', label: 'Phone', placeholder: '01X XXXX XXXX', type: 'tel', required: false },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5">{field.label}</label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={form[field.key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8102E]/50 transition-all"
                        style={{ background: '#1a1a1a' }}
                      >
                        <option value="">Select a topic</option>
                        <option>Product Question</option>
                        <option>Order Status</option>
                        <option>Delivery Issue</option>
                        <option>Return / Refund</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message</label>
                      <textarea
                        placeholder="How can we help you?"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E]/50 transition-all resize-none"
                      />
                    </div>
                    <button type="submit" id="contact-submit" className="btn btn-primary w-full py-3">
                      <Send size={15} /> Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Info panel */}
              <div className="space-y-6">
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <h3 className="text-white font-bold mb-5">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-white">Business Hours</div>
                        <div className="text-xs text-gray-400">Saturday – Thursday: 9am – 9pm (Cairo)</div>
                        <div className="text-xs text-gray-500">Friday: Closed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-[#C8102E] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-white">Location</div>
                        <div className="text-xs text-gray-400">Egypt — Delivery Nationwide</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-white">WhatsApp (Preferred)</div>
                        <div className="text-xs text-gray-400">Fastest response — usually under 30 mins during business hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{ background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)' }}
                >
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <MessageCircle size={18} className="text-green-400" />
                    WhatsApp is Fastest
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">For order tracking, product questions, or urgent issues — WhatsApp gets you the fastest response from our team.</p>
                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full py-3 text-sm font-bold"
                    style={{ background: '#25D366', color: '#fff' }}
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
