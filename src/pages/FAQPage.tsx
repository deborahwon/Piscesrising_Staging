import React, { useState } from 'react';
import { InfoPage } from '@/components/InfoPages';

const SIZE_CHART = [
  { size: 'XS', bust: '32–33" / 81–84cm', waist: '24–25" / 61–64cm', hips: '34–35" / 86–89cm' },
  { size: 'S',  bust: '34–35" / 86–89cm', waist: '26–27" / 66–69cm', hips: '36–37" / 91–94cm' },
  { size: 'M',  bust: '36–37" / 91–94cm', waist: '28–29" / 71–74cm', hips: '38–39" / 97–99cm' },
  { size: 'L',  bust: '38–40" / 97–102cm', waist: '30–32" / 76–81cm', hips: '40–42" / 102–107cm' },
  { size: 'XL', bust: '41–43" / 104–109cm', waist: '33–35" / 84–89cm', hips: '43–45" / 109–114cm' },
  { size: 'XXL', bust: '44–46" / 112–117cm', waist: '36–38" / 91–97cm', hips: '46–48" / 117–122cm' },
];

function SizeChart() {
  return (
    <div className="mt-1 mb-[22px]">
      <div className="overflow-x-auto">
        <table className="w-full text-[9.5px] tracking-[0.08em] text-mist border-collapse">
          <thead>
            <tr className="border-b border-[rgba(240,237,232,0.08)]">
              {['Size', 'Bust', 'Waist', 'Hips'].map(h => (
                <th key={h} className="text-left py-[10px] pr-6 font-normal opacity-65 tracking-[0.35em] text-[7px] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row, i) => (
              <tr key={row.size} className={`border-b border-[rgba(240,237,232,0.04)] ${i % 2 === 0 ? '' : 'bg-[rgba(240,237,232,0.015)]'}`}>
                <td className="py-[11px] pr-6 opacity-80 font-normal tracking-[0.15em]">{row.size}</td>
                <td className="py-[11px] pr-6 opacity-65">{row.bust}</td>
                <td className="py-[11px] pr-6 opacity-65">{row.waist}</td>
                <td className="py-[11px] pr-6 opacity-65">{row.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[9.5px] tracking-[0.06em] leading-[1.9] text-mist opacity-[0.58] italic">
        Measurements are in inches and centimeters. If you fall between sizes, size up. For a precise fit, consider Flux — our made-to-measure program.
      </p>
    </div>
  );
}

const FAQ_SECTIONS = [
  {
    heading: 'Ordering & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards, Apple Pay, and Google Pay. All transactions are processed securely through Stripe.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'We begin production quickly on all orders. Please contact us within 24 hours of placing your order if you need to make a change. After that window, we cannot guarantee modifications. Flux orders cannot be modified or cancelled once confirmed.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Yes — a confirmation email is sent immediately after your order is placed. If you don\'t see it, check your spam folder or contact us at deborahwon@piscesrising.world.',
      },
    ],
  },
  {
    heading: 'Sizing & Fit',
    items: [
      {
        q: 'How do I find my size?',
        a: 'Our pieces are designed with ease and movement in mind. If you are between sizes, we recommend sizing up. For Flux orders, your garment is made to your exact measurements — sizing is not a concern.',
      },
      {
        q: 'Do your garments run true to size?',
        a: 'Generally yes, with a relaxed fit intended. Each product page notes any exceptions. When in doubt, reach out — we\'re happy to advise based on your measurements.',
      },
      {
        q: 'What if my order doesn\'t fit?',
        a: 'Standard ready-to-wear pieces may be returned within 10 days of receipt in unworn, original condition. Please see our Returns page to begin the process. Flux orders are final sale.',
      },
      {
        q: 'What are your measurements by size?',
        a: null, // rendered via custom component
      },
    ],
  },
  {
    heading: 'Flux — Made to Measure',
    items: [
      {
        q: 'What is Flux?',
        a: 'Flux is Pisces Rising\'s made-to-measure program. Select styles can be built to your specifications — length, silhouette, and size — so the garment is made specifically for your body.',
      },
      {
        q: 'How long does a Flux order take?',
        a: 'Please allow 3–4 weeks from order confirmation for production and delivery.',
      },
      {
        q: 'Can I return a Flux order?',
        a: 'Flux orders are final sale. Because each piece is made specifically for you, we are unable to accept returns or exchanges. We encourage you to reach out before ordering if you have any questions about fit or specifications.',
      },
      {
        q: 'How do I place a Flux order?',
        a: 'On any eligible product page, click "Build with Flux." You\'ll select your preferred length, silhouette, and size. If you have specific requests beyond the available options, contact us directly before ordering.',
      },
    ],
  },
  {
    heading: 'Shipping & Delivery',
    items: [
      {
        q: 'Where do you ship?',
        a: 'We currently ship within the United States.',
      },
      {
        q: 'How long does standard shipping take?',
        a: 'Ready-to-wear orders ship within 2–3 business days and typically arrive within 5–7 business days. You will receive a tracking number once your order has shipped.',
      },
      {
        q: 'How do I track my order?',
        a: 'Visit the Track Your Order page and enter your order number and email address. You can also use the tracking number provided in your shipping confirmation email.',
      },
    ],
  },
  {
    heading: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'Ready-to-wear items may be returned within 10 days of receipt in unworn, original condition with original packaging. Flux orders are final sale.',
      },
      {
        q: 'How do I start a return?',
        a: 'Visit the Start A Return page, enter your order number and email address, and follow the instructions. If you have any difficulty, contact us at deborahwon@piscesrising.world.',
      },
      {
        q: 'Do you offer exchanges?',
        a: 'We do not offer direct exchanges at this time. If you\'d like a different size, please return your original order and place a new one. Flux orders are final sale.',
      },
    ],
  },
  {
    heading: 'Details',
    items: [
      {
        q: 'How should I care for my Pisces Rising pieces?',
        a: 'Each garment includes care instructions on the interior label. As a general rule: hand wash or dry clean only, lay flat to dry, cool iron if needed. When in doubt, dry clean.',
      },
      {
        q: 'Where are Pisces Rising garments made?',
        a: 'All garments are made in New York City.',
      },
    ],
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string | null; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[rgba(240,237,232,0.05)]">
      <button
        className="w-full text-left py-[18px] flex justify-between items-start gap-6 group"
        onClick={onToggle}
      >
        <span className="text-[11px] tracking-[0.08em] leading-[1.7] text-mist opacity-85 group-hover:opacity-100 transition-opacity duration-300">
          {q}
        </span>
        <span className={`text-mist opacity-25 text-[13px] mt-[2px] flex-shrink-0 transition-transform duration-500 ${open ? 'rotate-45' : 'rotate-0'}`}>+</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {a === null ? (
          <SizeChart />
        ) : (
          <p className="text-[11px] tracking-[0.07em] leading-[2] text-mist opacity-[0.65] pb-[22px] pr-8">
            {a}
          </p>
        )}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key);

  return (
    <InfoPage eyebrow="FAQ" title="Frequently Asked Questions">
      <div className="mt-2 flex flex-col gap-14">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.heading}>
            <div className="text-[7px] tracking-[0.55em] uppercase text-mist opacity-[0.58] mb-5">
              {section.heading}
            </div>
            <div>
              {section.items.map((item, i) => {
                const key = `${section.heading}-${i}`;
                return (
                  <FAQItem
                    key={key}
                    q={item.q}
                    a={item.a}
                    open={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}
