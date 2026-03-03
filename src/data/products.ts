export interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  flux: boolean;
  swatch: string;
  sizes: string[];
  description: string;
  thumbSwatches: string[];
}

export interface Collection {
  id: number;
  name: string;
  sub: string;
  swatch: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Movement Dress',
    price: '$795',
    priceNum: 795,
    flux: true,
    swatch: 'swatch-1',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Our signature silhouette. A fluid cut that moves with the body — no fastening, no structure. It settles into place. Cut from a single length of fabric. Available through Flux for made-to-measure specifications.',
    thumbSwatches: ['swatch-1', 'swatch-2', 'swatch-3', 'swatch-4'],
  },
  {
    id: 2,
    name: 'Core Dress',
    price: '$995',
    priceNum: 995,
    flux: false,
    swatch: 'swatch-2',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Structured at the shoulder, fluid below. An open back with a single self-tie closure. The Core Dress is an exercise in restraint — every detail considered, nothing extraneous.',
    thumbSwatches: ['swatch-2', 'swatch-3', 'swatch-1', 'swatch-4'],
  },
  {
    id: 3,
    name: 'Structured Top',
    price: '$595',
    priceNum: 595,
    flux: false,
    swatch: 'swatch-3',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'A precise cut in a relaxed weight. Worn tucked into the Midi or Maxi Skirt, or alone. The fabric has enough weight to hold shape without stiffness.',
    thumbSwatches: ['swatch-3', 'swatch-4', 'swatch-5', 'swatch-6'],
  },
  {
    id: 4,
    name: 'Midi Skirt',
    price: '$595',
    priceNum: 595,
    flux: false,
    swatch: 'swatch-4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'A straight-cut midi with an internal drawstring waistband. The fabric has a subtle lustre — it catches light without announcing itself. Falls just below the knee.',
    thumbSwatches: ['swatch-4', 'swatch-5', 'swatch-6', 'swatch-1'],
  },
  {
    id: 5,
    name: 'Maxi Skirt',
    price: '$795',
    priceNum: 795,
    flux: false,
    swatch: 'swatch-5',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Floor-grazing. The waistband sits at the natural waist; the hem sweeps at the back. Made for movement — the drape responds as you walk.',
    thumbSwatches: ['swatch-5', 'swatch-6', 'swatch-1', 'swatch-2'],
  },
  {
    id: 6,
    name: 'Top #2',
    price: '$495',
    priceNum: 495,
    flux: false,
    swatch: 'swatch-6',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'A fluid, lightweight top cut for ease. Sits at the hip; falls without structure. Worn alone or layered. The simplest thing we make.',
    thumbSwatches: ['swatch-6', 'swatch-1', 'swatch-2', 'swatch-3'],
  },
];

export const COLLECTIONS: Collection[] = [
  { id: 1, name: 'Spring 2026', sub: 'Current Season', swatch: 'c-swatch-1' },
  { id: 2, name: 'Autumn 2025', sub: '18 Pieces', swatch: 'c-swatch-2' },
  { id: 3, name: 'Resort 2025', sub: '12 Pieces', swatch: 'c-swatch-3' },
  { id: 4, name: 'Spring 2025', sub: '14 Pieces', swatch: 'c-swatch-4' },
];

export const FLUX_PREMIUM = 175;
