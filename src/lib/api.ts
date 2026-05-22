// Simulated async API layer — drop-in replacement for real backend calls
import { products, categories, brands, testimonials, type Product, type Category } from '@/lib/data';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}): Promise<{ items: Product[]; total: number; hasMore: boolean }> {
  await delay();
  let items = [...products];

  if (filters?.category && filters.category !== 'all') {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters?.minPrice !== undefined) items = items.filter((p) => p.price >= filters.minPrice!);
  if (filters?.maxPrice !== undefined) items = items.filter((p) => p.price <= filters.maxPrice!);
  if (filters?.sortBy === 'price-asc') items.sort((a, b) => a.price - b.price);
  else if (filters?.sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
  else if (filters?.sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);

  const total = items.length;
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 8;
  const paged = items.slice((page - 1) * pageSize, page * pageSize);

  return { items: paged, total, hasMore: (page - 1) * pageSize + paged.length < total };
}

export async function getProduct(slug: string): Promise<Product | null> {
  await delay(100);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCategory(id: string): Promise<Category | null> {
  await delay(50);
  return categories.find((c) => c.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  await delay(50);
  return categories;
}

export async function searchProducts(query: string, limit = 6): Promise<Product[]> {
  await delay(80);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products
    .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .slice(0, limit);
}

export async function getProductsByBrand(brandName: string): Promise<Product[]> {
  await delay(150);
  return products.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase());
}

export async function getBrands() {
  await delay(50);
  return brands;
}

export async function getTestimonials() {
  await delay(100);
  return testimonials;
}
