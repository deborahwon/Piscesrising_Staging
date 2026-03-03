import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { BagProvider } from '@/context/BagContext';
import Chrome from '@/components/Chrome';
import BagDrawer from '@/components/BagDrawer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import CollectionsPage from '@/pages/CollectionsPage';
import ProductPage from '@/pages/ProductPage';
import AboutPage from '@/pages/AboutPage';
import { TrackPage, ReturnsPage, ContactPage, PrivacyPage, TermsPage, AccessibilityPage, PrivacyChoicesPage } from '@/components/InfoPages';
import FAQPage from '@/pages/FAQPage';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().trim().email().max(255);

const GILL = "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif";

const LOGO_SVG = `<svg id="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 387.13 52.65" aria-hidden="true" style="height:18px;width:auto;fill:currentColor"><path d="M15.21,26.48c0-3.82-.46-4.97-.78-5.78h4.4c4.08,0,6.83,2.39,6.83,6.04,0,4.71-4.07,6.15-6.64,5.95l-.78-.06v3.54c0,1.67.4,4.43.78,6.09h-4.72c.38-1.49.92-3.48.92-7.04v-8.74ZM18.23,31.62c1.3-.23,4.24-.81,4.24-4.69,0-1.21-.38-2.56-1.3-3.56-.86-.95-1.86-1.12-2.83-1.24-.05.72-.11,1.7-.11,2.41v7.07Z"/><path d="M47.4,20.7c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/><path d="M77.34,24.84c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.11,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.04-4.02-6.04-7.3s2.67-6.24,5.99-6.24c1.84,0,3.13.6,4.1,1.03v3.33Z"/><path d="M109.94,24.78c-1.19-.66-2.86-1.55-5.26-1.55-4.51,0-7.66,3.56-7.66,8.36,0,4.4,2.7,8.19,7.45,8.19,3.1,0,4.86-1.44,5.96-2.33l-.16,3.33c-1.3.69-3.13,1.64-6.31,1.64-7.85,0-10.15-6.61-10.15-10.49,0-5.75,4.53-11.44,11.79-11.44,2.1,0,3.35.46,4.34.83v3.45Z"/><path d="M138.78,20.7l-1.54,3.33c-2.27-1.09-3.45-1.38-5.59-1.29v7.53h6.34l-1.73,3.02c-2.32-.72-3.08-.83-4.62-.95v7.88c2.59,0,4.02,0,8.31-1.55l-1.48,3.59h-10.61c.35-1.26.76-2.79.76-5.55v-10.55c0-1.47-.19-3.59-.76-5.46h10.9Z"/><path d="M166.1,24.84c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.1,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.05-4.02-6.05-7.3s2.67-6.24,5.99-6.24c1.83,0,3.13.6,4.1,1.03v3.33Z"/><path d="M203.02,25.4c0-2.53-.32-3.71-.54-4.46l3.94-.06c5.21-.09,7.66,3.25,7.66,6.15,0,3.51-2.91,5.23-3.83,5.75,1.81,3.39,4.29,6.58,6.69,9.66h-2.78c-2.73-2.5-3.97-4.05-8.15-9.97v5.32c0,1.67.03,2.36.57,4.66h-4.1c.43-2.13.54-3.71.54-5.58v-11.47ZM206.01,32.15c1.92-.58,4.99-1.49,4.99-4.8,0-1.61-.94-4.2-4.99-4.63v9.43Z"/><path d="M239.65,20.89c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/><path d="M271.52,25.02c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.11,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.04-4.02-6.04-7.3s2.67-6.24,5.99-6.24c1.84,0,3.13.6,4.1,1.03v3.33Z"/><path d="M298.57,20.89c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/><path d="M323.37,20.89c.38.98.57,1.49,2.16,3.65l9.15,12.36v-9.8c0-3.97-.24-4.97-.57-6.21h3.89c-.27,1.15-.51,2.3-.51,4.6v11.58c0,3.33.38,4.48.67,5.37h-3.75c-.35-1.15-1.03-2.16-1.73-3.1l-8.61-11.73v8.51c0,1.9.19,4.57.81,6.32h-4.29c.65-2.24.68-5.29.68-5.69v-12.96c-.97-1.32-1.51-1.87-2.73-2.9h4.83Z"/><path d="M372.27,24.97c-1.35-.75-3.54-1.95-6.42-1.95-3.43,0-7.29,2.67-7.29,8.45,0,4.71,3,8.51,8.2,8.51,1.84,0,2.62-.34,3.56-.75v-2.39c0-3.33-.59-4.2-1.35-5.29h4.94c-.22.66-.57,1.64-.57,3.74v2.56c0,1.44,0,1.87.38,3.33-1.38.57-3.37,1.41-7.1,1.41-9.09,0-11.17-6.38-11.17-10.46,0-2.73.86-5.52,2.54-7.65,2.16-2.76,4.72-3.82,9.01-3.82,2.46,0,4.02.4,5.26.72v3.59Z"/></svg>`;

function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { setError('Please enter a valid email.'); return; }
    setLoading(true);
    const { error: dbError } = await supabase
      .from('newsletter_signups')
      .insert({ email: parsed.data, source: 'coming_soon' });
    setLoading(false);
    if (dbError && dbError.code !== '23505') {
      setError('Something went wrong. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-horizon">
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(-1, -1)' }}
        src="/about-video.mp4"
      />
      {/* Grain */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none grain-overlay" />

      {/* Wordmark */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[901] px-5 py-5 mix-blend-difference pointer-events-none whitespace-nowrap flex items-center">
        <span className="text-mist" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
      </div>

      {/* Centered hero text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ animation: 'comingSoonIn 1.8s cubic-bezier(0.25,0,0,1) 1.5s both' }}
      >
        <p className="font-serif font-light text-mist text-[clamp(2.2rem,5vw,4.2rem)] leading-none tracking-[-0.01em]">
          Something is coming.
        </p>
        <p
        className="text-mist mt-[28px]"
          style={{ fontFamily: GILL, fontWeight: 300, fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.65 }}
        >
          Check back May 1, 2026.
        </p>
      </div>

      {/* Email capture — fixed bottom center */}
      <div
        className="z-10"
        style={{ animation: 'comingSoonIn 1.8s cubic-bezier(0.25,0,0,1) 1.5s both', position: 'fixed', bottom: '36px', left: 0, right: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Success state */}
        <div
          className="text-mist text-center transition-all duration-700"
          style={{
            fontFamily: GILL, fontWeight: 300, fontSize: '9px', letterSpacing: '0.45em',
            textTransform: 'uppercase', opacity: submitted ? 0.65 : 0,
            height: submitted ? 'auto' : 0, overflow: 'hidden',
            pointerEvents: submitted ? 'auto' : 'none',
          }}
        >
          You're on the list.
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center transition-all duration-700"
          style={{ opacity: submitted ? 0 : 1, height: submitted ? 0 : 'auto', overflow: 'hidden', pointerEvents: submitted ? 'none' : 'auto', width: '90%', maxWidth: '420px' }}
        >
          <div className="w-full flex items-center" style={{ borderBottom: '1px solid rgba(240,237,232,0.15)' }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="Your email"
              maxLength={255}
              className="coming-soon-input flex-1 bg-transparent outline-none py-[8px] text-[10px] tracking-[0.2em] placeholder:tracking-[0.3em]"
              style={{ fontFamily: GILL, fontWeight: 300, color: 'rgba(240,237,232,0.65)' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="pl-3 pb-[2px] text-base transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: loading ? 0.3 : 0.65, color: 'rgba(240,237,232,0.65)' }}
              aria-label="Subscribe"
            >
              →
            </button>
          </div>

          {error && (
            <p className="mt-[6px] self-start" style={{ fontFamily: GILL, fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(210,130,110,0.9)' }}>
              {error}
            </p>
          )}

          <p
            className="mt-[10px] text-mist self-start"
            style={{ fontFamily: GILL, fontWeight: 300, fontSize: '8px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.65)' }}
          >
            New arrivals and quiet dispatches.
          </p>
        </form>
      </div>
    </div>
  );
}

function AppInner() {
  const { currentPage, navigate, toastMsg, toastVisible } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      navigate('home');
    }
  }, []);

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    shop: <ShopPage />,
    collections: <CollectionsPage />,
    product: <ProductPage />,
    about: <AboutPage />,
    track: <TrackPage />,
    returns: <ReturnsPage />,
    contact: <ContactPage />,
    faq: <FAQPage />,
    privacy: <PrivacyPage />,
    terms: <TermsPage />,
    accessibility: <AccessibilityPage />,
    choices: <PrivacyChoicesPage />,
  };

  // ── COMING SOON MODE — flip to false to restore full site ──────
  const COMING_SOON = false;

  if (COMING_SOON) return <ComingSoon />;
  // ── END COMING SOON ───────────────────────────────────────────

  return (
    <div className="bg-horizon min-h-screen overflow-x-hidden">
      <Chrome />
      <BagDrawer />

      <div className="animate-pageIn">
        {pages[currentPage]}
      </div>

      {/* Toast */}
      <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-mist text-horizon text-[8.5px] tracking-[0.45em] uppercase px-7 py-3 z-[1200] whitespace-nowrap transition-all duration-300 pointer-events-none ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {toastMsg}
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <BagProvider>
        <AppInner />
      </BagProvider>
    </AppProvider>
  );
}
