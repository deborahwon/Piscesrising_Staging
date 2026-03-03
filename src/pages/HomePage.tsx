import React from 'react';
import { PRODUCTS } from '@/data/products';
import { useApp } from '@/context/AppContext';
import { Product } from '@/data/products';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="bg-horizon">
      {/* Hero */}
      <div className="relative w-full h-screen overflow-hidden cursor-crosshair">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(-1, -1)' }}
          src="/about-video.mp4"
        />
        {/* Film-grain texture */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none grain-overlay"
        />
        {/* Bottom fade into background */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '50%', background: 'linear-gradient(to bottom, transparent 0%, rgba(20,17,14,0.15) 30%, rgba(20,17,14,0.5) 60%, rgba(20,17,14,0.85) 85%, #14110e 100%)', zIndex: 2 }}
        />
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7.5px] tracking-[0.55em] text-mist opacity-20 animate-breathe pointer-events-none select-none" style={{ zIndex: 3 }}>
          SCROLL
        </div>
      </div>

      {/* New Arrivals label */}
      <div className="px-7 pt-[52px] pb-5 flex justify-between items-baseline" style={{ backgroundColor: '#14110e' }}>
        <h2 className="font-sans font-light text-[11px] tracking-[0.5em] uppercase text-mist opacity-20">
          New Arrivals
        </h2>
      </div>

      {/* Product grid — first 3 */}
      <HomeGrid />

      <Footer />
    </div>
  );
}

function HomeGrid() {
  const { openProduct } = useApp();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[3px]" style={{ backgroundColor: '#14110e' }}>
      {PRODUCTS.slice(0, 3).map((p: Product) => (
        <div
          key={p.id}
          className="relative overflow-hidden cursor-pointer group bg-mid"
          style={{ aspectRatio: '2/3' }}
          onClick={() => openProduct(p.id)}
        >
          <div
            className={`absolute inset-0 ${p.swatch} transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]`}
          />
          {/* Hover / mobile overlay */}
          <div className="absolute inset-0 flex flex-col justify-end px-4 pb-[18px] pt-5 bg-gradient-to-t from-[rgba(20,17,14,0.88)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-md:opacity-100">
            <div className="text-[9.5px] tracking-[0.3em] uppercase text-mist leading-none">
              {p.name}
            </div>
            <div className="text-[9px] tracking-[0.15em] text-earth mt-[5px] opacity-60">
              {p.price}
            </div>
            {p.flux && (
              <div className="text-[7px] tracking-[0.4em] text-salt mt-1 opacity-40">
                · Flux available
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
