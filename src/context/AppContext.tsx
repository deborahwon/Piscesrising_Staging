import React, { createContext, useContext, useState } from 'react';

type Page = 'home' | 'shop' | 'collections' | 'product' | 'about' | 'track' | 'returns' | 'contact' | 'faq' | 'privacy' | 'terms' | 'accessibility' | 'choices';

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentProductId: number | null;
  openProduct: (id: number) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  toast: (msg: string) => void;
  toastMsg: string;
  toastVisible: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  let toastTimer: ReturnType<typeof setTimeout>;

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const openProduct = (id: number) => {
    setCurrentProductId(id);
    navigate('product');
  };

  const toast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <AppContext.Provider value={{ currentPage, navigate, currentProductId, openProduct, navOpen, setNavOpen, toast, toastMsg, toastVisible }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
