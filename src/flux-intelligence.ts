/**
 * Flux Body Data Intelligence Engine
 * ANSUR II Female Baseline (N = 1,986 subjects)
 * All baseline values stored in centimeters.
 * Customer input assumed in inches; converted internally.
 *
 * v2_(031026)
 */

// ─── Constants ──────────────────────────────────────────
export const IN_TO_CM = 2.54;
export const CM_TO_IN = 1 / IN_TO_CM;

// ─── Types ──────────────────────────────────────────────
export type Severity = 'typical' | 'notable' | 'significant' | 'extreme';

export interface BaselineStat {
  mean: number;
  std: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export interface GradeOverride {
  rule: string;
  desc: string;
  rec: string;
}

export interface ProportionResult {
  name: string;
  value: number;
  popMean: number;
  interp: string;
}

export interface GradeIncrement {
  value: string;
  reason: string;
}

export interface MeasurementAnalysis {
  key: string;
  label: string;
  valueIn: number;
  valueCm: number;
  zScore: number;
  percentile: number;
  severity: Severity;
  sizeMapping?: string;
}

export interface FluxIntelligenceResult {
  measurements: MeasurementAnalysis[];
  proportions: ProportionResult[];
  overrides: GradeOverride[];
  grade: GradeIncrement;
  sizeMismatch: boolean;
  sizeMismatchDetail: string;
  maxZ: number;
  summary: string;
}

export interface FieldInsight {
  percentile: number;
  severity: Severity;
  zScore: number;
  label: string;
}

// ─── ANSUR II Female Baseline ───────────────────────────
// Source: ANSUR II (2012), US Army female soldiers
// All values in centimeters
export const ANSUR_BASELINE: Record<string, BaselineStat> = {
  height:     { mean: 162.85, std: 6.42, p5: 152.5,  p25: 158.62, p50: 162.6,  p75: 167.2,  p95: 174.0  },
  bust:       { mean: 94.69,  std: 8.27, p5: 82.43,  p25: 88.9,   p50: 94.0,   p75: 99.9,   p95: 109.4  },
  waist:      { mean: 86.09,  std: 9.99, p5: 71.0,   p25: 79.0,   p50: 85.2,   p75: 92.5,   p95: 104.0  },
  hip:        { mean: 102.12, std: 7.59, p5: 90.12,  p25: 96.9,   p50: 101.85, p75: 106.9,  p95: 115.57 },
  shoulder:   { mean: 36.53,  std: 1.83, p5: 33.5,   p25: 35.3,   p50: 36.5,   p75: 37.8,   p95: 39.6   },
  napeWaist:  { mean: 42.54,  std: 2.64, p5: 38.4,   p25: 40.7,   p50: 42.45,  p75: 44.2,   p95: 47.0   },
  // Derived: cervicale_height (139.57) − nape_to_waist (42.54) = 97.03
  // Combined std via quadrature: √(5.95² + 2.64²) ≈ 6.51
  waistFloor: { mean: 97.03,  std: 6.51, p5: 86.3,   p25: 92.5,   p50: 96.85,  p75: 101.2,  p95: 107.8  },
};

// ─── Size chart (cm) ────────────────────────────────────
interface SizeRange {
  label: string;
  bust: [number, number];
  waist: [number, number];
  hip: [number, number];
}

const SIZE_CHART: SizeRange[] = [
  { label: 'XS',  bust: [76, 82],   waist: [58, 64],   hip: [84, 90]   },
  { label: 'S',   bust: [82, 88],   waist: [64, 70],   hip: [90, 96]   },
  { label: 'M',   bust: [88, 96],   waist: [70, 78],   hip: [96, 104]  },
  { label: 'L',   bust: [96, 104],  waist: [78, 86],   hip: [104, 112] },
  { label: 'XL',  bust: [104, 112], waist: [86, 96],   hip: [112, 120] },
  { label: 'XXL', bust: [112, 122], waist: [96, 108],   hip: [120, 130] },
];

// ─── Severity color maps ────────────────────────────────
export const SEVERITY_COLORS: Record<Severity, string> = {
  typical:     'rgba(240,237,232,0.25)',
  notable:     'rgba(178,160,138,0.65)',
  significant: 'rgba(210,170,110,0.8)',
  extreme:     'rgba(210,130,110,0.9)',
};

export const SEVERITY_BG: Record<Severity, string> = {
  typical:     'transparent',
  notable:     'rgba(178,160,138,0.04)',
  significant: 'rgba(210,170,110,0.06)',
  extreme:     'rgba(210,130,110,0.08)',
};

// ─── Math utilities ─────────────────────────────────────

function zScore(value: number, mean: number, std: number): number {
  return (value - mean) / std;
}

/** Abramowitz & Stegun approximation for normal CDF */
function zToPercentile(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * x);
  const erf = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return Math.round(((1 + sign * erf) / 2) * 100);
}

function classifySeverity(absZ: number): Severity {
  if (absZ < 1.0) return 'typical';
  if (absZ < 1.5) return 'notable';
  if (absZ < 2.0) return 'significant';
  return 'extreme';
}

function ordinalSuffix(n: number): string {
  if (n % 10 === 1 && n !== 11) return 'st';
  if (n % 10 === 2 && n !== 12) return 'nd';
  if (n % 10 === 3 && n !== 13) return 'rd';
  return 'th';
}

// ─── Size mapping ───────────────────────────────────────

function mapToSize(valueCm: number, field: 'bust' | 'waist' | 'hip'): string {
  for (const s of SIZE_CHART) {
    const range = s[field];
    if (valueCm >= range[0] && valueCm < range[1]) return s.label;
  }
  return valueCm < SIZE_CHART[0][field][0] ? 'below XS' : 'above XXL';
}

// ─── Single field analysis (real-time) ──────────────────

export function analyzeField(key: string, valueInches: number): FieldInsight | null {
  const baseline = ANSUR_BASELINE[key];
  if (!baseline) return null;

  const valueCm = valueInches * IN_TO_CM;
  const z = zScore(valueCm, baseline.mean, baseline.std);
  const pct = zToPercentile(z);
  const sev = classifySeverity(Math.abs(z));
  return {
    percentile: pct,
    severity: sev,
    zScore: Math.round(z * 100) / 100,
    label: `${pct}${ordinalSuffix(pct)} percentile`,
  };
}

// ─── Full body analysis ─────────────────────────────────

export interface FluxMeasurementsInput {
  height: number;   // inches (total)
  bust: number;     // inches
  waist: number;    // inches
  hip: number;      // inches
  shoulder: number; // inches
  napeWaist: number; // inches
  waistFloor: number; // inches
}

const MEASUREMENT_LABELS: Record<string, string> = {
  height: 'Height',
  bust: 'Bust',
  waist: 'Waist',
  hip: 'Hip',
  shoulder: 'Shoulder',
  napeWaist: 'Nape to waist',
  waistFloor: 'Waist to floor',
};

export function analyzeBody(input: FluxMeasurementsInput): FluxIntelligenceResult {
  // Convert all to cm
  const cm: Record<string, number> = {};
  for (const [k, v] of Object.entries(input)) {
    cm[k] = v * IN_TO_CM;
  }

  // Per-measurement analysis
  const measurements: MeasurementAnalysis[] = [];
  let maxZ = 0;

  for (const key of Object.keys(ANSUR_BASELINE)) {
    if (cm[key] === undefined) continue;
    const baseline = ANSUR_BASELINE[key];
    const z = zScore(cm[key], baseline.mean, baseline.std);
    const pct = zToPercentile(z);
    const sev = classifySeverity(Math.abs(z));
    maxZ = Math.max(maxZ, Math.abs(z));

    let sizeMapping: string | undefined;
    if (key === 'bust') sizeMapping = mapToSize(cm[key], 'bust');
    if (key === 'waist') sizeMapping = mapToSize(cm[key], 'waist');
    if (key === 'hip') sizeMapping = mapToSize(cm[key], 'hip');

    measurements.push({
      key,
      label: MEASUREMENT_LABELS[key] || key,
      valueIn: input[key as keyof FluxMeasurementsInput],
      valueCm: Math.round(cm[key] * 10) / 10,
      zScore: Math.round(z * 100) / 100,
      percentile: pct,
      severity: sev,
      sizeMapping,
    });
  }

  // Cross-size mismatch detection
  const bustSize = measurements.find(m => m.key === 'bust')?.sizeMapping;
  const waistSize = measurements.find(m => m.key === 'waist')?.sizeMapping;
  const hipSize = measurements.find(m => m.key === 'hip')?.sizeMapping;
  const sizes = [bustSize, waistSize, hipSize].filter(Boolean);
  const sizeMismatch = new Set(sizes).size > 1;
  const sizeMismatchDetail = sizeMismatch
    ? `Bust → ${bustSize}, Waist → ${waistSize}, Hip → ${hipSize} — cross-size grading required`
    : '';

  // Proportion analysis
  const proportions: ProportionResult[] = [];

  if (cm.waist && cm.hip) {
    const ratio = cm.waist / cm.hip;
    const popRatio = ANSUR_BASELINE.waist.mean / ANSUR_BASELINE.hip.mean;
    proportions.push({
      name: 'Waist-to-hip',
      value: Math.round(ratio * 1000) / 1000,
      popMean: Math.round(popRatio * 1000) / 1000,
      interp: ratio < popRatio - 0.04 ? 'More defined waist' : ratio > popRatio + 0.04 ? 'Straighter torso' : 'Near average',
    });
  }

  if (cm.bust && cm.hip) {
    const ratio = cm.bust / cm.hip;
    const popRatio = ANSUR_BASELINE.bust.mean / ANSUR_BASELINE.hip.mean;
    proportions.push({
      name: 'Bust-to-hip',
      value: Math.round(ratio * 1000) / 1000,
      popMean: Math.round(popRatio * 1000) / 1000,
      interp: ratio < popRatio - 0.03 ? 'Hip-dominant' : ratio > popRatio + 0.03 ? 'Bust-dominant' : 'Balanced',
    });
  }

  if (cm.shoulder && cm.hip) {
    const ratio = cm.shoulder / cm.hip;
    const popRatio = ANSUR_BASELINE.shoulder.mean / ANSUR_BASELINE.hip.mean;
    proportions.push({
      name: 'Shoulder-to-hip',
      value: Math.round(ratio * 1000) / 1000,
      popMean: Math.round(popRatio * 1000) / 1000,
      interp: ratio < popRatio - 0.02 ? 'Narrower shoulders' : ratio > popRatio + 0.02 ? 'Broader shoulders' : 'Proportional',
    });
  }

  if (cm.height && cm.napeWaist) {
    const ratio = cm.napeWaist / cm.height;
    const popRatio = ANSUR_BASELINE.napeWaist.mean / ANSUR_BASELINE.height.mean;
    proportions.push({
      name: 'Height-to-torso',
      value: Math.round(ratio * 1000) / 1000,
      popMean: Math.round(popRatio * 1000) / 1000,
      interp: ratio < popRatio - 0.015 ? 'Shorter torso' : ratio > popRatio + 0.015 ? 'Longer torso' : 'Proportional',
    });
  }

  // Handford grade overrides (4 rules)
  const overrides: GradeOverride[] = [];

  // Rule 1: Bust above P75
  if (cm.bust > ANSUR_BASELINE.bust.p75) {
    overrides.push({
      rule: 'BUST_P75',
      desc: 'Bust above 75th percentile',
      rec: 'Use 1.5″ grade increment for bust pattern pieces',
    });
  }

  // Rule 2: Waist-to-bust ratio deviation
  if (cm.bust && cm.waist) {
    const ratio = cm.waist / cm.bust;
    const expected = ANSUR_BASELINE.waist.mean / ANSUR_BASELINE.bust.mean;
    if (Math.abs(ratio - expected) > 0.08) {
      overrides.push({
        rule: 'WAIST_BUST_RATIO',
        desc: 'Waist-to-bust deviation',
        rec: 'Independent grading for bodice — do not nest waist from bust',
      });
    }
  }

  // Rule 3: Shoulder outside central 50%
  if (cm.shoulder && (cm.shoulder < ANSUR_BASELINE.shoulder.p25 || cm.shoulder > ANSUR_BASELINE.shoulder.p75)) {
    overrides.push({
      rule: 'SHOULDER_RANGE',
      desc: 'Shoulder outside central 50%',
      rec: 'Adjust shoulder point and armscye independently',
    });
  }

  // Rule 4: Torso disproportionate to height
  if (cm.height && cm.napeWaist) {
    const torsoRatio = cm.napeWaist / cm.height;
    const expectedTorsoRatio = ANSUR_BASELINE.napeWaist.mean / ANSUR_BASELINE.height.mean;
    if (Math.abs(torsoRatio - expectedTorsoRatio) > 0.015) {
      overrides.push({
        rule: 'HEIGHT_TORSO',
        desc: 'Torso disproportionate to height',
        rec: 'Separate length grading from cross grading',
      });
    }
  }

  // Grade increment recommendation
  const gradeValue = overrides.length > 0 && maxZ >= 1.0 ? '2″' : overrides.length > 0 || maxZ >= 1.5 ? '1.5″' : '1″';
  const gradeReason = overrides.length > 0 && maxZ >= 1.0
    ? 'Overrides triggered with significant deviation'
    : overrides.length > 0 || maxZ >= 1.5
      ? 'Override rules or elevated deviation detected'
      : 'Standard grading — measurements within typical range';

  const grade: GradeIncrement = { value: gradeValue, reason: gradeReason };

  // Summary
  const notable = measurements.filter(m => m.severity !== 'typical').length;
  const summary = notable === 0
    ? 'All measurements within typical range. Standard grading applies.'
    : `${notable} measurement${notable > 1 ? 's' : ''} outside typical range. ${overrides.length ? overrides.length + ' override' + (overrides.length > 1 ? 's' : '') + ' triggered. ' : ''}Grade: ${gradeValue}.`;

  return {
    measurements,
    proportions,
    overrides,
    grade,
    sizeMismatch,
    sizeMismatchDetail,
    maxZ: Math.round(maxZ * 100) / 100,
    summary,
  };
}

// ─── Parse raw form measurements to typed input ─────────

export function parseFluxMeasurements(
  raw: Record<string, string>,
  heightUnit: 'imperial' | 'metric',
): FluxMeasurementsInput | null {
  let heightIn = 0;
  if (heightUnit === 'imperial') {
    const ft = parseFloat(raw.heightFt);
    const inches = parseFloat(raw.heightIn) || 0;
    if (!ft || ft < 3 || ft > 8) return null;
    heightIn = ft * 12 + inches;
  } else {
    const cm = parseFloat(raw.heightCm);
    if (!cm || cm < 100 || cm > 250) return null;
    heightIn = cm / IN_TO_CM;
  }

  const fields: Array<keyof Omit<FluxMeasurementsInput, 'height'>> = [
    'bust', 'waist', 'hip', 'shoulder', 'napeWaist', 'waistFloor',
  ];
  const result: Partial<FluxMeasurementsInput> = { height: heightIn };
  for (const f of fields) {
    const v = parseFloat(raw[f]);
    if (!v || v <= 0) return null;
    result[f] = v;
  }

  return result as FluxMeasurementsInput;
}
