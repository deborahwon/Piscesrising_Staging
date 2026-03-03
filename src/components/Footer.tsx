import React from 'react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-horizon border-t border-[rgba(240,237,232,0.04)] px-10 pt-16 pb-9">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-12 mb-14">
        <div>
          <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.28] mb-[18px]">Navigate</div>
          <div className="flex flex-col gap-[11px]">
            {[['shop', 'Shop'], ['about', 'About']].map(([page, label]) => (
              <button key={page} className="text-[10px] tracking-[0.22em] text-mist opacity-[0.48] hover:opacity-90 transition-opacity text-left" onClick={() => navigate(page as any)}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.28] mb-[18px]">Customer Care</div>
          <div className="flex flex-col gap-[11px]">
            {[['track', 'Track Your Order'], ['returns', 'Start A Return'], ['faq', 'FAQ'], ['contact', 'Contact Us']].map(([page, label], i) => (
              <button key={i} className="text-[10px] tracking-[0.22em] text-mist opacity-[0.48] hover:opacity-90 transition-opacity text-left" onClick={() => navigate(page as any)}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <span className="font-serif italic text-[1.05rem] font-light text-mist opacity-[0.55] block mb-[5px]">Stay in touch.</span>
          <span className="text-[8.5px] tracking-[0.25em] text-mist opacity-[0.32] block mb-[18px]">New arrivals and quiet dispatches.</span>
          <div className="flex border-b border-[rgba(240,237,232,0.12)]">
            <input className="flex-1 py-[9px] text-[10px] tracking-[0.18em] text-mist font-light bg-transparent outline-none placeholder:opacity-[0.3] placeholder:text-[9px] placeholder:tracking-[0.3em]" type="email" placeholder="Your email" />
            <button className="text-base text-mist opacity-[0.4] hover:opacity-90 transition-opacity pl-2">→</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 pt-7 border-t border-[rgba(240,237,232,0.04)]">
        <span className="text-[8px] tracking-[0.3em] text-mist opacity-[0.3]">© 2026 Pisces Rising. All rights reserved.</span>
        <div className="flex gap-[18px] flex-wrap">
          {[['accessibility', 'Accessibility'], ['choices', 'Your Privacy Choices'], ['terms', 'Terms of Use'], ['privacy', 'Privacy Notice']].map(([page, label]) => (
            <button key={page} className="text-[8px] tracking-[0.22em] text-mist opacity-[0.38] hover:opacity-80 transition-opacity" onClick={() => navigate(page as any)}>{label}</button>
          ))}
        </div>
        <a href="https://www.instagram.com/piscesrising_world/" target="_blank" rel="noopener noreferrer" className="text-[8.5px] tracking-[0.4em] text-mist opacity-[0.32] cursor-pointer hover:opacity-80 transition-opacity">IG</a>
      </div>
    </footer>
  );
}
