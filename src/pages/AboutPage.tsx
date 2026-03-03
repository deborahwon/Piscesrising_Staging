import React from 'react';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="bg-horizon grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Visual — gradient column */}
      <div className="relative min-h-[60vh]">
        <div className="sticky top-0 h-screen pt-[120px]">
          <div
            className="w-full h-full"
            style={{
              backgroundColor: '#14110e',
              backgroundImage: `
                radial-gradient(ellipse 55% 55% at 40% 40%, #2a1f14 0%, transparent 100%),
                radial-gradient(ellipse 50% 50% at 70% 70%, #1a1510 0%, transparent 100%)
              `,
            }}
          />
        </div>
      </div>

      {/* Copy column */}
      <div className="px-[60px] pt-[120px] pb-20 flex flex-col justify-start max-md:px-7 max-md:pt-20 max-md:pb-16">
        <div className="text-[7.5px] tracking-[0.6em] uppercase text-mist opacity-20 mb-7">About</div>

        <div className="text-[11.5px] leading-[2.05] tracking-[0.07em] text-mist opacity-[0.38] max-w-[400px]">
          <p>I grew up feeling uncomfortable in my body. I found that certain types of clothes often made that worse — you'd put something on hoping it would help, and instead spend the whole day adjusting, pulling, holding yourself differently just to make it work. The garment doing its own thing, your body doing its own thing, and never the two shall meet.</p>
          <p className="mt-[22px]">What I wanted — what I think a lot of women want — is to get dressed and then forget you got dressed. To not be managing your clothes all day. To take as much of the work out of it as possible.</p>
          <p className="mt-[22px]">Pisces Rising is built on that conviction: that the act of wearing clothes should disappear in your life rather than interrupt it. That softness is not accidental — it is engineered, held through discipline. In a culture that confuses femininity with fragility, I am interested in something quieter and more enduring. Tenderness as structure. Romance as restraint. The body as a site of ease rather than effort.</p>
          <p className="mt-[22px]">The work draws from the tension between athleticism and girlhood, between engineering and ephemerality. Eveningwear techniques meet everyday wearability. Interior constructions matter as much as silhouette. Discipline lives in the stitch.</p>
          <p className="mt-[22px]">Pisces Rising is also a refusal — of irony, of noise, of constant novelty. Clothing as an artifact of care. A practice of attention. A form of moral beauty.</p>
          <p className="mt-[22px]">Softness is discipline. This is what I strive for.</p>
          <p className="mt-[28px] italic text-[10.5px] opacity-[0.7]">Deborah Won's work has been featured in Vogue, i-D Magazine, 1 Granary, Marie Claire, InStyle, and the Today Show. Select styles are available through Flux — Pisces Rising's made-to-measure program, for women who want a garment built specifically for their body.</p>
        </div>

        {/* Inquiries */}
        <div className="mt-16 pt-9 border-t border-[rgba(240,237,232,0.05)]">
          <div className="text-[7.5px] tracking-[0.55em] uppercase text-mist opacity-[0.18] mb-3">Inquiries</div>
          <a href="mailto:deborah@piscesrising.world" className="text-[11px] tracking-[0.15em] text-mist opacity-35 hover:opacity-90 transition-opacity block mb-1">deborah@piscesrising.world</a>
          <a href="tel:+19175249665" className="text-[11px] tracking-[0.15em] text-mist opacity-35 hover:opacity-90 transition-opacity block">(917) 524-9665</a>
        </div>
      </div>

      <div className="col-span-full"><Footer /></div>
    </div>
  );
}
