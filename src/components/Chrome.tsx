import React from 'react';
import { useApp } from '@/context/AppContext';
import { useBag } from '@/context/BagContext';

const LOGO_SVG = `<svg id="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 387.13 52.65" aria-hidden="true" style="height:18px;width:auto;fill:currentColor">
  <path d="M15.21,26.48c0-3.82-.46-4.97-.78-5.78h4.4c4.08,0,6.83,2.39,6.83,6.04,0,4.71-4.07,6.15-6.64,5.95l-.78-.06v3.54c0,1.67.4,4.43.78,6.09h-4.72c.38-1.49.92-3.48.92-7.04v-8.74ZM18.23,31.62c1.3-.23,4.24-.81,4.24-4.69,0-1.21-.38-2.56-1.3-3.56-.86-.95-1.86-1.12-2.83-1.24-.05.72-.11,1.7-.11,2.41v7.07Z"/>
  <path d="M47.4,20.7c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/>
  <path d="M77.34,24.84c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.11,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.04-4.02-6.04-7.3s2.67-6.24,5.99-6.24c1.84,0,3.13.6,4.1,1.03v3.33Z"/>
  <path d="M109.94,24.78c-1.19-.66-2.86-1.55-5.26-1.55-4.51,0-7.66,3.56-7.66,8.36,0,4.4,2.7,8.19,7.45,8.19,3.1,0,4.86-1.44,5.96-2.33l-.16,3.33c-1.3.69-3.13,1.64-6.31,1.64-7.85,0-10.15-6.61-10.15-10.49,0-5.75,4.53-11.44,11.79-11.44,2.1,0,3.35.46,4.34.83v3.45Z"/>
  <path d="M138.78,20.7l-1.54,3.33c-2.27-1.09-3.45-1.38-5.59-1.29v7.53h6.34l-1.73,3.02c-2.32-.72-3.08-.83-4.62-.95v7.88c2.59,0,4.02,0,8.31-1.55l-1.48,3.59h-10.61c.35-1.26.76-2.79.76-5.55v-10.55c0-1.47-.19-3.59-.76-5.46h10.9Z"/>
  <path d="M166.1,24.84c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.1,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.05-4.02-6.05-7.3s2.67-6.24,5.99-6.24c1.83,0,3.13.6,4.1,1.03v3.33Z"/>
  <path d="M203.02,25.4c0-2.53-.32-3.71-.54-4.46l3.94-.06c5.21-.09,7.66,3.25,7.66,6.15,0,3.51-2.91,5.23-3.83,5.75,1.81,3.39,4.29,6.58,6.69,9.66h-2.78c-2.73-2.5-3.97-4.05-8.15-9.97v5.32c0,1.67.03,2.36.57,4.66h-4.1c.43-2.13.54-3.71.54-5.58v-11.47ZM206.01,32.15c1.92-.58,4.99-1.49,4.99-4.8,0-1.61-.94-4.2-4.99-4.63v9.43Z"/>
  <path d="M239.65,20.89c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/>
  <path d="M271.52,25.02c-.89-.75-2.02-1.7-3.83-1.7s-3.13,1.21-3.13,2.9c0,2.04,1.7,3.1,4.24,4.66,2.91,1.78,3.72,3.48,3.72,5.55,0,3.56-2.62,6.15-6.85,6.15-1.59,0-2.54-.29-3.48-.58v-4.57c.92,1.12,2.11,2.62,3.97,2.62,1.75,0,3.02-1.49,3.02-3.02s-1.11-2.44-1.7-2.85c-4.32-2.87-6.04-4.02-6.04-7.3s2.67-6.24,5.99-6.24c1.84,0,3.13.6,4.1,1.03v3.33Z"/>
  <path d="M298.57,20.89c-.38,1.26-.76,2.44-.76,5.69v9.92c0,2.44.16,3.68.76,5.95h-4.56c.4-1.35.78-2.59.78-6.18v-10.26c0-2.44-.27-3.79-.78-5.12h4.56Z"/>
  <path d="M323.37,20.89c.38.98.57,1.49,2.16,3.65l9.15,12.36v-9.8c0-3.97-.24-4.97-.57-6.21h3.89c-.27,1.15-.51,2.3-.51,4.6v11.58c0,3.33.38,4.48.67,5.37h-3.75c-.35-1.15-1.03-2.16-1.73-3.1l-8.61-11.73v8.51c0,1.9.19,4.57.81,6.32h-4.29c.65-2.24.68-5.29.68-5.69v-12.96c-.97-1.32-1.51-1.87-2.73-2.9h4.83Z"/>
  <path d="M372.27,24.97c-1.35-.75-3.54-1.95-6.42-1.95-3.43,0-7.29,2.67-7.29,8.45,0,4.71,3,8.51,8.2,8.51,1.84,0,2.62-.34,3.56-.75v-2.39c0-3.33-.59-4.2-1.35-5.29h4.94c-.22.66-.57,1.64-.57,3.74v2.56c0,1.44,0,1.87.38,3.33-1.38.57-3.37,1.41-7.1,1.41-9.09,0-11.17-6.38-11.17-10.46,0-2.73.86-5.52,2.54-7.65,2.16-2.76,4.72-3.82,9.01-3.82,2.46,0,4.02.4,5.26.72v3.59Z"/>
</svg>`;

export default function Chrome() {
  const { navigate, setNavOpen, navOpen } = useApp();
  const { bag, setBagOpen } = useBag();

  return (
    <>
      {/* Wordmark */}
      <button
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[901] px-5 py-5 mix-blend-difference pointer-events-auto whitespace-nowrap flex items-center transition-opacity duration-300 hover:opacity-55"
        onClick={() => navigate('home')}
        aria-label="Pisces Rising — Home"
      >
        <span className="text-mist" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
      </button>

      {/* Menu button */}
      <button
        className="fixed top-0 left-0 z-[901] px-7 py-6 text-[9px] tracking-[0.4em] text-mist mix-blend-difference pointer-events-auto transition-opacity duration-300 hover:opacity-50"
        onClick={() => setNavOpen(true)}
      >
        MENU
      </button>

      {/* Bag button */}
      <button
        className="fixed top-0 right-0 z-[901] px-7 py-6 text-[9px] tracking-[0.4em] text-mist mix-blend-difference pointer-events-auto transition-opacity duration-300 hover:opacity-50"
        onClick={() => setBagOpen(true)}
      >
        BAG{bag.length > 0 && ` (${bag.length})`}
      </button>

      {/* Nav Overlay */}
      <nav
        className={`fixed inset-0 z-[950] flex flex-col justify-center px-[10vw] pointer-events-none transition-opacity duration-500 ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        style={{ backgroundColor: '#14110e' }}
      >
        <button
          className="absolute top-[22px] left-[26px] text-[9px] tracking-[0.4em] text-mist opacity-35 hover:opacity-100 transition-opacity duration-300"
          onClick={() => setNavOpen(false)}
        >
          CLOSE
        </button>

        <div className="flex flex-col gap-0">
          {(['home', 'shop', 'about'] as const).map((page) => (
            <button
              key={page}
              className="font-serif font-light text-[clamp(3rem,7vw,6.5rem)] leading-[1.1] tracking-[-0.01em] text-mist opacity-[0.12] hover:opacity-100 transition-opacity duration-250 text-left"
              onClick={() => { navigate(page); setNavOpen(false); }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>

        <div className="absolute bottom-9 left-[10vw] right-[10vw] flex justify-between items-end">
          <div className="flex gap-7">
            {(['track', 'returns', 'contact'] as const).map((page) => (
              <button
                key={page}
                className="text-[9px] tracking-[0.35em] text-mist opacity-25 hover:opacity-80 transition-opacity duration-300"
                onClick={() => { navigate(page); setNavOpen(false); }}
              >
                {page === 'track' ? 'Track Order' : page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
          <div className="text-[9px] tracking-[0.2em] text-mist opacity-20 text-right">
            deborah@piscesrising.world<br />(917) 524-9665
          </div>
        </div>
      </nav>
    </>
  );
}
