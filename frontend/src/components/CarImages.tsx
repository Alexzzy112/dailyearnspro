import Image from 'next/image';

export interface CarImageProps {
  plan?: string;
  price?: number;
  className?: string;
}

const CAR_IMAGES = [
  { name: 'Hatchback', src: '/images/products/car-1.png' },
  { name: 'Sedan', src: '/images/products/car-2.png' },
  { name: 'Premium Sedan', src: '/images/products/car-3.png' },
  { name: 'Luxury Sedan', src: '/images/products/car-4.png' },
  { name: 'Sports Car', src: '/images/products/car-5.png' },
  { name: 'Luxury Sports', src: '/images/products/car-6.png' },
  { name: 'Supercar', src: '/images/products/car-7.png' },
  { name: 'Hypercar', src: '/images/products/car-8.png' },
];

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
  return CAR_IMAGES[getCarIndex(price)].name;
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

export default function CarImage({ price, className = '' }: CarImageProps) {
  const idx = getCarIndex(price);
  const car = CAR_IMAGES[idx];
  const gradient = getCarGradient(price);

  return (
    <div className={`relative w-full aspect-[3/1] overflow-hidden bg-gradient-to-r ${gradient} ${className}`}>
      <Image
        src={car.src}
        alt={car.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 600px"
        priority
      />
    </div>
  );
}
