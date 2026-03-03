import React, { useState } from 'react';
import { useBag } from '@/context/BagContext';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';

export default function BagDrawer() {
  const { bag, bagOpen, setBagOpen, removeFromBag } = useBag();
  const { toast } = useApp();
  const [loading, setLoading] = useState(false);

  const total = bag.reduce((s, i) => s + i.priceNum, 0);

  const handleCheckout = async () => {
    if (!bag.length) return;
    setLoading(true);
    try {
      const items = bag.map(item => ({
        name: item.isFlux ? `${item.name} — Flux (Made to Measure)` : item.name,
        price: item.priceNum,
        quantity: 1,
        description: item.isFlux
          ? `Size: MTM · Neckline: ${(item.fluxSelections as any)?.neckline ?? ''} · Sleeve: ${(item.fluxSelections as any)?.sleeve ?? ''} · Hem: ${(item.fluxSelections as any)?.hem ?? ''}`
          : `Size: ${item.selectedSize}`,
      }));

      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          successUrl: `${origin}/?checkout=success`,
          cancelUrl: `${origin}/?checkout=cancel`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[rgba(20,17,14,0.55)] z-[1000] transition-opacity duration-500 ${bagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setBagOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[min(400px,100vw)] bg-horizon border-l border-[rgba(240,237,232,0.05)] z-[1001] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)] ${bagOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Top */}
        <div className="flex justify-between items-center px-7 py-6 border-b border-[rgba(240,237,232,0.05)]">
          <span className="text-[9px] tracking-[0.5em] uppercase text-mist opacity-30">Your Bag</span>
          <button
            className="text-[8.5px] tracking-[0.4em] text-mist opacity-30 hover:opacity-90 transition-opacity"
            onClick={() => setBagOpen(false)}
          >
            CLOSE
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7">
          {bag.length === 0 ? (
            <div className="pt-16 font-serif italic text-[1.3rem] font-light text-mist opacity-[0.18] leading-relaxed">
              Your bag<br />is empty.
            </div>
          ) : (
            bag.map(item => (
              <div key={item.uid} className="grid grid-cols-[70px_1fr] gap-[18px] py-[22px] border-b border-[rgba(240,237,232,0.04)]">
                <div className="aspect-[2/3] overflow-hidden">
                  <div className={`w-full h-full ${item.swatch}`} />
                </div>
                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <div className="text-[9.5px] tracking-[0.2em] text-mist opacity-75">
                      {item.name}{item.isFlux ? ' — Flux' : ''}
                    </div>
                    <div className="text-[8.5px] tracking-[0.25em] text-mist opacity-[0.28] mt-0.5">
                      Size {item.selectedSize}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] tracking-[0.15em] text-mist opacity-40">{item.price}</span>
                    <button
                      className="text-[7.5px] tracking-[0.3em] text-mist opacity-20 hover:opacity-70 transition-opacity"
                      onClick={() => removeFromBag(item.uid)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom */}
        {bag.length > 0 && (
          <div className="px-7 pb-9 pt-6 border-t border-[rgba(240,237,232,0.05)]">
            <div className="flex justify-between text-[9.5px] tracking-[0.3em] text-mist opacity-30 mb-5">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <button
              className="w-full py-[18px] border border-[rgba(240,237,232,0.16)] text-[8.5px] tracking-[0.5em] uppercase text-mist bg-transparent transition-all duration-300 hover:bg-mist hover:text-horizon disabled:opacity-50"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
