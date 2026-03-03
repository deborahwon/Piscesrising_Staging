import React from 'react';
import { Product } from '@/data/products';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openProduct } = useApp();

  return (
    <div
      className="product-card relative overflow-hidden cursor-pointer bg-mid group"
      style={{ aspectRatio: '2/3' }}
      onClick={() => openProduct(product.id)}
    >
      <div className={`absolute inset-0 ${product.swatch} transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]`} />
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[18px] pt-5 bg-gradient-to-t from-[rgba(20,17,14,0.88)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 max-md:opacity-100">
        <div className="text-[9.5px] tracking-[0.3em] uppercase text-mist leading-none">{product.name}</div>
        <div className="text-[9px] tracking-[0.15em] text-earth mt-[5px] opacity-60">{product.price}</div>
        {product.flux && <div className="text-[7px] tracking-[0.4em] text-salt mt-1 opacity-40">· Flux available</div>}
      </div>
    </div>
  );
}
