import React from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

export interface CarImageProps {
  plan?: string;
  price?: number;
  className?: string;
}

function getCarIndex(price?: number): number {
  if (!price) return 0;
  if (price <= 5000) return 0;
  if (price <= 10000) return 1;
  if (price <= 20000) return 2;
  if (price <= 50000) return 3;
  if (price <= 100000) return 4;
  if (price <= 200000) return 5;
  if (price <= 500000) return 6;
  return 7;
}

export function getCarLabel(price?: number): string {
  const labels = ['Hatchback', 'Sedan', 'Premium Sedan', 'Luxury Sedan', 'Sports Car', 'Luxury Sports', 'Supercar', 'Hypercar'];
  return labels[getCarIndex(price)];
}

const carSvgs: Record<number, (color: string) => React.ReactNode> = {
  0: (c) => (
    <svg viewBox="0 0 200 100" className="w-full h-full" fill="none">
      <path d="M20 65 L20 60 Q20 55 25 55 L35 55 Q38 55 40 52 L48 38 Q50 35 53 35 L70 35 L75 28 Q77 25 80 25 L95 25 L105 30 L140 30 Q145 30 148 33 L155 42 Q158 45 160 48 Q162 52 165 53 L170 55 Q178 55 180 60 L180 65 Q180 68 178 70 L175 70 Q172 70 170 68 L168 65 Q165 60 160 60 L40 60 Q35 60 32 65 L30 68 Q28 70 25 70 L22 70 Q20 70 20 65Z" fill={c} />
      <circle cx="48" cy="68" r="10" fill={c} />
      <circle cx="48" cy="68" r="4" fill="white" />
      <circle cx="152" cy="68" r="10" fill={c} />
      <circle cx="152" cy="68" r="4" fill="white" />
      <rect x="55" y="38" width="20" height="12" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="110" y="38" width="20" height="12" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  1: (c) => (
    <svg viewBox="0 0 220 100" className="w-full h-full" fill="none">
      <path d="M15 62 L15 57 Q15 52 20 52 L32 52 Q36 52 38 49 L48 33 Q50 30 54 30 L75 30 L85 22 Q87 20 90 20 L110 20 L125 25 L160 25 Q165 25 168 28 L175 38 Q178 42 180 46 Q183 50 186 52 L192 55 Q200 55 202 60 L202 65 Q202 68 200 70 L196 70 Q192 70 190 67 L186 62 Q183 58 178 58 L38 58 Q33 58 30 62 L28 67 Q26 70 22 70 L18 70 Q15 70 15 62Z" fill={c} />
      <circle cx="50" cy="65" r="11" fill={c} />
      <circle cx="50" cy="65" r="4.5" fill="white" />
      <circle cx="168" cy="65" r="11" fill={c} />
      <circle cx="168" cy="65" r="4.5" fill="white" />
      <rect x="58" y="35" width="25" height="13" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="125" y="35" width="22" height="13" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  2: (c) => (
    <svg viewBox="0 0 240 100" className="w-full h-full" fill="none">
      <path d="M18 60 L18 55 Q18 50 23 50 L36 50 Q40 50 42 47 L52 30 Q54 27 58 27 L82 27 L92 18 Q94 15 98 15 L122 15 L140 22 L178 22 Q183 22 186 25 L194 36 Q197 40 200 45 Q203 50 207 52 L214 55 Q222 55 224 60 L224 65 Q224 68 222 70 L218 70 Q214 70 212 67 L208 60 Q204 55 198 55 L40 55 Q35 55 32 60 L28 67 Q26 70 22 70 L20 70 Q18 70 18 60Z" fill={c} />
      <circle cx="55" cy="65" r="12" fill={c} />
      <circle cx="55" cy="65" r="5" fill="white" />
      <circle cx="185" cy="65" r="12" fill={c} />
      <circle cx="185" cy="65" r="5" fill="white" />
      <rect x="62" y="32" width="30" height="14" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="140" y="32" width="28" height="14" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  3: (c) => (
    <svg viewBox="0 0 260 100" className="w-full h-full" fill="none">
      <path d="M20 58 L20 53 Q20 48 25 48 L40 48 Q44 48 46 45 L56 28 Q58 25 62 25 L88 25 L98 15 Q100 12 105 12 L135 12 L155 20 L195 20 Q200 20 203 23 L212 35 Q215 39 218 44 Q221 49 225 52 L232 55 Q240 55 242 60 L242 65 Q242 68 240 70 L236 70 Q232 70 230 67 L226 60 Q222 55 216 55 L42 55 Q37 55 34 60 L30 67 Q28 70 24 70 L22 70 Q20 70 20 58Z" fill={c} />
      <circle cx="58" cy="63" r="13" fill={c} />
      <circle cx="58" cy="63" r="5" fill="white" />
      <circle cx="200" cy="63" r="13" fill={c} />
      <circle cx="200" cy="63" r="5" fill="white" />
      <rect x="66" y="30" width="32" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="155" y="30" width="30" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  4: (c) => (
    <svg viewBox="0 0 280 100" className="w-full h-full" fill="none">
      <path d="M15 55 L15 50 Q15 45 20 45 L38 45 Q42 45 44 42 L55 25 Q57 22 62 22 L92 22 L102 12 Q104 10 108 10 L145 10 L168 18 L215 18 Q220 18 223 21 L232 33 Q235 37 238 42 Q241 47 245 50 L255 53 Q262 53 265 58 L265 63 Q265 68 262 70 L258 70 Q254 70 252 67 L245 58 Q240 53 234 53 L42 53 Q37 53 34 58 L30 67 Q28 70 24 70 L18 70 Q15 70 15 55Z" fill={c} />
      <circle cx="60" cy="60" r="14" fill={c} />
      <circle cx="60" cy="60" r="5.5" fill="white" />
      <circle cx="222" cy="60" r="14" fill={c} />
      <circle cx="222" cy="60" r="5.5" fill="white" />
      <rect x="68" y="28" width="35" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="172" y="28" width="32" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  5: (c) => (
    <svg viewBox="0 0 300 100" className="w-full h-full" fill="none">
      <path d="M10 52 L10 47 Q10 42 15 42 L35 42 Q40 42 42 39 L54 22 Q56 19 60 19 L95 19 L108 8 Q110 5 115 5 L158 5 L182 14 L238 14 Q243 14 246 17 L255 30 Q258 35 262 40 Q266 45 270 48 L282 52 Q290 52 292 58 L292 63 Q292 68 288 70 L284 70 Q280 70 278 67 L270 56 Q265 50 258 50 L40 50 Q35 50 32 56 L28 67 Q26 70 22 70 L14 70 Q10 70 10 52Z" fill={c} />
      <circle cx="62" cy="58" r="15" fill={c} />
      <circle cx="62" cy="58" r="6" fill="white" />
      <circle cx="248" cy="58" r="15" fill={c} />
      <circle cx="248" cy="58" r="6" fill="white" />
      <rect x="72" y="25" width="38" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="190" y="25" width="36" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  6: (c) => (
    <svg viewBox="0 0 320 100" className="w-full h-full" fill="none">
      <path d="M8 48 L8 43 Q8 38 13 38 L35 38 Q40 38 42 35 L55 18 Q57 15 62 15 L102 15 L115 5 Q117 3 122 3 L172 3 L198 12 L258 12 Q263 12 266 15 L276 28 Q279 33 284 38 Q288 43 292 46 L306 50 Q314 50 316 56 L316 62 Q316 68 312 70 L308 70 Q304 70 302 67 L292 54 Q286 48 278 48 L38 48 Q32 48 28 54 L24 67 Q22 70 18 70 L12 70 Q8 70 8 48Z" fill={c} />
      <circle cx="62" cy="55" r="16" fill={c} />
      <circle cx="62" cy="55" r="6" fill="white" />
      <circle cx="268" cy="55" r="16" fill={c} />
      <circle cx="268" cy="55" r="6" fill="white" />
      <rect x="75" y="22" width="40" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="210" y="22" width="38" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  7: (c) => (
    <svg viewBox="0 0 340 100" className="w-full h-full" fill="none">
      <path d="M5 45 L5 40 Q5 35 10 35 L35 35 Q40 35 42 32 L56 15 Q58 12 63 12 L108 12 L122 2 Q124 0 130 0 L186 0 L214 10 L278 10 Q283 10 286 13 L296 26 Q300 31 305 36 Q310 41 315 44 L330 48 Q338 48 340 54 L340 60 Q340 66 336 70 L332 70 Q328 70 326 67 L315 52 Q308 45 300 45 L35 45 Q28 45 24 52 L20 67 Q18 70 14 70 L8 70 Q5 70 5 45Z" fill={c} />
      <circle cx="62" cy="52" r="17" fill={c} />
      <circle cx="62" cy="52" r="6.5" fill="white" />
      <circle cx="290" cy="52" r="17" fill={c} />
      <circle cx="290" cy="52" r="6.5" fill="white" />
      <rect x="78" y="18" width="42" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="230" y="18" width="40" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
};

const carGradients = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
];

export function getCarGradient(price?: number): string {
  return carGradients[getCarIndex(price)];
}

export default function CarImage({ price, className = '' }: CarImageProps) {
  const idx = getCarIndex(price);
  const gradient = carGradients[idx];
  const svgColor = '#ffffff';
  const renderSvg = carSvgs[idx];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`w-full aspect-[3/1] bg-gradient-to-r ${gradient} p-3 flex items-center justify-center`}>
        <div className="w-full h-full max-w-[280px] mx-auto opacity-90">
          {renderSvg(svgColor)}
        </div>
      </div>
    </div>
  );
}
