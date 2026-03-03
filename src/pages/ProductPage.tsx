import React, { useState } from 'react';
import { PRODUCTS, FLUX_PREMIUM } from '@/data/products';
import { useBag } from '@/context/BagContext';
import { useApp } from '@/context/AppContext';
import FluxPanel from '@/components/FluxPanel';
import Footer from '@/components/Footer';
import { Product } from '@/data/products';

export default function ProductPage() {
  const { currentProductId, toast } = useApp();
  const { addToBag } = useBag();
  const [selectedSize, setSelectedSize] = useState('S');
  const [activeThumb, setActiveThumb] = useState(0);
  const [fluxProduct, setFluxProduct] = useState<Product | null>(null);

  const product = PRODUCTS.find(p => p.id === currentProductId);
  if (!product) return null;

  const handleAddToBag = () => {
    addToBag(product, selectedSize);
    toast('Added to bag');
  };

  return (
    <>
      <div className="bg-horizon">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] min-h-screen">
          {/* Left: imagery */}
          <div className="relative">
            <div className="sticky top-0 h-screen overflow-hidden">
              <div className={`w-full h-full ${product.thumbSwatches[activeThumb]} transition-all duration-500`} />
            </div>
            <div className="grid grid-cols-4 gap-[3px] mt-[3px]">
              {product.thumbSwatches.map((s, i) => (
                <div
                  key={i}
                  className={`aspect-square overflow-hidden cursor-pointer transition-opacity duration-300 ${activeThumb === i ? 'opacity-100' : 'opacity-45 hover:opacity-100'}`}
                  onClick={() => setActiveThumb(i)}
                >
                  <div className={`w-full h-full ${s} transition-transform duration-500 hover:scale-[1.06]`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="px-11 pt-24 pb-16 flex flex-col border-l border-[rgba(240,237,232,0.04)] bg-horizon">
            <div className="font-serif font-light text-[clamp(2rem,3vw,3rem)] tracking-[0.01em] leading-[1.1] text-mist mb-[10px]">{product.name}</div>
            <div className="text-[11.5px] tracking-[0.25em] text-mist opacity-[0.38] mb-12">{product.price}</div>

            <div className="mb-9">
              <div className="text-[7.5px] tracking-[0.55em] uppercase text-mist opacity-[0.22] mb-3">Size</div>
              <div className="flex gap-1.5 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`w-[42px] h-[42px] border flex items-center justify-center text-[9.5px] tracking-[0.1em] text-mist transition-all duration-200 ${selectedSize === s ? 'opacity-100 border-[rgba(240,237,232,0.6)]' : 'opacity-40 border-[rgba(240,237,232,0.1)] hover:opacity-80 hover:border-[rgba(240,237,232,0.35)]'}`}
                    onClick={() => setSelectedSize(s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="mb-9">
              <div className="text-[7.5px] tracking-[0.55em] uppercase text-mist opacity-[0.22] mb-3">About this piece</div>
              <p className="text-[11px] leading-[1.95] tracking-[0.06em] text-mist opacity-[0.38]">{product.description}</p>
            </div>

            <div className="mt-auto pt-12 flex flex-col gap-[9px]">
              <button
                className="w-full py-[17px] border border-[rgba(240,237,232,0.18)] text-[8.5px] tracking-[0.5em] uppercase text-mist bg-transparent transition-all duration-300 hover:bg-mist hover:text-horizon hover:border-mist"
                onClick={handleAddToBag}
              >Add to Bag</button>
              {product.flux && (
                <>
                  <button
                    className="w-full py-[17px] border border-[rgba(240,237,232,0.07)] text-[8.5px] tracking-[0.5em] uppercase text-mist bg-transparent opacity-55 transition-all duration-300 hover:opacity-100 hover:border-[rgba(240,237,232,0.28)]"
                    onClick={() => setFluxProduct(product)}
                  >Customize with Flux</button>
                  <div className="text-center text-[7.5px] tracking-[0.3em] text-mist opacity-[0.18] mt-0.5">
                    Made to your measurements · 4–6 weeks · +${FLUX_PREMIUM}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <FluxPanel product={fluxProduct} onClose={() => setFluxProduct(null)} />
    </>
  );
}
