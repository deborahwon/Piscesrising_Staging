import React, { useState, useMemo } from 'react';
import { useBag } from '@/context/BagContext';
import { useApp } from '@/context/AppContext';
import { Product, FLUX_PREMIUM } from '@/data/products';
import {
  analyzeField,
  analyzeBody,
  parseFluxMeasurements,
  SEVERITY_COLORS,
  SEVERITY_BG,
  type FieldInsight,
  type FluxIntelligenceResult,
} from '@/lib/flux-intelligence';

interface FluxPanelProps {
  product: Product | null;
  onClose: () => void;
}

type FluxSelections = {
  neckline?: string;
  sleeve?: string;
  hem?: string;
  measurements?: Record<string, string>;
};

const SVG_IDS = {
  neckline: {
    high: 'svg-neckline-high',
    scoop: 'svg-neckline-scoop',
    necklace: 'svg-neckline-necklace',
  },
  sleeve: {
    sleeveless: 'svg-sleeve-sleeveless',
    short: 'svg-sleeve-short',
    threequarter: 'svg-sleeve-threequarter',
    long: 'svg-sleeve-long',
  },
  hem: {
    mini: 'svg-hem-mini',
    midi: 'svg-hem-midi',
    maxi: 'svg-hem-maxi',
  },
};

// ─── Percentile Chip sub-component ──────────────────────
function PercentileChip({ insight }: { insight: FieldInsight }) {
  return (
    <span
      className="text-[7px] tracking-[0.25em] uppercase whitespace-nowrap ml-1 transition-all duration-300"
      style={{ color: SEVERITY_COLORS[insight.severity] }}
    >
      {insight.label}
    </span>
  );
}

export default function FluxPanel({ product, onClose }: FluxPanelProps) {
  const { addToBag } = useBag();
  const { toast } = useApp();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<FluxSelections>({});
  const [consent, setConsent] = useState(false);
  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [measurements, setMeasurements] = useState<Record<string, string>>({
    heightFt: '', heightIn: '', heightCm: '',
    napeWaist: '', waistFloor: '', shoulder: '', bust: '', waist: '', hip: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [htwOpen, setHtwOpen] = useState<Record<string, boolean>>({});

  const isOpen = !!product;

  const pick = (group: keyof typeof SVG_IDS, value: string) => {
    setSelections(prev => ({ ...prev, [group]: value }));
  };

  const allPicked = selections.neckline && selections.sleeve && selections.hem;

  // ─── Live field insights (real-time as user types) ────
  const fieldInsights = useMemo(() => {
    const insights: Record<string, FieldInsight | null> = {};

    // Height
    let heightIn = 0;
    if (heightUnit === 'imperial') {
      const ft = parseFloat(measurements.heightFt);
      const inches = parseFloat(measurements.heightIn) || 0;
      if (ft >= 3 && ft <= 8) heightIn = ft * 12 + inches;
    } else {
      const cm = parseFloat(measurements.heightCm);
      if (cm >= 100 && cm <= 250) heightIn = cm / 2.54;
    }
    insights.height = heightIn > 0 ? analyzeField('height', heightIn) : null;

    // Body fields
    const fields = ['napeWaist', 'waistFloor', 'shoulder', 'bust', 'waist', 'hip'];
    for (const key of fields) {
      const v = parseFloat(measurements[key]);
      insights[key] = v > 0 ? analyzeField(key, v) : null;
    }

    return insights;
  }, [measurements, heightUnit]);

  // ─── Full intelligence result (when all fields complete) ──
  const intelligenceResult: FluxIntelligenceResult | null = useMemo(() => {
    const parsed = parseFluxMeasurements(measurements, heightUnit);
    if (!parsed) return null;
    return analyzeBody(parsed);
  }, [measurements, heightUnit]);

  const validateMeasurements = () => {
    const errs: Record<string, string> = {};

    if (heightUnit === 'imperial') {
      const ft = parseFloat(measurements.heightFt);
      if (!ft || ft < 3 || ft > 8) errs.height = 'Please enter a valid height';
    } else {
      const cm = parseFloat(measurements.heightCm);
      if (!cm || cm < 100 || cm > 250) errs.height = 'Please enter a valid height';
    }

    const numFields: Array<[string, string, number, number]> = [
      ['napeWaist', 'Nape to waist', 8, 30],
      ['waistFloor', 'Waist to floor', 20, 55],
      ['shoulder', 'Shoulder width', 10, 24],
      ['bust', 'Bust', 24, 60],
      ['waist', 'Waist', 18, 55],
      ['hip', 'Hip', 24, 70],
    ];

    const vals: Record<string, number> = {};
    numFields.forEach(([key, label, min, max]) => {
      const v = parseFloat(measurements[key]);
      if (!v || v < min || v > max) {
        errs[key] = `Please enter a valid ${label.toLowerCase()}`;
      } else {
        vals[key] = v;
      }
    });

    if (Object.keys(errs).length === 0) {
      if (vals.waist && vals.hip && vals.hip < vals.waist) errs.hip = 'Hip must be at least as large as waist';
      if (vals.napeWaist && vals.waistFloor && vals.napeWaist > vals.waistFloor) errs.napeWaist = 'Cannot exceed waist to floor';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !allPicked) { toast('Please complete all design selections'); return; }
    if (step === 2 && !validateMeasurements()) return;
    if (step < 3) setStep(s => s + 1);
  };

  const handlePlace = () => {
    if (!consent || !product) return;
    const measureSnapshot = {
      height: heightUnit === 'imperial' ? `${measurements.heightFt}′ ${measurements.heightIn}″` : `${measurements.heightCm} cm`,
      'nape-waist': measurements.napeWaist + '″',
      'waist-floor': measurements.waistFloor + '″',
      shoulder: measurements.shoulder + '″',
      bust: measurements.bust + '″',
      waist: measurements.waist + '″',
      hip: measurements.hip + '″',
    };
    addToBag(product, 'MTM', true, {
      neckline: selections.neckline,
      sleeve: selections.sleeve,
      hem: selections.hem,
      measurements: measureSnapshot,
      // Attach intelligence data for downstream use
      ...(intelligenceResult ? {
        intelligence: {
          grade: intelligenceResult.grade.value,
          sizeMismatch: intelligenceResult.sizeMismatch,
          overrides: intelligenceResult.overrides.length,
          maxZ: intelligenceResult.maxZ,
        },
      } : {}),
    }, product.priceNum + FLUX_PREMIUM);
    onClose();
    toast('Flux order added — made to your measurements');
  };

  const visibleLayers = {
    neckline: selections.neckline || 'high',
    sleeve: selections.sleeve || 'sleeveless',
    hem: selections.hem || 'midi',
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-[rgba(20,17,14,0.7)] z-[1090] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 bg-horizon z-[1100] flex flex-col transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-[22px] border-b border-[rgba(240,237,232,0.05)] flex-shrink-0">
          <span className="text-[7px] tracking-[0.65em] uppercase text-mist opacity-[0.22]">Flux — Made to Measure</span>
          <div className="flex gap-2 items-center">
            {[1, 2, 3].map(n => (
              <div key={n} className={`w-1 h-1 rounded-full bg-mist transition-opacity duration-300 ${step === n ? 'opacity-70' : step > n ? 'opacity-25' : 'opacity-10'}`} />
            ))}
          </div>
          <button className="text-[8.5px] tracking-[0.4em] text-mist opacity-[0.22] hover:opacity-90 transition-opacity" onClick={onClose}>CLOSE</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative" id="flux-body">

          {/* ═══════════════════════════════════════════════
              Step 1: Design
              ═══════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex flex-col md:flex-row h-full">
              {/* SVG Preview */}
              <div className="flex-[0_0_55%] flex items-center justify-center border-b md:border-b-0 md:border-r border-[rgba(240,237,232,0.04)] bg-mid min-h-[280px]">
                <svg viewBox="0 0 260 390" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-[260px] h-[390px] text-mist opacity-75">
                  {/* Necklines */}
                  <g style={{ display: visibleLayers.neckline === 'high' ? '' : 'none' }}>
                    <path d="M 112,94 Q 130,88 148,94" strokeWidth="1"/>
                    <path d="M 112,94 L 112,105" strokeWidth="1"/>
                    <path d="M 148,94 L 148,105" strokeWidth="1"/>
                    <path d="M 112,105 Q 130,109 148,105" strokeWidth="1"/>
                  </g>
                  <g style={{ display: visibleLayers.neckline === 'scoop' ? '' : 'none' }}>
                    <path d="M 102,105 Q 130,140 158,105" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.neckline === 'necklace' ? '' : 'none' }}>
                    <path d="M 88,105 Q 130,138 172,105" strokeWidth="1.5"/>
                  </g>
                  {/* Sleeves */}
                  <g style={{ display: visibleLayers.sleeve === 'sleeveless' ? '' : 'none' }}>
                    <path d="M 88,105 Q 82,125 80,148" strokeWidth="1.5"/>
                    <path d="M 172,105 Q 178,125 180,148" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.sleeve === 'short' ? '' : 'none' }}>
                    <path d="M 88,105 L 64,112 L 58,140 L 80,148" strokeWidth="1.5"/>
                    <path d="M 172,105 L 196,112 L 202,140 L 180,148" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.sleeve === 'threequarter' ? '' : 'none' }}>
                    <path d="M 88,105 L 62,110 L 44,200 L 62,205 L 80,148" strokeWidth="1.5"/>
                    <path d="M 172,105 L 198,110 L 216,200 L 198,205 L 180,148" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.sleeve === 'long' ? '' : 'none' }}>
                    <path d="M 88,105 L 60,110 L 38,258 L 56,263 L 80,148" strokeWidth="1.5"/>
                    <path d="M 172,105 L 200,110 L 222,258 L 204,263 L 180,148" strokeWidth="1.5"/>
                  </g>
                  {/* Bodice always */}
                  <path d="M 80,148 C 78,185 88,215 92,232" strokeWidth="1.5"/>
                  <path d="M 180,148 C 182,185 172,215 168,232" strokeWidth="1.5"/>
                  <path d="M 92,232 L 168,232" strokeWidth="0.5" opacity="0.4"/>
                  <path d="M 92,232 Q 86,255 84,272" strokeWidth="1.5"/>
                  <path d="M 168,232 Q 174,255 176,272" strokeWidth="1.5"/>
                  <path d="M 130,145 L 130,232" strokeWidth="0.5" opacity="0.25" strokeDasharray="2,4"/>
                  {/* Skirts */}
                  <g style={{ display: visibleLayers.hem === 'mini' ? '' : 'none' }}>
                    <path d="M 84,272 L 70,330" strokeWidth="1.5"/>
                    <path d="M 176,272 L 190,330" strokeWidth="1.5"/>
                    <path d="M 70,330 L 190,330" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.hem === 'midi' ? '' : 'none' }}>
                    <path d="M 84,272 L 56,382" strokeWidth="1.5"/>
                    <path d="M 176,272 L 204,382" strokeWidth="1.5"/>
                    <path d="M 56,382 L 204,382" strokeWidth="1.5"/>
                  </g>
                  <g style={{ display: visibleLayers.hem === 'maxi' ? '' : 'none' }}>
                    <path d="M 84,272 L 42,378" strokeWidth="1.5"/>
                    <path d="M 176,272 L 218,378" strokeWidth="1.5"/>
                    <path d="M 42,378 L 218,378" strokeWidth="1.5"/>
                  </g>
                </svg>
              </div>

              {/* Options */}
              <div className="flex-[0_0_45%] px-11 py-[52px] overflow-y-auto flex flex-col justify-center">
                <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-7">Design</div>
                <h2 className="font-serif font-light text-[clamp(1.6rem,2.5vw,2.4rem)] tracking-[0.01em] leading-[1.15] text-mist mb-10">Make it<br />yours.</h2>

                <OptionGroup label="Neckline" options={[
                  { key: 'high', name: 'High', desc: 'Close to the neck, elegant' },
                  { key: 'scoop', name: 'Scoop', desc: 'Open and relaxed' },
                  { key: 'necklace', name: 'Necklace', desc: 'Wide, sitting low on the chest' },
                ]} selected={selections.neckline} onSelect={v => pick('neckline', v)} />

                <OptionGroup label="Sleeve" options={[
                  { key: 'sleeveless', name: 'Sleeveless', desc: 'Clean armhole, unencumbered' },
                  { key: 'short', name: 'Short', desc: 'Cap sleeve, above the elbow' },
                  { key: 'threequarter', name: 'Three-quarter', desc: 'Falls between elbow and wrist' },
                  { key: 'long', name: 'Long', desc: 'Full length to the wrist' },
                ]} selected={selections.sleeve} onSelect={v => pick('sleeve', v)} />

                <OptionGroup label="Hem" options={[
                  { key: 'mini', name: 'Mini', desc: 'Above the knee' },
                  { key: 'midi', name: 'Midi', desc: 'Below the knee, above the ankle' },
                  { key: 'maxi', name: 'Maxi', desc: 'Floor-length' },
                ]} selected={selections.hem} onSelect={v => pick('hem', v)} />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              Step 2: Measurements + Live Intelligence
              ═══════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="flex flex-col items-center px-7 py-[52px] overflow-y-auto">
              <div className="w-full max-w-[560px]">
                <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-5">Measurements</div>
                <h2 className="font-serif font-light text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-[0.01em] leading-[1.15] text-mist mb-3">Your<br />specifications.</h2>
                <p className="text-[9.5px] tracking-[0.08em] leading-[1.9] text-mist opacity-[0.28] mb-10 max-w-[420px]">For the best fit, have your measurements taken by a professional tailor. All measurements in inches unless otherwise noted.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Height full width */}
                  <div
                    className="col-span-full py-[18px] border-b border-[rgba(240,237,232,0.06)]"
                    style={{ background: fieldInsights.height ? SEVERITY_BG[fieldInsights.height.severity] : 'transparent' }}
                  >
                    <div className="text-[7px] tracking-[0.55em] uppercase text-mist opacity-[0.22] mb-[10px] flex justify-between items-center">
                      Height
                      <div className="flex">
                        <button className={`text-[6.5px] tracking-[0.4em] uppercase px-[6px] py-[2px] border border-[rgba(240,237,232,0.1)] text-mist font-sans transition-all ${heightUnit === 'imperial' ? 'opacity-80 border-[rgba(240,237,232,0.35)]' : 'opacity-30'}`} onClick={() => setHeightUnit('imperial')}>ft / in</button>
                        <button className={`text-[6.5px] tracking-[0.4em] uppercase px-[6px] py-[2px] border border-l-0 border-[rgba(240,237,232,0.1)] text-mist font-sans transition-all ${heightUnit === 'metric' ? 'opacity-80 border-[rgba(240,237,232,0.35)]' : 'opacity-30'}`} onClick={() => setHeightUnit('metric')}>cm</button>
                      </div>
                    </div>
                    {heightUnit === 'imperial' ? (
                      <div className="flex gap-2 items-baseline">
                        <input className="flux-input w-[50px]" type="number" min="3" max="8" placeholder="5" value={measurements.heightFt} onChange={e => setMeasurements(p => ({ ...p, heightFt: e.target.value }))} />
                        <span className="flux-unit">ft</span>
                        <input className="flux-input w-[50px]" type="number" min="0" max="11" placeholder="7" value={measurements.heightIn} onChange={e => setMeasurements(p => ({ ...p, heightIn: e.target.value }))} />
                        <span className="flux-unit">in</span>
                        {fieldInsights.height && <PercentileChip insight={fieldInsights.height} />}
                      </div>
                    ) : (
                      <div className="flex gap-2 items-baseline">
                        <input className="flux-input" type="number" min="100" max="250" placeholder="170" value={measurements.heightCm} onChange={e => setMeasurements(p => ({ ...p, heightCm: e.target.value }))} />
                        <span className="flux-unit">cm</span>
                        {fieldInsights.height && <PercentileChip insight={fieldInsights.height} />}
                      </div>
                    )}
                    {errors.height && <div className="flux-error">{errors.height}</div>}
                  </div>

                  {[
                    { key: 'napeWaist', label: 'Nape to waist', min: 8, max: 30, placeholder: '15.5', htw: 'From the prominent bone at the back of your neck (nape) straight down to your natural waist.' },
                    { key: 'waistFloor', label: 'Waist to floor', min: 20, max: 55, placeholder: '40.5', htw: 'From your natural waist straight down to the floor. Stand barefoot on a flat surface.' },
                    { key: 'shoulder', label: 'Shoulder width', min: 10, max: 24, placeholder: '14.5', htw: 'From shoulder point to shoulder point across the back, following the natural curve of your shoulders.' },
                    { key: 'bust', label: 'Bust', min: 24, max: 60, placeholder: '35', htw: 'Around the fullest part of your chest, keeping the tape parallel to the floor.' },
                    { key: 'waist', label: 'Waist', min: 18, max: 55, placeholder: '28', htw: 'Around your natural waist — the narrowest part of your torso, typically an inch above your navel.' },
                    { key: 'hip', label: 'Hip', min: 24, max: 70, placeholder: '38', htw: 'Around the fullest part of your hips and seat, keeping the tape parallel to the floor.' },
                  ].map(f => {
                    const insight = fieldInsights[f.key];
                    return (
                      <div
                        key={f.key}
                        className={`py-[18px] border-b border-[rgba(240,237,232,0.06)] ${['napeWaist', 'shoulder', 'bust', 'waist'].includes(f.key) ? 'pr-7 border-r-0 sm:border-r sm:border-[rgba(240,237,232,0.04)]' : 'pl-0 sm:pl-7'}`}
                        style={{ background: insight ? SEVERITY_BG[insight.severity] : 'transparent' }}
                      >
                        <div className="text-[7px] tracking-[0.55em] uppercase text-mist opacity-[0.22] mb-[10px]">{f.label}</div>
                        <div className="flex gap-2 items-baseline">
                          <input
                            className={`flux-input ${errors[f.key] ? 'border-[rgba(200,120,100,0.7)]' : ''}`}
                            type="number"
                            min={f.min}
                            max={f.max}
                            step="0.25"
                            placeholder={f.placeholder}
                            value={measurements[f.key]}
                            onChange={e => setMeasurements(p => ({ ...p, [f.key]: e.target.value }))}
                          />
                          <span className="flux-unit">in</span>
                          {insight && <PercentileChip insight={insight} />}
                        </div>
                        {errors[f.key] && <div className="flux-error">{errors[f.key]}</div>}
                        <button
                          className="text-[7px] tracking-[0.3em] text-mist opacity-20 hover:opacity-60 transition-opacity mt-2 block border-b border-[rgba(240,237,232,0.12)]"
                          onClick={() => setHtwOpen(p => ({ ...p, [f.key]: !p[f.key] }))}
                        >
                          How to measure {htwOpen[f.key] ? '↑' : '↓'}
                        </button>
                        {htwOpen[f.key] && (
                          <div className="text-[9.5px] tracking-[0.07em] leading-[1.85] text-mist opacity-[0.28] mt-2.5 p-3 border border-[rgba(240,237,232,0.05)] bg-[rgba(240,237,232,0.02)]">{f.htw}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live Pattern Intelligence summary bar */}
                {intelligenceResult && (
                  <div className="mt-8 p-4 border border-[rgba(240,237,232,0.08)] bg-[rgba(240,237,232,0.02)]">
                    <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-3">Pattern Intelligence</div>
                    <p className="text-[9px] tracking-[0.06em] leading-[1.85] text-mist opacity-[0.4]">{intelligenceResult.summary}</p>
                    {intelligenceResult.sizeMismatch && (
                      <p className="text-[8px] tracking-[0.06em] leading-[1.85] mt-2" style={{ color: 'rgba(210,170,110,0.8)' }}>{intelligenceResult.sizeMismatchDetail}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              Step 3: Review + Intelligence Summary
              ═══════════════════════════════════════════════ */}
          {step === 3 && product && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left: review */}
              <div className="flex-[0_0_52%] px-[52px] py-[52px] border-b md:border-b-0 md:border-r border-[rgba(240,237,232,0.04)] overflow-y-auto">
                <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-5">Review</div>
                <h2 className="font-serif font-light text-[clamp(1.6rem,2.5vw,2.4rem)] tracking-[0.01em] leading-[1.15] text-mist mb-9">Confirm<br />your order.</h2>

                {/* Design review */}
                <div className="mb-8">
                  <div className="flex justify-between items-baseline text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-3">
                    Design
                    <button className="text-mist opacity-30 hover:opacity-80 border-b border-[rgba(240,237,232,0.12)]" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  {[['Garment', product.name], ['Neckline', selections.neckline || '—'], ['Sleeve', selections.sleeve || '—'], ['Hem', selections.hem || '—']].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-baseline py-[7px] border-b border-[rgba(240,237,232,0.04)]">
                      <span className="text-[8.5px] tracking-[0.2em] uppercase text-mist opacity-[0.28]">{label}</span>
                      <span className="text-[9.5px] tracking-[0.12em] text-mist opacity-70 capitalize">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Measurements review with percentile column */}
                <div className="mb-8">
                  <div className="flex justify-between items-baseline text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-3">
                    Measurements
                    <button className="text-mist opacity-30 hover:opacity-80 border-b border-[rgba(240,237,232,0.12)]" onClick={() => setStep(2)}>Edit</button>
                  </div>
                  {intelligenceResult ? (
                    intelligenceResult.measurements.map(m => {
                      const displayVal = m.key === 'height'
                        ? (heightUnit === 'imperial' ? `${measurements.heightFt}′ ${measurements.heightIn}″` : `${measurements.heightCm} cm`)
                        : `${m.valueIn}″`;
                      return (
                        <div key={m.key} className="flex justify-between items-baseline py-[7px] border-b border-[rgba(240,237,232,0.04)]">
                          <span className="text-[7.5px] tracking-[0.2em] uppercase text-mist opacity-[0.28] flex-1">{m.label}</span>
                          <span className="text-[9.5px] tracking-[0.12em] text-mist opacity-70 mr-4">{displayVal}</span>
                          <span className="text-[7px] tracking-[0.15em] uppercase min-w-[60px] text-right" style={{ color: SEVERITY_COLORS[m.severity] }}>P{m.percentile}</span>
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback: no intelligence, show raw values */
                    [
                      ['Height', heightUnit === 'imperial' ? `${measurements.heightFt}′ ${measurements.heightIn}″` : `${measurements.heightCm} cm`],
                      ['Nape to waist', measurements.napeWaist + '″'],
                      ['Waist to floor', measurements.waistFloor + '″'],
                      ['Shoulder', measurements.shoulder + '″'],
                      ['Bust', measurements.bust + '″'],
                      ['Waist', measurements.waist + '″'],
                      ['Hip', measurements.hip + '″'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between items-baseline py-[7px] border-b border-[rgba(240,237,232,0.04)]">
                        <span className="text-[7.5px] tracking-[0.2em] uppercase text-mist opacity-[0.28]">{label}</span>
                        <span className="text-[9.5px] tracking-[0.12em] text-mist opacity-70">{val}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Pattern Intelligence panel */}
                {intelligenceResult && (
                  <div className="p-5 border border-[rgba(240,237,232,0.08)] bg-[rgba(240,237,232,0.015)]">
                    <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-4">Pattern Intelligence</div>

                    {/* Proportions */}
                    {intelligenceResult.proportions.length > 0 && (
                      <div className="mb-5">
                        <div className="text-[7px] tracking-[0.4em] uppercase text-mist opacity-[0.15] mb-2">Proportions</div>
                        {intelligenceResult.proportions.map(p => (
                          <div key={p.name} className="flex justify-between items-baseline py-[5px] border-b border-[rgba(240,237,232,0.03)]">
                            <span className="text-[8px] tracking-[0.1em] text-mist opacity-[0.35]">{p.name}</span>
                            <span className="text-[8px] tracking-[0.08em] text-mist opacity-50 italic font-serif">{p.interp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Grade increment */}
                    <div className="flex justify-between items-baseline py-[6px] border-b border-[rgba(240,237,232,0.05)] mb-3">
                      <span className="text-[7px] tracking-[0.4em] uppercase text-mist opacity-[0.15]">Grade Increment</span>
                      <span className="text-[10px] tracking-[0.12em] text-mist opacity-70">{intelligenceResult.grade.value}</span>
                    </div>

                    {/* Cross-size detection */}
                    {intelligenceResult.sizeMismatch && (
                      <div className="py-[6px] border-b border-[rgba(240,237,232,0.05)] mb-3">
                        <span className="text-[7px] tracking-[0.4em] uppercase block mb-1" style={{ color: 'rgba(210,170,110,0.8)', opacity: 0.85 }}>Cross-size detected</span>
                        <span className="text-[8px] tracking-[0.06em] leading-[1.8] text-mist opacity-[0.35]">{intelligenceResult.sizeMismatchDetail}</span>
                      </div>
                    )}

                    {/* Construction notes from overrides */}
                    {intelligenceResult.overrides.length > 0 && (
                      <div>
                        <div className="text-[7px] tracking-[0.4em] uppercase text-mist opacity-[0.15] mb-2">Construction Notes</div>
                        {intelligenceResult.overrides.map(o => (
                          <div key={o.rule} className="py-[5px] border-b border-[rgba(240,237,232,0.03)]">
                            <span className="text-[8px] tracking-[0.06em] leading-[1.8] text-mist opacity-[0.35]">{o.rec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: price + consent */}
              <div className="flex-[0_0_48%] px-[52px] py-[52px] flex flex-col overflow-y-auto">
                <div className="mb-9">
                  <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-[0.18] mb-5">Pricing</div>
                  {[
                    [product.name, `$${product.priceNum.toLocaleString()}`],
                    ['Flux — made to measure', `+$${FLUX_PREMIUM}`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-baseline py-2 border-b border-[rgba(240,237,232,0.05)]">
                      <span className="text-[8.5px] tracking-[0.2em] uppercase text-mist opacity-[0.28]">{label}</span>
                      <span className="text-[9.5px] tracking-[0.12em] text-mist opacity-50">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-baseline py-2 border-t border-[rgba(240,237,232,0.1)] mt-1">
                    <span className="text-[8.5px] tracking-[0.2em] uppercase text-mist opacity-50">Total</span>
                    <span className="text-[12px] tracking-[0.12em] text-mist opacity-90">${(product.priceNum + FLUX_PREMIUM).toLocaleString()}</span>
                  </div>
                </div>

                <div className="py-4 border-b border-[rgba(240,237,232,0.05)] mb-8">
                  <div className="text-[7px] tracking-[0.55em] uppercase text-mist opacity-[0.18] mb-2">Estimated delivery</div>
                  <div className="text-[9.5px] tracking-[0.1em] text-mist opacity-55">4–6 weeks from order confirmation</div>
                </div>

                <div className="p-5 border border-[rgba(240,237,232,0.06)] bg-[rgba(240,237,232,0.02)] mb-6">
                  <p className="text-[9.5px] leading-[1.85] tracking-[0.05em] text-mist opacity-30 mb-4">Flux — made to measure pieces are produced to your specifications and are final sale. If your garment deviates by more than 1 inch from any measurement provided, we will remake it at no charge.</p>
                  <label className="flex gap-3 items-start cursor-pointer" onClick={() => setConsent(c => !c)}>
                    <div className={`w-[14px] h-[14px] border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${consent ? 'border-[rgba(240,237,232,0.7)]' : 'border-[rgba(240,237,232,0.25)]'}`}>
                      {consent && <div className="w-1.5 h-1.5 bg-mist opacity-80" />}
                    </div>
                    <span className="text-[8.5px] tracking-[0.08em] leading-[1.75] text-mist opacity-30">I understand this order is made to my specifications and is final sale.</span>
                  </label>
                </div>

                <button
                  className={`w-full py-[18px] border text-[8.5px] tracking-[0.5em] uppercase font-sans transition-all duration-300 ${consent ? 'border-[rgba(240,237,232,0.18)] text-mist bg-transparent hover:bg-mist hover:text-horizon cursor-pointer opacity-100' : 'border-[rgba(240,237,232,0.07)] text-mist opacity-25 cursor-not-allowed'}`}
                  onClick={handlePlace}
                  disabled={!consent}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-[18px] border-t border-[rgba(240,237,232,0.05)] flex-shrink-0">
          <button
            className={`text-[8.5px] tracking-[0.4em] uppercase text-mist transition-opacity duration-300 ${step > 1 ? 'opacity-30 hover:opacity-80 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setStep(s => Math.max(1, s - 1))}
          >
            ← Back
          </button>
          <span className="text-[7.5px] tracking-[0.4em] uppercase text-mist opacity-[0.15]">Step {step} of 3</span>
          {step < 3 ? (
            <button
              className={`px-9 py-[14px] border text-[8.5px] tracking-[0.5em] uppercase text-mist bg-transparent transition-all duration-300 hover:bg-mist hover:text-horizon ${!allPicked && step === 1 ? 'opacity-20 cursor-not-allowed' : 'border-[rgba(240,237,232,0.18)]'}`}
              onClick={handleNext}
              disabled={step === 1 && !allPicked}
            >
              {step === 2 ? 'Review Order' : 'Continue'}
            </button>
          ) : <div />}
        </div>
      </div>
    </>
  );
}

function OptionGroup({ label, options, selected, onSelect }: {
  label: string;
  options: Array<{ key: string; name: string; desc: string }>;
  selected?: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="mb-7">
      <div className="text-[7px] tracking-[0.6em] uppercase text-mist opacity-20 mb-3">{label}</div>
      <div className="flex flex-col gap-1.5">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`flex items-baseline gap-3.5 px-3.5 py-2.5 border text-left transition-all duration-250 ${selected === opt.key ? 'border-[rgba(240,237,232,0.4)]' : 'border-[rgba(240,237,232,0.07)] hover:border-[rgba(240,237,232,0.22)] hover:bg-[rgba(240,237,232,0.025)]'}`}
            onClick={() => onSelect(opt.key)}
          >
            <span className={`text-[9px] tracking-[0.35em] uppercase text-mist transition-opacity ${selected === opt.key ? 'opacity-100' : 'opacity-70'}`}>{opt.name}</span>
            <span className={`text-[9.5px] tracking-[0.05em] italic font-serif text-mist transition-opacity ${selected === opt.key ? 'opacity-45' : 'opacity-25'}`}>{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
