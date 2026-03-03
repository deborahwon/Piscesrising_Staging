import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/data/products';

export interface BagItem extends Product {
  selectedSize: string;
  isFlux: boolean;
  uid: number;
  fluxSelections?: Record<string, unknown>;
}

interface BagContextType {
  bag: BagItem[];
  addToBag: (product: Product, size: string, isFlux?: boolean, fluxSelections?: Record<string, unknown>, overridePrice?: number) => void;
  removeFromBag: (uid: number) => void;
  clearBag: () => void;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
}

const BagContext = createContext<BagContextType | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  const addToBag = useCallback((product: Product, size: string, isFlux = false, fluxSelections?: Record<string, unknown>, overridePrice?: number) => {
    const item: BagItem = {
      ...product,
      priceNum: overridePrice ?? product.priceNum,
      price: overridePrice ? '$' + overridePrice.toLocaleString() : product.price,
      selectedSize: size,
      isFlux,
      uid: Date.now() + Math.random(),
      fluxSelections,
    };
    setBag(prev => [...prev, item]);
  }, []);

  const removeFromBag = useCallback((uid: number) => {
    setBag(prev => prev.filter(i => i.uid !== uid));
  }, []);

  const clearBag = useCallback(() => setBag([]), []);

  return (
    <BagContext.Provider value={{ bag, addToBag, removeFromBag, clearBag, bagOpen, setBagOpen }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used within BagProvider');
  return ctx;
}
