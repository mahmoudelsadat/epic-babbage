import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import PDPClient from '@/components/PDPClient';
import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | 2M Premium Pharmacy`,
    description: `${product.description} Shop authentic ${product.brand} products with Egypt-wide delivery.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        <PDPClient product={product} related={related} />
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
