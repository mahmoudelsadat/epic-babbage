/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, TrendingUp, ShoppingBag, Database, Users, 
  ArrowRight, Search, Edit, RefreshCw, BarChart2, Filter, LogOut,
  CheckCircle, Truck, Clock, XCircle, Trash2, Plus, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { toast } from 'sonner';

interface AdminOrder {
  id: string;
  patient: string;
  items: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  date: string;
}

interface InventoryItem {
  sku: string;
  name: string;
  category: 'pharmacy' | 'beauty' | 'wellness';
  price: number;
  stock: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, isRtl } = useTranslation();
  const [authorized, setAuthorized] = useState(false);
  
  // States
  const [orders, setOrders] = useState<AdminOrder[]>([
    { id: '2M-91044', patient: 'Mahmoud El Sadat', items: 'Solgar D3 + Altruist Dry Skin', total: 890, status: 'shipped', date: 'May 22' },
    { id: '2M-90821', patient: 'Yasmin Nour', items: 'Altruist Sunscreen + Solgar Zinc', total: 720, status: 'delivered', date: 'May 18' },
    { id: '2M-90765', patient: 'Tarek Aly', items: 'Nordic Naturals Omega-3 120ct', total: 1250, status: 'pending', date: 'May 22' },
    { id: '2M-90510', patient: 'Farida Kamel', items: 'CeraVe Hydrating Cleanser 473ml', total: 680, status: 'canceled', date: 'May 15' }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Modal & Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'pharmacy' | 'beauty' | 'wellness'>('pharmacy');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formStock, setFormStock] = useState<number | ''>('');
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pharmacy' | 'beauty' | 'wellness'>('all');

  // Load inventory on mount
  useEffect(() => {
    const saved = localStorage.getItem('2m-inventory-catalog');
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse inventory from localStorage', e);
      }
    } else {
      const defaultInventory: InventoryItem[] = [
        { sku: 'SLG-D3-10K', name: 'Solgar Vitamin D3 (10,000 IU) 120sg', category: 'pharmacy', price: 540, stock: 45 },
        { sku: 'ALT-SUN-50', name: 'Altruist Sunscreen SPF50 100ml', category: 'beauty', price: 380, stock: 12 },
        { sku: 'ALT-10U-200', name: 'Altruist Dry Skin 10% Urea Cream', category: 'beauty', price: 420, stock: 85 },
        { sku: 'NDC-OMG-120', name: 'Nordic Naturals Omega-3 Lemon', category: 'wellness', price: 1250, stock: 24 },
        { sku: 'SLG-ZNC-50M', name: 'Solgar Zinc Picolinate 50mg 100ct', category: 'pharmacy', price: 340, stock: 0 },
        { sku: 'CRV-HYD-473', name: 'CeraVe Hydrating Cleanser 473ml', category: 'beauty', price: 680, stock: 30 }
      ];
      setInventory(defaultInventory);
      localStorage.setItem('2m-inventory-catalog', JSON.stringify(defaultInventory));
    }
  }, []);

  const handleAddClick = () => {
    setEditingItem(null);
    setFormSku('');
    setFormName('');
    setFormCategory('pharmacy');
    setFormPrice('');
    setFormStock('');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setFormSku(item.sku);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormStock(item.stock);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (sku: string) => {
    const itemToDelete = inventory.find(item => item.sku === sku);
    if (!itemToDelete) return;
    
    const confirmed = window.confirm(
      isRtl 
        ? `هل أنت متأكد من حذف المنتج "${itemToDelete.name}"؟` 
        : `Are you sure you want to delete "${itemToDelete.name}" from catalog?`
    );
    
    if (confirmed) {
      const updated = inventory.filter(item => item.sku !== sku);
      setInventory(updated);
      localStorage.setItem('2m-inventory-catalog', JSON.stringify(updated));
      toast.success(
        isRtl ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!',
        { description: `${itemToDelete.name} has been removed.`, duration: 3000 }
      );
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const errors: Record<string, string> = {};
    if (!formSku.trim()) {
      errors.sku = isRtl ? 'رمز SKU مطلوب' : 'SKU is required';
    } else if (!editingItem && inventory.some(item => item.sku.toLowerCase() === formSku.trim().toLowerCase())) {
      errors.sku = isRtl ? 'رمز SKU هذا مستخدم بالفعل لمنتج آخر' : 'This SKU is already in use by another product';
    }
    
    if (!formName.trim()) {
      errors.name = isRtl ? 'اسم المنتج مطلوب' : 'Product name is required';
    }
    
    if (formPrice === '' || formPrice <= 0) {
      errors.price = isRtl ? 'السعر يجب أن يكون أكبر من صفر' : 'Price must be greater than zero';
    }
    
    if (formStock === '' || formStock < 0) {
      errors.stock = isRtl ? 'الكمية يجب أن تكون صفر أو أكثر' : 'Stock cannot be negative';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const productData: InventoryItem = {
      sku: formSku.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      stock: Number(formStock)
    };
    
    let updatedInventory: InventoryItem[];
    
    if (editingItem) {
      // Update
      updatedInventory = inventory.map(item => item.sku === editingItem.sku ? productData : item);
      toast.success(
        isRtl ? 'تم تحديث المنتج بنجاح!' : 'Product updated successfully!',
        { description: productData.name, duration: 3000 }
      );
    } else {
      // Create
      updatedInventory = [...inventory, productData];
      toast.success(
        isRtl ? 'تمت إضافة المنتج بنجاح!' : 'Product added successfully!',
        { description: productData.name, duration: 3000 }
      );
    }
    
    setInventory(updatedInventory);
    localStorage.setItem('2m-inventory-catalog', JSON.stringify(updatedInventory));
    setIsFormOpen(false);
  };
  
  useEffect(() => {
    // Auth Check
    const adminLoggedIn = localStorage.getItem('2m-admin-logged-in');
    if (adminLoggedIn !== 'true') {
      router.push('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('2m-admin-logged-in');
    toast.success(isRtl ? 'تم تسجيل خروج المسؤول' : 'Admin logged out successfully');
    router.push('/admin');
  };

  const handleUpdateStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Status translation helper
    const statusText = {
      pending: isRtl ? 'قيد الانتظار' : 'Pending',
      shipped: isRtl ? 'تم الشحن' : 'Shipped',
      delivered: isRtl ? 'تم التوصيل' : 'Delivered',
      canceled: isRtl ? 'ملغي' : 'Canceled'
    };

    toast.success(
      isRtl ? `تم تحديث حالة الطلب ${orderId}` : `Order ${orderId} Updated`,
      { 
        description: isRtl 
          ? `الحالة الجديدة الآن هي: ${statusText[newStatus]}` 
          : `The status is now set to ${statusText[newStatus]}.`,
        duration: 3000
      }
    );
  };

  const getStatusIcon = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={14} />;
      case 'shipped': return <Truck className="text-blue-500" size={14} />;
      case 'delivered': return <CheckCircle className="text-emerald-500" size={14} />;
      case 'canceled': return <XCircle className="text-rose-500" size={14} />;
    }
  };

  const getStatusClass = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'canceled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    }
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!authorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-page-bg)]">
        <span className="w-12 h-12 border-4 border-[var(--color-brand-primary)]/30 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  // Visual Weekly Sales Mock Chart details
  const days = isRtl 
    ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] 
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const values = [12000, 18500, 15000, 24000, 19500, 28000, 22000];
  const maxValue = Math.max(...values);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-8" style={{ background: 'var(--color-page-bg)' }}>
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[var(--color-border-soft)]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase bg-amber-500/15 text-amber-600 border border-amber-500/20 px-3 py-0.5 rounded-full flex items-center gap-1">
                  <span>⚡</span> Live Admin Operations
                </span>
              </div>
              <h1 className="text-3xl font-black text-[var(--color-text-primary)] font-display tracking-tight flex items-center gap-2">
                {t('adminDashboard')}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-semibold">
                {isRtl ? 'مراقبة المبيعات وتعديل مخزون الصيدلية والطلبات في الوقت الفعلي' : 'Monitor sales, manage supplement cataloging, and dispatch orders in real time.'}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-brand-primary)]/5 hover:border-[var(--color-brand-primary)]/20 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <LogOut size={14} />
              {t('logout')}
            </button>
          </div>

          {/* 1. KPIs Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* KPI 1 */}
            <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider">
                  {t('revenue')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                EGP 145,280
              </p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                ▲ +14.2% {isRtl ? 'هذا الأسبوع' : 'this week'}
              </span>
            </div>

            {/* KPI 2 */}
            <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider">
                  {t('totalOrders')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                1,248
              </p>
              <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                ▲ +8.1% {isRtl ? 'هذا الشهر' : 'this month'}
              </span>
            </div>

            {/* KPI 3 */}
            <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider">
                  {t('productsCount')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Database size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                248 SKU
              </p>
              <span className="text-[10px] text-[var(--color-text-muted)] font-semibold flex items-center gap-1 mt-1">
                Active catalog tags
              </span>
            </div>

            {/* KPI 4 */}
            <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider">
                  {t('activePatients')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                4,520
              </p>
              <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                ▲ +150 {isRtl ? 'جديد اليوم' : 'new today'}
              </span>
            </div>
          </div>

          {/* 2. Charts & Orders grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            
            {/* SVG Weekly Sales Graph Chart */}
            <div className="lg:col-span-1 card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-[var(--color-border-soft)]">
                <BarChart2 size={16} className="text-[var(--color-brand-primary)]" />
                <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-wider font-display">
                  {isRtl ? 'تحليلات الإيرادات' : 'Revenue Analytics'}
                </h3>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase mb-4 tracking-wider">
                  {t('chartsLabel')}
                </p>

                {/* SVG Bar Chart Custom Component */}
                <div className="h-56 w-full flex items-end justify-between gap-2.5 px-2 relative pt-8">
                  {/* Chart Grid Lines */}
                  <div className="absolute left-0 right-0 top-1/4 border-t border-[var(--color-border-soft)]/50" />
                  <div className="absolute left-0 right-0 top-2/4 border-t border-[var(--color-border-soft)]/50" />
                  <div className="absolute left-0 right-0 top-3/4 border-t border-[var(--color-border-soft)]/50" />

                  {values.map((val, idx) => {
                    const heightPercent = (val / maxValue) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                        {/* Hover Price Overlay */}
                        <div className="absolute -top-6 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                          EGP {val.toLocaleString()}
                        </div>
                        
                        {/* Solid Bar */}
                        <motion.div 
                          className="w-full bg-gradient-to-t from-[var(--color-brand-primary)] to-[var(--color-brand-gold)] rounded-t-md cursor-pointer hover:brightness-110 shadow-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent * 1.3}px` }} // Scaled relative height
                          transition={{ delay: idx * 0.1, duration: 0.6 }}
                        />
                        
                        {/* Day Label */}
                        <span className="text-[9px] font-bold text-[var(--color-text-secondary)] mt-2 font-display">
                          {days[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Order management queue */}
            <div className="lg:col-span-2 card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--color-border-soft)]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-[var(--color-brand-gold)]" />
                  <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-wider font-display">
                    {t('recentOrders')}
                  </h3>
                </div>
                <button className="text-[10px] font-black text-[var(--color-brand-primary)] hover:underline flex items-center gap-1">
                  <RefreshCw size={10} />
                  {isRtl ? 'تحديث تلقائي نشط' : 'Live Sync Active'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-[var(--color-text-secondary)] font-medium text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border-soft)] text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider">
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Order ID</th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Patient</th>
                      <th className={`pb-3 hidden sm:table-cell ${isRtl ? 'text-right' : 'text-left'}`}>Prescription / Items</th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Amount</th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Status</th>
                      <th className={`pb-3 text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-soft)]/50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors">
                        <td className={`py-4 font-black text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>{order.id}</td>
                        <td className={`py-4 font-bold text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>{order.patient}</td>
                        <td className={`py-4 hidden sm:table-cell text-[var(--color-text-secondary)] ${isRtl ? 'text-right' : 'text-left'}`}>{order.items}</td>
                        <td className={`py-4 font-black text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>EGP {order.total}</td>
                        <td className={`py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="uppercase">{t(`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)}</span>
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as AdminOrder['status'])}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[10px] font-black uppercase text-[var(--color-text-primary)] px-2 py-1 focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors cursor-pointer"
                          >
                            <option value="pending">{t('statusPending')}</option>
                            <option value="shipped">{t('statusShipped')}</option>
                            <option value="delivered">{t('statusDelivered')}</option>
                            <option value="canceled">{t('statusCanceled')}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 3. Inventory Catalog Browser */}
          <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-[var(--color-border-soft)]">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-[var(--color-brand-primary)]" />
                  <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-wider font-display">
                    {isRtl ? 'متصفح المخزون الرقمي' : 'Digital Apothecary & Inventory'}
                  </h3>
                </div>
                <button
                  onClick={handleAddClick}
                  className="px-3.5 py-1.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 shadow-md btn-shimmer transition-all"
                >
                  <Plus size={13} />
                  <span>{isRtl ? 'إضافة منتج' : 'Add Product'}</span>
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search size={14} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRtl ? 'ابحث بالاسم أو رمز SKU...' : 'Search Name or SKU...'}
                    className={`bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl ${isRtl ? 'pl-4 pr-9' : 'pl-9 pr-4'} py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-all`}
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center bg-[var(--color-surface-2)] p-1 rounded-xl border border-[var(--color-border-soft)]">
                  {(['all', 'pharmacy', 'beauty', 'wellness'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                        categoryFilter === cat 
                          ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-soft)]' 
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {cat === 'all' ? (isRtl ? 'الكل' : 'All') : t(cat)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-[11px] text-[var(--color-text-secondary)] font-medium text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>SKU / Catalog Key</th>
                    <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Product Name</th>
                    <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Category</th>
                    <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Price</th>
                    <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>Stock Status</th>
                    <th className={`pb-3 ${isRtl ? 'text-left' : 'text-right'}`}>{isRtl ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]/50">
                  <AnimatePresence>
                    {filteredInventory.map(item => (
                      <tr key={item.sku} className="hover:bg-[var(--color-surface-2)]/30 transition-colors">
                        <td className={`py-3.5 font-bold font-mono text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>{item.sku}</td>
                        <td className={`py-3.5 font-bold text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>{item.name}</td>
                        <td className={`py-3.5 uppercase font-black text-[var(--color-brand-gold)] ${isRtl ? 'text-right' : 'text-left'}`}>{t(item.category)}</td>
                        <td className={`py-3.5 font-black text-[var(--color-text-primary)] ${isRtl ? 'text-right' : 'text-left'}`}>EGP {item.price}</td>
                        <td className={`py-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {item.stock > 0 ? (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              🟢 {item.stock} {isRtl ? 'وحدات متوفرة' : 'units in stock'}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                              🔴 {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
                            </span>
                          )}
                        </td>
                        <td className={`py-3.5 ${isRtl ? 'text-left' : 'text-right'}`}>
                          <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/5 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
                              title={isRtl ? 'تعديل' : 'Edit'}
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.sku)}
                              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/5 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors"
                              title={isRtl ? 'حذف' : 'Delete'}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredInventory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-[var(--color-text-muted)] font-bold">
                    ⚠️ {isRtl ? 'لم يتم العثور على منتجات تطابق البحث.' : 'No catalog items match your search filters.'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      
      {/* Product Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-2xl overflow-hidden z-10"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {/* Top Accent line */}
              <div className="h-1.5 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-gold)] w-full" />
              
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-[var(--color-border-soft)]">
                <h3 className="text-base font-black text-[var(--color-text-primary)] font-display uppercase tracking-wide">
                  {editingItem 
                    ? (isRtl ? 'تعديل بيانات المنتج' : 'Edit Product Details') 
                    : (isRtl ? 'إضافة منتج جديد' : 'Add New Product')
                  }
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
                {/* SKU */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider block">
                    {isRtl ? 'رمز SKU / معرّف الكتالوج' : 'SKU / Catalog Identifier'}
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    disabled={editingItem !== null}
                    placeholder="e.g. SLG-VIT-D3"
                    className={`w-full bg-[var(--color-surface-2)] disabled:opacity-60 border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs text-[var(--color-text-primary)] font-mono placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors block ${
                      formErrors.sku ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  />
                  {formErrors.sku && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">⚠️ {formErrors.sku}</p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider block">
                    {isRtl ? 'اسم المنتج' : 'Product Name'}
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={isRtl ? 'مثال: فيتامين د3 10000 وحدة' : 'e.g. Vitamin D3 10000 IU'}
                    className={`w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors block ${
                      formErrors.name ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">⚠️ {formErrors.name}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider block">
                    {isRtl ? 'الفئة / القسم' : 'Category Section'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors cursor-pointer block"
                  >
                    <option value="pharmacy">{isRtl ? 'الصيدلية' : 'Pharmacy 💊'}</option>
                    <option value="beauty">{isRtl ? 'الجمال والعناية' : 'Beauty & Care ✨'}</option>
                    <option value="wellness">{isRtl ? 'الصحة والعافية' : 'Wellness & Health 🌿'}</option>
                  </select>
                </div>

                {/* Price & Stock Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider block">
                      {isRtl ? 'السعر (جنيه)' : 'Price (EGP)'}
                    </label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="500"
                      className={`w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors block ${
                        formErrors.price ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">⚠️ {formErrors.price}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] tracking-wider block">
                      {isRtl ? 'الكمية بالمخزن' : 'Stock Units'}
                    </label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="25"
                      className={`w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors block ${
                        formErrors.stock ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                    {formErrors.stock && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">⚠️ {formErrors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex gap-3 pt-4 border-t border-[var(--color-border-soft)] mt-5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl text-xs font-black uppercase tracking-wider text-[var(--color-text-primary)] transition-all"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md btn-shimmer transition-all"
                  >
                    {editingItem 
                      ? (isRtl ? 'تحديث المنتج' : 'Update Product') 
                      : (isRtl ? 'حفظ المنتج' : 'Save Product')
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
