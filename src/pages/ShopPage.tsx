import React from 'react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function ShopPage() {
  return (
    <div className="bg-horizon pt-[72px]">
      <div className="px-7 py-10 pb-6 border-b border-[rgba(240,237,232,0.04)] flex justify-between items-baseline">
        <h1 className="font-serif font-light text-[10px] tracking-[0.55em] uppercase text-mist opacity-30">Shop</h1>
        <span className="text-[8.5px] tracking-[0.35em] text-mist opacity-[0.18]">{PRODUCTS.length} pieces</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[3px] bg-horizon">
        {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <Footer />
    </div>
  );
}
