import React from 'react';
import { COLLECTIONS } from '@/data/products';
import { useApp } from '@/context/AppContext';
import Footer from '@/components/Footer';

export default function CollectionsPage() {
  const { navigate } = useApp();

  return (
    <div className="bg-horizon pt-[72px]">
      <div className="px-7 pt-10 pb-9">
        <h1 className="font-serif font-light text-[10px] tracking-[0.55em] uppercase text-mist opacity-30">Collections</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
        {COLLECTIONS.map(c => (
          <div
            key={c.id}
            className="relative overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '3/4' }}
            onClick={() => navigate('shop')}
          >
            <div className={`absolute inset-0 ${c.swatch} transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]`} />
            <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 pt-[60px] bg-gradient-to-t from-[rgba(20,17,14,0.9)] to-transparent">
              <h2 className="font-serif font-light text-[clamp(1.6rem,3.5vw,2.6rem)] tracking-[0.02em] leading-[1.05] text-mist">{c.name}</h2>
              <span className="text-[8.5px] tracking-[0.4em] uppercase text-mist opacity-35 mt-2 block">{c.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
