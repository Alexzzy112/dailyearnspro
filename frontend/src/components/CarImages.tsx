import Image from 'next/image';

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

export function getCarGradient(price?: number): string {
  const g = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
  ];
  return g[getCarIndex(price)];
}

const carSvgs: { id: string; svg: string }[] = [
  { id: 'hatchback', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180">
    <defs><linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs>
    <ellipse cx="105" cy="148" rx="28" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="310" cy="148" rx="28" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M25 130 L25 115 Q25 105 35 105 L65 105 Q72 105 78 98 L95 70 Q100 62 110 62 L160 62 L175 55 Q180 50 188 50 L220 50 L245 58 L295 58 Q305 58 310 62 L325 78 Q330 84 335 90 Q340 96 345 100 L355 105 Q370 105 375 110 L375 130 Q375 138 370 140 L360 140 Q350 140 345 135 L335 125 Q328 118 318 118 L82 118 Q72 118 65 125 L55 135 Q50 140 42 140 L30 140 Q25 140 25 130Z" fill="url(#b1)"/>
    <path d="M82 118 Q72 118 65 125 L55 135 Q50 140 42 140 L30 140 Q25 140 25 130 L25 115 Q25 105 35 105 L65 105 Q72 105 78 98 L95 70 Q100 62 110 62 L160 62 L175 55 Q180 50 188 50 L220 50 L245 58 L295 58 Q305 58 310 62 L325 78 Q330 84 335 90 Q340 96 345 100 L355 105 Q370 105 375 110 L375 130 Q375 138 370 140 L360 140 Q350 140 345 135 L335 125 Q328 118 318 118Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <rect x="112" y="72" width="62" height="26" rx="4" fill="rgba(0,0,0,0.25)"/>
    <rect x="116" y="75" width="54" height="12" rx="2" fill="rgba(150,200,255,0.25)"/>
    <rect x="250" y="72" width="52" height="26" rx="4" fill="rgba(0,0,0,0.2)"/>
    <rect x="254" y="75" width="44" height="12" rx="2" fill="rgba(150,200,255,0.2)"/>
    <circle cx="105" cy="140" r="22" fill="#1a1a2e"/>
    <circle cx="105" cy="140" r="16" fill="#333"/>
    <circle cx="105" cy="140" r="8" fill="#888"/>
    <circle cx="105" cy="140" r="4" fill="#ccc"/>
    <circle cx="310" cy="140" r="22" fill="#1a1a2e"/>
    <circle cx="310" cy="140" r="16" fill="#333"/>
    <circle cx="310" cy="140" r="8" fill="#888"/>
    <circle cx="310" cy="140" r="4" fill="#ccc"/>
    <rect x="30" y="118" width="12" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="360" y="118" width="10" height="6" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'sedan', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 180">
    <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs>
    <ellipse cx="120" cy="148" rx="30" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="340" cy="148" rx="30" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M22 130 L22 113 Q22 103 32 103 L70 103 Q78 103 84 96 L105 66 Q110 58 120 58 L175 58 L195 48 Q200 44 210 44 L250 44 L278 54 L330 54 Q340 54 345 58 L362 76 Q368 82 374 88 Q380 94 386 98 L398 103 Q412 103 418 108 L418 130 Q418 140 412 142 L400 142 Q390 142 384 136 L372 124 Q364 116 352 116 L88 116 Q78 116 70 124 L58 136 Q52 142 42 142 L28 142 Q22 142 22 130Z" fill="url(#g2)"/>
    <path d="M88 116 Q78 116 70 124 L58 136 Q52 142 42 142 L28 142 Q22 142 22 130 L22 113 Q22 103 32 103 L70 103 Q78 103 84 96 L105 66 Q110 58 120 58 L175 58 L195 48 Q200 44 210 44 L250 44 L278 54 L330 54 Q340 54 345 58 L362 76 Q368 82 374 88 Q380 94 386 98 L398 103 Q412 103 418 108 L418 130 Q418 140 412 142 L400 142 Q390 142 384 136 L372 124 Q364 116 352 116Z" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <rect x="128" y="68" width="72" height="28" rx="4" fill="rgba(0,0,0,0.25)"/>
    <rect x="132" y="71" width="64" height="12" rx="2" fill="rgba(150,255,200,0.2)"/>
    <rect x="282" y="68" width="64" height="28" rx="4" fill="rgba(0,0,0,0.2)"/>
    <rect x="286" y="71" width="56" height="12" rx="2" fill="rgba(150,255,200,0.18)"/>
    <circle cx="120" cy="140" r="24" fill="#1a1a2e"/>
    <circle cx="120" cy="140" r="18" fill="#333"/>
    <circle cx="120" cy="140" r="9" fill="#888"/>
    <circle cx="120" cy="140" r="4.5" fill="#ccc"/>
    <circle cx="340" cy="140" r="24" fill="#1a1a2e"/>
    <circle cx="340" cy="140" r="18" fill="#333"/>
    <circle cx="340" cy="140" r="9" fill="#888"/>
    <circle cx="340" cy="140" r="4.5" fill="#ccc"/>
    <rect x="28" y="118" width="14" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="398" y="118" width="12" height="6" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'premium', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180">
    <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
    <ellipse cx="135" cy="148" rx="32" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="370" cy="148" rx="32" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M20 128 L20 110 Q20 100 30 100 L75 100 Q83 100 90 93 L112 62 Q117 54 128 54 L188 54 L212 42 Q218 38 228 38 L272 38 L304 50 L358 50 Q370 50 375 54 L394 74 Q400 80 406 86 Q412 92 418 96 L432 100 Q448 100 454 106 L454 128 Q454 138 448 140 L434 140 Q424 140 416 134 L402 120 Q392 112 380 112 L86 112 Q76 112 68 120 L56 134 Q48 140 38 140 L26 140 Q20 140 20 128Z" fill="url(#g3)"/>
    <rect x="136" y="64" width="80" height="30" rx="5" fill="rgba(0,0,0,0.25)"/>
    <rect x="140" y="67" width="72" height="13" rx="2" fill="rgba(200,180,255,0.2)"/>
    <rect x="306" y="64" width="72" height="30" rx="5" fill="rgba(0,0,0,0.2)"/>
    <rect x="310" y="67" width="64" height="13" rx="2" fill="rgba(200,180,255,0.18)"/>
    <circle cx="135" cy="140" r="26" fill="#1a1a2e"/>
    <circle cx="135" cy="140" r="19" fill="#333"/>
    <circle cx="135" cy="140" r="10" fill="#999"/>
    <circle cx="135" cy="140" r="5" fill="#ddd"/>
    <circle cx="370" cy="140" r="26" fill="#1a1a2e"/>
    <circle cx="370" cy="140" r="19" fill="#333"/>
    <circle cx="370" cy="140" r="10" fill="#999"/>
    <circle cx="370" cy="140" r="5" fill="#ddd"/>
    <rect x="26" y="116" width="14" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="434" y="116" width="12" height="6" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'luxury', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180">
    <defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs>
    <ellipse cx="150" cy="148" rx="34" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="400" cy="148" rx="34" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M18 126 L18 108 Q18 98 28 98 L80 98 Q88 98 95 91 L118 58 Q123 50 134 50 L200 50 L226 38 Q232 34 244 34 L294 34 L328 48 L386 48 Q398 48 404 52 L424 74 Q430 80 436 86 Q442 92 448 96 L464 100 Q480 100 486 106 L486 126 Q486 136 480 138 L466 138 Q456 138 448 132 L432 118 Q422 110 410 110 L84 110 Q74 110 66 118 L54 132 Q46 138 36 138 L24 138 Q18 138 18 126Z" fill="url(#g4)"/>
    <rect x="142" y="60" width="88" height="32" rx="5" fill="rgba(0,0,0,0.25)"/>
    <rect x="146" y="63" width="80" height="14" rx="2" fill="rgba(255,220,180,0.2)"/>
    <rect x="336" y="60" width="80" height="32" rx="5" fill="rgba(0,0,0,0.2)"/>
    <rect x="340" y="63" width="72" height="14" rx="2" fill="rgba(255,220,180,0.18)"/>
    <circle cx="150" cy="140" r="28" fill="#1a1a2e"/>
    <circle cx="150" cy="140" r="21" fill="#333"/>
    <circle cx="150" cy="140" r="11" fill="#aaa"/>
    <circle cx="150" cy="140" r="5.5" fill="#eee"/>
    <circle cx="400" cy="140" r="28" fill="#1a1a2e"/>
    <circle cx="400" cy="140" r="21" fill="#333"/>
    <circle cx="400" cy="140" r="11" fill="#aaa"/>
    <circle cx="400" cy="140" r="5.5" fill="#eee"/>
    <rect x="24" y="114" width="16" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="466" y="114" width="14" height="6" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'sports', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180">
    <defs><linearGradient id="g5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#db2777"/></linearGradient></defs>
    <ellipse cx="165" cy="148" rx="36" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="430" cy="148" rx="36" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M15 124 L15 105 Q15 95 25 95 L82 95 Q90 95 97 88 L122 52 Q128 44 140 44 L212 44 L240 32 Q248 28 260 28 L316 28 L354 44 L416 44 Q428 44 434 48 L456 72 Q462 78 468 84 Q474 90 480 94 L498 98 Q516 98 522 104 L522 124 Q522 134 516 136 L500 136 Q490 136 480 130 L462 116 Q452 108 440 108 L80 108 Q70 108 62 116 L48 130 Q40 136 30 136 L20 136 Q15 136 15 124Z" fill="url(#g5)"/>
    <rect x="150" y="54" width="96" height="34" rx="6" fill="rgba(0,0,0,0.25)"/>
    <rect x="154" y="57" width="88" height="15" rx="2" fill="rgba(255,180,220,0.2)"/>
    <rect x="364" y="54" width="88" height="34" rx="6" fill="rgba(0,0,0,0.2)"/>
    <rect x="368" y="57" width="80" height="15" rx="2" fill="rgba(255,180,220,0.18)"/>
    <circle cx="165" cy="140" r="30" fill="#1a1a2e"/>
    <circle cx="165" cy="140" r="22" fill="#333"/>
    <circle cx="165" cy="140" r="12" fill="#aaa"/>
    <circle cx="165" cy="140" r="6" fill="#eee"/>
    <circle cx="430" cy="140" r="30" fill="#1a1a2e"/>
    <circle cx="430" cy="140" r="22" fill="#333"/>
    <circle cx="430" cy="140" r="12" fill="#aaa"/>
    <circle cx="430" cy="140" r="6" fill="#eee"/>
    <rect x="22" y="112" width="18" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="498" y="112" width="16" height="6" rx="2" fill="#ff4444"/>
    <path d="M290 280 L310 96" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  </svg>` },
  { id: 'luxury-sports', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 180">
    <defs><linearGradient id="g6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0d9488"/></linearGradient></defs>
    <ellipse cx="180" cy="148" rx="38" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="460" cy="148" rx="38" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M12 122 L12 102 Q12 92 22 92 L85 92 Q93 92 100 85 L126 48 Q132 40 145 40 L222 40 L254 28 Q262 24 275 24 L338 24 L378 42 L444 42 Q456 42 462 46 L486 70 Q492 76 498 82 Q504 88 510 92 L530 96 Q548 96 554 102 L554 122 Q554 132 548 134 L530 134 Q520 134 510 128 L490 114 Q480 106 468 106 L78 106 Q68 106 60 114 L46 128 Q38 134 28 134 L18 134 Q12 134 12 122Z" fill="url(#g6)"/>
    <rect x="154" y="50" width="104" height="36" rx="6" fill="rgba(0,0,0,0.25)"/>
    <rect x="158" y="53" width="96" height="16" rx="2" fill="rgba(180,255,240,0.2)"/>
    <rect x="390" y="50" width="96" height="36" rx="6" fill="rgba(0,0,0,0.2)"/>
    <rect x="394" y="53" width="88" height="16" rx="2" fill="rgba(180,255,240,0.18)"/>
    <circle cx="180" cy="140" r="32" fill="#1a1a2e"/>
    <circle cx="180" cy="140" r="24" fill="#333"/>
    <circle cx="180" cy="140" r="13" fill="#bbb"/>
    <circle cx="180" cy="140" r="6.5" fill="#eee"/>
    <circle cx="460" cy="140" r="32" fill="#1a1a2e"/>
    <circle cx="460" cy="140" r="24" fill="#333"/>
    <circle cx="460" cy="140" r="13" fill="#bbb"/>
    <circle cx="460" cy="140" r="6.5" fill="#eee"/>
    <rect x="20" y="110" width="18" height="6" rx="2" fill="#ffeb3b"/>
    <rect x="532" y="110" width="16" height="6" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'supercar', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 180">
    <defs><linearGradient id="g7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#4f46e5"/></linearGradient></defs>
    <ellipse cx="195" cy="148" rx="40" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="490" cy="148" rx="40" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M8 120 L8 100 Q8 90 18 90 L88 90 Q96 90 103 83 L130 44 Q136 36 150 36 L232 36 L268 24 Q276 20 290 20 L360 20 L402 40 L472 40 Q484 40 490 44 L516 68 Q522 74 528 80 Q534 86 540 90 L562 94 Q580 94 586 100 L586 120 Q586 130 580 132 L560 132 Q550 132 540 126 L518 112 Q508 104 496 104 L76 104 Q66 104 58 112 L44 126 Q36 132 26 132 L14 132 Q8 132 8 120Z" fill="url(#g7)"/>
    <rect x="160" y="46" width="112" height="38" rx="6" fill="rgba(0,0,0,0.25)"/>
    <rect x="164" y="49" width="104" height="17" rx="2" fill="rgba(200,200,255,0.2)"/>
    <rect x="418" y="46" width="104" height="38" rx="6" fill="rgba(0,0,0,0.2)"/>
    <rect x="422" y="49" width="96" height="17" rx="2" fill="rgba(200,200,255,0.18)"/>
    <circle cx="195" cy="140" r="34" fill="#1a1a2e"/>
    <circle cx="195" cy="140" r="25" fill="#333"/>
    <circle cx="195" cy="140" r="14" fill="#bbb"/>
    <circle cx="195" cy="140" r="7" fill="#fff"/>
    <circle cx="490" cy="140" r="34" fill="#1a1a2e"/>
    <circle cx="490" cy="140" r="25" fill="#333"/>
    <circle cx="490" cy="140" r="14" fill="#bbb"/>
    <circle cx="490" cy="140" r="7" fill="#fff"/>
    <rect x="16" y="108" width="20" height="8" rx="2" fill="#ffeb3b"/>
    <rect x="562" y="108" width="18" height="8" rx="2" fill="#ff4444"/>
  </svg>` },
  { id: 'hypercar', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 180">
    <defs><linearGradient id="g8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#dc2626"/></linearGradient></defs>
    <ellipse cx="210" cy="148" rx="42" ry="10" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="520" cy="148" rx="42" ry="10" fill="rgba(0,0,0,0.3)"/>
    <path d="M5 118 L5 98 Q5 88 15 88 L90 88 Q98 88 105 81 L134 40 Q140 32 155 32 L242 32 L280 20 Q288 16 304 16 L380 16 L424 38 L498 38 Q510 38 516 42 L544 66 Q550 72 556 78 Q562 84 568 88 L592 92 Q612 92 618 98 L618 118 Q618 128 612 130 L590 130 Q580 130 570 124 L546 110 Q536 102 524 102 L76 102 Q66 102 58 110 L44 124 Q36 130 26 130 L12 130 Q5 130 5 118Z" fill="url(#g8)"/>
    <rect x="165" y="42" width="120" height="40" rx="7" fill="rgba(0,0,0,0.25)"/>
    <rect x="169" y="45" width="112" height="18" rx="2" fill="rgba(255,200,200,0.2)"/>
    <rect x="444" y="42" width="112" height="40" rx="7" fill="rgba(0,0,0,0.2)"/>
    <rect x="448" y="45" width="104" height="18" rx="2" fill="rgba(255,200,200,0.18)"/>
    <circle cx="210" cy="140" r="36" fill="#1a1a2e"/>
    <circle cx="210" cy="140" r="27" fill="#333"/>
    <circle cx="210" cy="140" r="15" fill="#bbb"/>
    <circle cx="210" cy="140" r="7.5" fill="#fff"/>
    <circle cx="520" cy="140" r="36" fill="#1a1a2e"/>
    <circle cx="520" cy="140" r="27" fill="#333"/>
    <circle cx="520" cy="140" r="15" fill="#bbb"/>
    <circle cx="520" cy="140" r="7.5" fill="#fff"/>
    <rect x="12" y="106" width="22" height="8" rx="2" fill="#ffeb3b"/>
    <rect x="594" y="106" width="20" height="8" rx="2" fill="#00ff00"/>
    <path d="M340 280 L370 94" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
  </svg>` },
];

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

export default function CarImage({ price, className = '' }: CarImageProps) {
  const idx = getCarIndex(price);
  const gradient = carGradients[idx];

  return (
    <div className={`relative w-full aspect-[3/1] overflow-hidden bg-gradient-to-r ${gradient} ${className}`}>
      <div className="w-full h-full flex items-center justify-center p-2" dangerouslySetInnerHTML={{ __html: carSvgs[idx].svg }} />
    </div>
  );
}
